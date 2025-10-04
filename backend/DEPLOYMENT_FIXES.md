# Netlify Deployment Fixes

## Issues Fixed

### 1. **Timeout Issues**
- ❌ **Problem**: Short timeouts (1500ms) causing "message port closed" errors
- ✅ **Fix**: Increased timeouts to 15-20 seconds with environment variable configuration
- ✅ **Added**: Better timeout handling and exponential backoff for retries
- ✅ **Added**: Request timeout middleware (25s for Netlify compatibility)

### 2. **Error Handling**
- ❌ **Problem**: Generic error messages making debugging difficult
- ✅ **Fix**: Added specific error handling for timeout, network, and fetch errors
- ✅ **Added**: Request IDs for better debugging
- ✅ **Added**: HTTP status codes (408 for timeout, 503 for service unavailable)

### 3. **CORS Configuration**
- ❌ **Problem**: CORS issues with production frontend URLs
- ✅ **Fix**: Updated allowed origins to include your Netlify frontend URL
- ✅ **Added**: Better CORS logging and preflight caching

### 4. **Netlify-Specific Issues**
- ✅ **Added**: `netlify.toml` configuration file
- ✅ **Added**: Netlify Functions timeout (26s max)
- ✅ **Added**: Memory allocation settings
- ✅ **Added**: Build configuration for TypeScript

## Environment Variables to Set on Netlify

In your Netlify dashboard, set these environment variables:

```bash
NODE_ENV=production
PORT=8888
API_BASE_URL=https://madhubanmurli.org
FRONTEND_URL=https://madhuban-murli-reader.netlify.app
REQUEST_TIMEOUT=20000
REQUEST_RETRIES=3
REQUEST_RETRY_DELAY=2000
USE_RANDOM_USER_AGENT=false
USE_ROTATING_USER_AGENT=true
USER_AGENT_ROTATION_INTERVAL=300000
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_TIME_WINDOW=60000
```

## Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - The `netlify.toml` file will handle the configuration
   - Functions will have 26-second timeout
   - Memory allocation: 1024MB

3. **Test the deployment**:
   - Health check: `https://your-netlify-url.netlify.app/murli/health`
   - API endpoint: `https://your-netlify-url.netlify.app/murli?date=2024-01-01`

## Key Changes Made

### 1. **Increased Timeouts**
```typescript
// Before: 1500ms
timeout: 1500

// After: Environment-configurable with 15-20s default
timeout: parseInt(process.env.REQUEST_TIMEOUT || '15000')
```

### 2. **Better Error Messages**
```typescript
// Before: Generic error
message: error instanceof Error ? error.message : 'Unknown error occurred'

// After: Specific error handling
if (error.message.includes('timeout') || error.message.includes('AbortError')) {
  statusCode = 408;
  errorMessage = 'Request timed out. The external service is taking too long to respond.';
}
```

### 3. **Enhanced Fetch Function**
- Exponential backoff for retries
- Better timeout management
- Detailed logging for debugging
- Specific error messages for different failure types

### 4. **Request Timeout Middleware**
- Prevents long-running requests
- Compatible with Netlify's 26-second function limit
- Graceful timeout handling

## Testing the Fix

After deployment, test these endpoints:

1. **Health Check**:
   ```
   GET https://your-netlify-url.netlify.app/murli/health
   ```

2. **Murli Data**:
   ```
   GET https://your-netlify-url.netlify.app/murli?date=2024-01-01&language=hi
   ```

3. **System Status**:
   ```
   GET https://your-netlify-url.netlify.app/murli/system/status
   ```

## Expected Improvements

- ✅ No more "message port closed" errors
- ✅ Better error messages for debugging
- ✅ Proper CORS handling
- ✅ Timeout handling suitable for serverless environment
- ✅ Better retry logic with exponential backoff
- ✅ Request debugging with unique IDs