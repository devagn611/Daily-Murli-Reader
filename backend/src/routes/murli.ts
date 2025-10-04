import express, { type Request, type Response } from 'express';
import { 
    isValidDate, 
    fetchWithBrowserHeaders, 
    globalRateLimiter, 
    getRandomDelay,
    isBlockedResponse 
} from '../utils/utils.js';


// Get all murlis or filter by date
const getMurliData = async (req: Request, res: Response) => {
    console.log('📅 Received request for murli data with query:', req.query);
    
    try {
        const { date, language = 'hi' } = req.query;
        const targetDate = date as string || new Date().toISOString().split('T')[0];

        if (date && !isValidDate(targetDate)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'Date must be in YYYY-MM-DD format'
            });
        }

        // Apply rate limiting
        await globalRateLimiter.waitIfNeeded();

        // Construct the URL for fetching murli data
        const baseUrl = process.env.API_BASE_URL || '';
       
        const murliUrl = `${baseUrl}/murlis/${language}/html/murli-${targetDate}.html`;
       

        // Add human-like delay
        // await getRandomDelay(500, 1500);

        // Fetch with browser-like headers
        const response = await fetchWithBrowserHeaders(murliUrl, {
            method: 'GET',
            timeout: parseInt(process.env.REQUEST_TIMEOUT || '1500'),
            retries: parseInt(process.env.REQUEST_RETRIES || '3'),
            retryDelay: parseInt(process.env.REQUEST_RETRY_DELAY || '2000'),
            useRotatingUserAgent: true
        });

        // Read the response content once
        const content = await response.text();
        
        // Check if response indicates blocking
        // if (await isBlockedResponse(response)) {
        //     console.log('⚠️ Detected potential blocking, adjusting strategy...');
        //     await getRandomDelay(2000, 5000);
            
        //     // Retry with different user agent
        //     const retryResponse = await fetchWithBrowserHeaders(murliUrl, {
        //         method: 'GET',
        //         timeout: 1500,
        //         useRandomUserAgent: true
        //     });
            
        //     if (!retryResponse.ok) {
        //         throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
        //     }
            
        //     const retryContent = await retryResponse.text();
        //     return res.json({
        //         message: 'Murli data fetched successfully (retry)',
        //         filters: { date: targetDate, language },
        //         data: {
        //             title: `Murli for ${targetDate}`,
        //             date: targetDate,
        //             content: retryContent,
        //             language: language as string,
        //             fetchedAt: new Date().toISOString(),
        //             source: murliUrl
        //         }
        //     });
        // }

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        res.json({
            message: 'Murli data fetched successfully',
            filters: { date: targetDate, language },
            data: {
                title: `Murli for ${targetDate}`,
                date: targetDate,
                content: content,
                language: language as string,
                fetchedAt: new Date().toISOString(),
                source: murliUrl
            }
        });

    } catch (error) {
        console.error('❌ Error fetching murli data:', error);
        
        // Specific error handling for common issues
        let statusCode = 500;
        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof Error) {
            if (error.message.includes('timeout') || error.message.includes('AbortError')) {
                statusCode = 408; // Request Timeout
                errorMessage = 'Request timed out. The external service is taking too long to respond.';
            } else if (error.message.includes('fetch')) {
                statusCode = 503; // Service Unavailable
                errorMessage = 'External service is currently unavailable. Please try again later.';
            } else {
                errorMessage = error.message;
            }
        }
        
        res.status(statusCode).json({
            error: 'Failed to fetch murli data',
            message: errorMessage,
            timestamp: new Date().toISOString(),
            requestId: Math.random().toString(36).substring(7) // For debugging
        });
    }
};

// Get murli data via POST request with payload
const getMurliDataPost = async (req: Request, res: Response) => {
    console.log('📅 Received POST request for murli data with body:', req.body);
    
    try {
        const { date, language = 'hi' } = req.body;
        const targetDate = date || new Date().toISOString().split('T')[0];

        if (date && !isValidDate(targetDate)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'Date must be in YYYY-MM-DD format'
            });
        }

        // Construct the URL for fetching murli data
        const baseUrl = process.env.API_BASE_URL || 'https://www.brahmakumaris.org';
        const murliUrl = `${baseUrl}/murlis/${language}/html/murli-${targetDate}.html`;
        

        // Fetch with browser-like headers (optimized for speed)
        const response = await fetchWithBrowserHeaders(murliUrl, {
            method: 'GET',
            timeout: parseInt(process.env.REQUEST_TIMEOUT || '1500'),
            retries: parseInt(process.env.REQUEST_RETRIES || '3'),
            retryDelay: parseInt(process.env.REQUEST_RETRY_DELAY || '2000'),
            useRotatingUserAgent: true
        });

        // Read the response content once
        const content = await response.text();
        
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        

        res.json({
            message: 'Murli data fetched successfully',
            filters: { date: targetDate, language },
            data: {
                title: `Murli for ${targetDate}`,
                date: targetDate,
                content: content,
                language: language as string,
                fetchedAt: new Date().toISOString(),
                source: murliUrl
            }
        });

    } catch (error) {
        console.error('❌ Error fetching murli data:', error);
        
        res.status(500).json({
            error: 'Failed to fetch murli data',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
};

// Get murli by specific date
const getMurliByDate = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const { language = 'english' } = req.query;

        // Validate date format (YYYY-MM-DD)
        if (!isValidDate(date)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'Date must be in YYYY-MM-DD format'
            });
        }

        // Apply rate limiting
        await globalRateLimiter.waitIfNeeded();

        // Construct the URL for fetching specific murli
        const baseUrl = process.env.API_BASE_URL || 'https://www.brahmakumaris.org';
        const murliUrl = `${baseUrl}/murlis/${language}/html/murli-${date}.html`;
        
        console.log(`🔍 Fetching specific murli for ${date} from: ${murliUrl}`);

        // Add human-like delay
        await getRandomDelay(500, 1500);

        // Fetch with browser-like headers
        const response = await fetchWithBrowserHeaders(murliUrl, {
            method: 'GET',
            timeout: parseInt(process.env.REQUEST_TIMEOUT || '1500'),
            retries: parseInt(process.env.REQUEST_RETRIES || '3'),
            retryDelay: parseInt(process.env.REQUEST_RETRY_DELAY || '2000'),
            useRotatingUserAgent: true
        });

        // Check if response indicates blocking
        if (await isBlockedResponse(response)) {
            console.log('⚠️ Detected potential blocking, implementing fallback strategy...');
            await getRandomDelay(3000, 6000);
            
            // Retry with different approach
            const retryResponse = await fetchWithBrowserHeaders(murliUrl, {
                method: 'GET',
                timeout: parseInt(process.env.REQUEST_TIMEOUT || '20000'),
                useRandomUserAgent: true,
                retries: 2
            });
            
            if (!retryResponse.ok) {
                throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
            }
            
            const retryContent = await retryResponse.text();
            return res.json({
                message: `Murli for ${date} (recovered)`,
                data: {
                    title: `Murli for ${date}`,
                    date,
                    content: retryContent,
                    language: language as string,
                    fetchedAt: new Date().toISOString(),
                    source: murliUrl,
                    recoveryMode: true
                }
            });
        }

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({
                    error: 'Murli not found',
                    message: `No murli available for ${date} in ${language}`,
                    date,
                    language
                });
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();

        res.json({
            message: `Murli for ${date}`,
            data: {
                title: `Murli for ${date}`,
                date,
                content: content,
                language: language as string,
                fetchedAt: new Date().toISOString(),
                source: murliUrl
            }
        });

    } catch (error) {
        console.error(`❌ Error fetching murli for ${req.params.date}:`, error);
        
        res.status(500).json({
            error: 'Failed to fetch murli',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            date: req.params.date,
            timestamp: new Date().toISOString()
        });
    }
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
        // const baseUrl = process.env.API_BASE_URL || 'https://www.brahmakumaris.org';
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
                await getRandomDelay(1000, 2000);
                
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

