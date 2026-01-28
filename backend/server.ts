import 'dotenv/config';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import routes from './src/routes.js';
import { murliCache } from './src/utils/utils.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS Configuration
// ============================================
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.FRONTEND_URL?.split(',') || [
      'https://madhuban-murli-reader.netlify.app',
      'https://murli.devagn.com',
      'http://localhost:5173',
      'http://localhost:3000',
    ])
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', process.env.FRONTEND_URL].filter((url): url is string => Boolean(url));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('🔧 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'date', 'language'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  maxAge: 86400 // Cache preflight response for 24 hours
}));

// ============================================
// Body Parsing Middleware
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// Caching Middleware for Murli Routes
// ============================================
interface CacheableRequest extends Request {
  cacheKey?: string;
  skipCache?: boolean;
}

/**
 * Middleware to check cache before processing murli requests
 * Works for GET /murli, GET /murli/:date, and POST /murli routes
 */
const murliCacheMiddleware = async (req: CacheableRequest, res: Response, next: NextFunction) => {
  // Only cache GET and POST requests to murli endpoints
  if (req.method !== 'GET' && req.method !== 'POST') {
    return next();
  }

  // Skip cache if explicitly requested
  if (req.query.skipCache === 'true' || req.body?.skipCache === true) {
    req.skipCache = true;
    return next();
  }

  try {
    // Extract date and language from request
    let date: string;
    let language: string;

    if (req.method === 'GET') {
      // For GET /murli/:date route
      if (req.params.date) {
        date = req.params.date;
        language = (req.query.language as string) || 'hi';
      } 
      // For GET /murli route
      else {
        date = (req.query.date as string) || new Date().toISOString().split('T')[0];
        language = (req.query.language as string) || 'hi';
      }
    } 
    // For POST /murli route
    else {
      date = req.body?.date || new Date().toISOString().split('T')[0];
      language = req.body?.language || 'hi';
    }

    // Check if cached data exists
    const cachedData = murliCache.get(date, language);

    if (cachedData) {
      console.log(`✅ Cache HIT for date: ${date}, language: ${language}`);
      
      // Add cache headers
      res.set({
        'X-Cache': 'HIT',
        'X-Cache-Date': date,
        'X-Cache-Language': language,
        'Cache-Control': 'public, max-age=86400' // 24 hours
      });

      return res.json({
        ...cachedData,
        cached: true,
        cachedAt: new Date().toISOString()
      });
    }

    console.log(`❌ Cache MISS for date: ${date}, language: ${language}`);
    
    // Store cache key for later use
    req.cacheKey = `${date}:${language}`;
    
    // Store date and language in request for later use
    (req as any).cacheDate = date;
    (req as any).cacheLanguage = language;
    
    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function(body: any) {
      // Only cache successful responses (status 200) with valid data
      if (res.statusCode === 200 && body && body.data && !body.error) {
        const cacheDate = (req as any).cacheDate;
        const cacheLanguage = (req as any).cacheLanguage;
        
        if (cacheDate && cacheLanguage) {
          console.log(`💾 Caching response for date: ${cacheDate}, language: ${cacheLanguage}`);
          murliCache.set(cacheDate, cacheLanguage, body);
          
          // Add cache headers
          res.set({
            'X-Cache': 'MISS',
            'X-Cache-Date': cacheDate,
            'X-Cache-Language': cacheLanguage,
            'Cache-Control': 'public, max-age=86400' // 24 hours
          });
        }
      } else {
        // Add cache headers even for non-cached responses
        res.set({
          'X-Cache': 'MISS',
          'Cache-Control': 'no-cache'
        });
      }
      
      return originalJson(body);
    };

    next();
  } catch (error) {
    // If cache check fails, continue without caching
    console.error('⚠️ Cache middleware error:', error);
    next();
  }
};

// ============================================
// Request Timeout Middleware
// ============================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const timeout = parseInt(process.env.REQUEST_TIMEOUT || '25000');
  
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        error: 'Request timeout',
        message: 'The request took too long to process',
        timestamp: new Date().toISOString()
      });
    }
  }, timeout);

  // Clear timeout when response is finished
  res.on('finish', () => {
    clearTimeout(timeoutId);
  });

  next();
});

// ============================================
// Routes
// ============================================
// Apply caching middleware to murli routes
app.use('/murli', murliCacheMiddleware, routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Daily Murli Reader API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    cache: {
      enabled: true,
      stats: murliCache.getStats()
    }
  });
});

// Cache management route (for debugging/admin)
app.get('/cache/stats', (req: Request, res: Response) => {
  res.json({
    cache: murliCache.getStats(),
    timestamp: new Date().toISOString()
  });
});

app.post('/cache/clear', (req: Request, res: Response) => {
  murliCache.clear();
  res.json({
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Error Handling Middleware
// ============================================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Start Server
// ============================================
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('🚀 Daily Murli Reader API Server');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Caching: Enabled (24h TTL)`);
    console.log(`🔒 CORS: Enabled for ${allowedOrigins.length} origin(s)`);
  });
}

export default app;
