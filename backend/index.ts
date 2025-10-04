import 'dotenv/config';
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import routes from './src/routes.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.FRONTEND_URL?.split(',') || [
      'https://madhuban-murli-reader.netlify.app',
      'https://your-frontend-domain.com'
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request timeout middleware (25 seconds for Netlify compatibility)
app.use((req: Request, res: Response, next) => {
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


// Routes
app.use('/murli', routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Daily Murli Reader API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      userAgentRotation: true,
      rateLimiting: true,
      browserFingerprinting: true,
      requestRetries: true,
      humanLikeDelays: true
    },
    endpoints: {
      murli: `/murli`,
      murliByDate: `/murli/:date`,
      languages: `/murli/languages/available`,
      systemStatus: `/murli/system/status`,
      testUserAgent: `/murli/system/test-user-agent`,
      health: `/murli/health`
    }
  });
});

// 404 handler - catch all unmatched routes
app.use((req: Request, res: Response, next) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

app.listen(PORT, () => {
  console.log('🚀 Daily Murli Reader API Server');
  
 
});

export default app;
