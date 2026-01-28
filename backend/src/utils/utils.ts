// ============================================
// DATE UTILITIES
// ============================================

export function isValidDate(date: string): boolean {
  // Checks for YYYY-MM-DD format and valid date
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime()) && date === d.toISOString().split('T')[0];
}

export const languageList = ["hi","en","gu","es","th"]

// ============================================
// USER AGENT MANAGEMENT
// ============================================

// Interface for browser fingerprint
interface BrowserFingerprint {
  userAgent: string;
  acceptLanguage: string;
  acceptEncoding: string;
  accept: string;
  connection: string;
  upgradeInsecureRequests: string;
  secFetchDest: string;
  secFetchMode: string;
  secFetchSite: string;
  secFetchUser: string;
  cacheControl: string;
  dnt: string;
}

// World-class User-Agent strings (latest versions as of 2024)
const USER_AGENTS = {
  chrome: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  ],
  firefox: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux i686; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
  ],
  safari: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
  ],
  edge: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  ]
};

// Advanced browser fingerprinting
const BROWSER_FINGERPRINTS: Record<string, BrowserFingerprint> = {
  chrome_windows: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    acceptLanguage: 'en-US,en;q=0.9',
    acceptEncoding: 'gzip, deflate, br',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    connection: 'keep-alive',
    upgradeInsecureRequests: '1',
    secFetchDest: 'document',
    secFetchMode: 'navigate',
    secFetchSite: 'none',
    secFetchUser: '?1',
    cacheControl: 'max-age=0',
    dnt: '1'
  },
  firefox_windows: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    acceptLanguage: 'en-US,en;q=0.5',
    acceptEncoding: 'gzip, deflate, br',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    connection: 'keep-alive',
    upgradeInsecureRequests: '1',
    secFetchDest: 'document',
    secFetchMode: 'navigate',
    secFetchSite: 'none',
    secFetchUser: '?1',
    cacheControl: 'max-age=0',
    dnt: '1'
  },
  safari_mac: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    acceptLanguage: 'en-US,en;q=0.9',
    acceptEncoding: 'gzip, deflate, br',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    connection: 'keep-alive',
    upgradeInsecureRequests: '1',
    secFetchDest: 'document',
    secFetchMode: 'navigate',
    secFetchSite: 'none',
    secFetchUser: '?1',
    cacheControl: 'max-age=0',
    dnt: '1'
  }
};

// User-Agent rotation state
let currentUserAgentIndex = 0;
let lastRotationTime = Date.now();
const ROTATION_INTERVAL = 300000; // 5 minutes

/**
 * Get a random User-Agent string
 */
export function getRandomUserAgent(): string {
  const browsers = Object.keys(USER_AGENTS);
  const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)] as keyof typeof USER_AGENTS;
  const browserAgents = USER_AGENTS[randomBrowser];
  return browserAgents[Math.floor(Math.random() * browserAgents.length)];
}

/**
 * Get a rotating User-Agent (changes every 5 minutes)
 */
export function getRotatingUserAgent(): string {
  const now = Date.now();
  const allUserAgents = Object.values(USER_AGENTS).flat();
  
  if (now - lastRotationTime > ROTATION_INTERVAL) {
    currentUserAgentIndex = (currentUserAgentIndex + 1) % allUserAgents.length;
    lastRotationTime = now;
  }
  
  return allUserAgents[currentUserAgentIndex];
}

/**
 * Get a complete browser fingerprint
 */
export function getBrowserFingerprint(browser?: keyof typeof BROWSER_FINGERPRINTS): BrowserFingerprint {
  const browsers = Object.keys(BROWSER_FINGERPRINTS);
  const selectedBrowser = browser || browsers[Math.floor(Math.random() * browsers.length)] as keyof typeof BROWSER_FINGERPRINTS;
  return { ...BROWSER_FINGERPRINTS[selectedBrowser] };
}

/**
 * Get default headers that mimic a real browser
 */
export function getDefaultBrowserHeaders(customUserAgent?: string): Record<string, string> {
  const fingerprint = getBrowserFingerprint();
  
  return {
    'User-Agent': customUserAgent || fingerprint.userAgent,
    'Accept': fingerprint.accept,
    'Accept-Language': fingerprint.acceptLanguage,
    'Accept-Encoding': fingerprint.acceptEncoding,
    'Connection': fingerprint.connection,
    'Upgrade-Insecure-Requests': fingerprint.upgradeInsecureRequests,
    'Sec-Fetch-Dest': fingerprint.secFetchDest,
    'Sec-Fetch-Mode': fingerprint.secFetchMode,
    'Sec-Fetch-Site': fingerprint.secFetchSite,
    'Sec-Fetch-User': fingerprint.secFetchUser,
    'Cache-Control': fingerprint.cacheControl,
    'DNT': fingerprint.dnt,
    'Pragma': 'no-cache'
  };
}

// ============================================
// HTTP CLIENT UTILITIES
// ============================================

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  useRandomUserAgent?: boolean;
  useRotatingUserAgent?: boolean;
  followRedirects?: boolean;
}

/**
 * Enhanced fetch with browser-like behavior
 */
export async function fetchWithBrowserHeaders(
  url: string, 
  options: FetchOptions = {}
): Promise<Response> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 15000, // Increased default timeout
    retries = 3,
    retryDelay = 1000,
    useRandomUserAgent = false,
    useRotatingUserAgent = true,
    followRedirects = true
  } = options;

  let userAgent: string;
  if (useRandomUserAgent) {
    userAgent = getRandomUserAgent();
  } else if (useRotatingUserAgent) {
    userAgent = getRotatingUserAgent();
  } else {
    userAgent = headers['User-Agent'] || getRandomUserAgent();
  }

  const browserHeaders = getDefaultBrowserHeaders(userAgent);
  const finalHeaders = { ...browserHeaders, ...headers };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout;
    
    try {
      // Set up timeout
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      const fetchOptions: RequestInit = {
        method,
        headers: finalHeaders,
        body,
        signal: controller.signal,
        redirect: followRedirects ? 'follow' : 'manual'
      };

      console.log(`🔄 Attempt ${attempt}/${retries} - Fetching: ${url}`);
      const response = await fetch(url, fetchOptions);
      
      clearTimeout(timeoutId);
      console.log(`✅ Request successful on attempt ${attempt}`);
      return response;
      
    } catch (error) {
      clearTimeout(timeoutId!);
      
      console.log(`⚠️ Attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : 'Unknown error');
      
      if (attempt === retries) {
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms - The external service is taking too long to respond`);
          } else if (error.message.includes('fetch')) {
            throw new Error(`Network error: Unable to connect to the external service`);
          }
        }
        throw new Error(`Failed to fetch after ${retries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unexpected error in fetchWithBrowserHeaders');
}

/**
 * Simulate human-like delays between requests
 */
export function getRandomDelay(min: number = 1000, max: number = 3000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Rate limiter to prevent too many requests
 */
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number = 60, timeWindow: number = 60000) { // 60 requests per minute by default
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

// ============================================
// RESPONSE UTILITIES
// ============================================

/**
 * Check if response looks like it's from an anti-bot system
 */
export async function isBlockedResponse(response: Response): Promise<boolean> {
  const status = response.status;
  const contentType = response.headers.get('content-type') || '';
  
  // Common anti-bot indicators
  if (status === 403 || status === 429 || status === 503) {
    return true;
  }
  
  // Check for common anti-bot services
  const server = response.headers.get('server') || '';
  const cfRay = response.headers.get('cf-ray');
  const cloudflare = response.headers.get('cf-cache-status');
  
  if (cfRay || cloudflare || server.includes('cloudflare')) {
    return status >= 400;
  }
  
  return false;
}

// ============================================
// CACHING UTILITIES
// ============================================

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number; // Time to live in milliseconds

  constructor(defaultTTL: number = 24 * 60 * 60 * 1000) { // Default: 24 hours
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every hour
    setInterval(() => {
      this.cleanExpiredEntries();
    }, 60 * 60 * 1000);
  }

  /**
   * Generate cache key from date and language
   */
  generateKey(date: string, language: string): string {
    return `murli:${date}:${language}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get(date: string, language: string): any | null {
    const key = this.generateKey(date, language);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry with TTL
   */
  set(date: string, language: string, data: any, ttl?: number): void {
    const key = this.generateKey(date, language);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(date: string, language: string): boolean {
    const key = this.generateKey(date, language);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete specific cache entry
   */
  delete(date: string, language: string): void {
    const key = this.generateKey(date, language);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries from cache
   */
  cleanExpiredEntries(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: Array<{ key: string; age: number; expiresIn: number }> } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      expiresIn: entry.expiresAt - Date.now()
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}

// Global cache manager instance
// Cache TTL: 24 hours (murlis don't change for a specific date)
export const murliCache = new CacheManager(24 * 60 * 60 * 1000);
