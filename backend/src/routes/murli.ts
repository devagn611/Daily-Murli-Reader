import express, { type Request, type Response } from 'express';
import { 
    isValidDate, 
    fetchWithBrowserHeaders, 
    globalRateLimiter, 
    getRandomDelay,
    isBlockedResponse, 
    languageList
} from '../utils/utils.js';


// Get all murlis or filter by date
// DEPRECATED: This endpoint no longer fetches Murli HTML directly.
// The frontend now fetches Murli HTML directly from madhubanmurli.org to bypass Cloudflare challenges.
const getMurliData = async (req: Request, res: Response) => {
    console.log('📅 GET Received request for murli data with query:', req.query);
    
    const { date, language = 'hi' } = req.query;
    const targetDate = date as string || new Date().toISOString().split('T')[0];

    if (date && !isValidDate(targetDate)) {
        return res.status(400).json({
            error: 'Invalid date format',
            message: 'Date must be in YYYY-MM-DD format'
        });
    }

    // Return deprecation message
    res.status(410).json({
        error: 'Endpoint deprecated',
        message: 'Murli HTML is now fetched directly from madhubanmurli.org in the browser to bypass Cloudflare challenges. Please use the frontend application.',
        filters: { date: targetDate, language },
        migration: {
            note: 'The frontend now handles all Murli HTML fetching directly',
            reason: 'Cloudflare JavaScript challenges cannot be solved server-side',
            timestamp: new Date().toISOString()
        }
    });
};

// Get murli data via POST request with payload
// DEPRECATED: This endpoint no longer fetches Murli HTML directly.
// The frontend now fetches Murli HTML directly from madhubanmurli.org to bypass Cloudflare challenges.
const getMurliDataPost = async (req: Request, res: Response) => {
    console.log('📅 Received POST request for murli data with body:', req.body);
    
    const { date, language = 'hi' } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (date && !isValidDate(targetDate)) {
        return res.status(400).json({
            error: 'Invalid date format',
            message: 'Date must be in YYYY-MM-DD format'
        });
    }

    // Return deprecation message
    res.status(410).json({
        error: 'Endpoint deprecated',
        message: 'Murli HTML is now fetched directly from madhubanmurli.org in the browser to bypass Cloudflare challenges. Please use the frontend application.',
        filters: { date: targetDate, language },
        migration: {
            note: 'The frontend now handles all Murli HTML fetching directly',
            reason: 'Cloudflare JavaScript challenges cannot be solved server-side',
            timestamp: new Date().toISOString()
        }
    });
};

// Get murli by specific date
// DEPRECATED: This endpoint no longer fetches Murli HTML directly.
// The frontend now fetches Murli HTML directly from madhubanmurli.org to bypass Cloudflare challenges.
const getMurliByDate = async (req: Request, res: Response) => {
    const { date } = req.params;
    const { language = 'hi' } = req.query;

    // Validate date format (YYYY-MM-DD)
    if (!isValidDate(date)) {
        return res.status(400).json({
            error: 'Invalid date format',
            message: 'Date must be in YYYY-MM-DD format'
        });
    }

    const languageStr = language as string;
    if (!languageList.includes(languageStr)) {
        return res.status(400).json({
            error: 'Invalid language',
            message: `Language must be one of: ${languageList.join(', ')}`,
            provided: languageStr,
            available: languageList
        });
    }

    // Return deprecation message
    res.status(410).json({
        error: 'Endpoint deprecated',
        message: 'Murli HTML is now fetched directly from madhubanmurli.org in the browser to bypass Cloudflare challenges. Please use the frontend application.',
        filters: { date, language },
        migration: {
            note: 'The frontend now handles all Murli HTML fetching directly',
            reason: 'Cloudflare JavaScript challenges cannot be solved server-side',
            timestamp: new Date().toISOString()
        }
    });
};

// Get available languages
const getAvailableLanguages = async (req: Request, res: Response) => {
    try {
        // Apply rate limiting for this request too
        await globalRateLimiter.waitIfNeeded();
        
        console.log('🌐 Fetching available languages...');

        // Static list of known supported languages
        // In a production app, you might want to fetch this dynamically
        const languages = [
           { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi' },
            { code: 'gu', name: 'Gujarati' },
            { code: 'bn', name: 'Bengali' },
            { code: 'ta', name: 'Tamil' },
            { code: 'te', name: 'Telugu' },
            { code: 'mr', name: 'Marathi' },
            { code: 'kn', name: 'Kannada' }
        ];

        // You could also validate language availability by making test requests
        // const baseUrl = process.env.API_BASE_URL || '' ;
        // const testDate = new Date().toISOString().split('T')[0];
        

        res.json({
            languages,
            totalCount: languages.length,
            lastUpdated: new Date().toISOString(),
            message: 'Available languages retrieved successfully'
        });

    } catch (error) {
        console.error('❌ Error fetching available languages:', error);
        
        res.status(500).json({
            error: 'Failed to fetch available languages',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
};

// Test User-Agent system
const testUserAgent = async (req: Request, res: Response) => {
    try {
        console.log('🧪 Testing User-Agent system...');
        
        // Test URL that returns request headers (useful for debugging)
        const testUrl = 'https://httpbin.org/headers';
        
        // Apply rate limiting
        await globalRateLimiter.waitIfNeeded();
        
        // Test different User-Agent strategies
        const tests = [
            { name: 'Random User-Agent', useRandomUserAgent: true },
            { name: 'Rotating User-Agent', useRotatingUserAgent: true },
            { name: 'Default Headers', useRotatingUserAgent: false }
        ];
        
        const results = [];
        
        for (const test of tests) {
            try {
                await getRandomDelay(1000, 1200);
                
                const response = await fetchWithBrowserHeaders(testUrl, {
                    method: 'GET',
                    timeout: 10000,
                    ...test
                });
                
                if (response.ok) {
                    const data = await response.json() as { headers: Record<string, string> };
                    results.push({
                        test: test.name,
                        success: true,
                        headers: data.headers,
                        status: response.status
                    });
                } else {
                    results.push({
                        test: test.name,
                        success: false,
                        status: response.status,
                        error: `HTTP ${response.status}`
                    });
                }
            } catch (error) {
                results.push({
                    test: test.name,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        
        console.log('✅ User-Agent system test completed');
        
        res.json({
            message: 'User-Agent system test results',
            timestamp: new Date().toISOString(),
            results,
            summary: {
                totalTests: tests.length,
                successfulTests: results.filter(r => r.success).length,
                failedTests: results.filter(r => !r.success).length
            }
        });
        
    } catch (error) {
        console.error('❌ User-Agent test failed:', error);
        
        res.status(500).json({
            error: 'User-Agent test failed',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
};

// Get system status and statistics
const getSystemStatus = async (req: Request, res: Response) => {
    try {
        const { getRandomUserAgent, getRotatingUserAgent, getBrowserFingerprint } = await import('../utils/utils');
        
        res.json({
            message: 'System status',
            timestamp: new Date().toISOString(),
            status: 'operational',
            userAgent: {
                current: getRotatingUserAgent(),
                random: getRandomUserAgent(),
                fingerprint: getBrowserFingerprint()
            },
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            },
            config: {
                apiBaseUrl: process.env.API_BASE_URL || 'Not configured',
                rateLimitEnabled: true,
                maxRetries: 3,
                defaultTimeout: 1500
            }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get system status',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
};

// Export the methods for use in other files
export const murliMethods = {
    getMurliData,
    getMurliDataPost,
    getMurliByDate,
    getAvailableLanguages,
    testUserAgent,
    getSystemStatus
};

