/**
 * Frontend utility to fetch Murli HTML directly from madhubanmurli.org
 * This bypasses Cloudflare challenges by using the browser's cookies and session
 */

export const MURLI_BASE_URL = 'https://madhubanmurli.org';

export interface MurliFetchOptions {
  date: string;
  language: string;
}

export interface MurliFetchResult {
  content: string;
  date: string;
  language: string;
  sourceUrl: string;
  fetchedAt: string;
}

export interface MurliFetchError {
  error: string;
  message: string;
  isCloudflareChallenge: boolean;
  sourceUrl: string;
}

/**
 * Check if the HTML content is a Cloudflare challenge page
 */
function isCloudflareChallenge(html: string): boolean {
  return (
    html.includes('Just a moment') ||
    html.includes('challenge-platform') ||
    html.includes('cf-chl-opt') ||
    html.includes('Enable JavaScript and cookies') ||
    html.includes('Checking your browser before accessing')
  );
}

/**
 * Fetch Murli HTML directly from madhubanmurli.org
 * The browser will automatically include cf_clearance cookie if the user has solved the challenge
 */
export async function fetchMurli(options: MurliFetchOptions): Promise<MurliFetchResult> {
  const { date, language } = options;
  
  // Build the URL with optional bypass timestamp (like the curl example)
  const bypassTimestamp = Date.now();
  const murliUrl = `${MURLI_BASE_URL}/murlis/${language}/html/murli-${date}.html`;

  try {
    // Use fetch with CORS mode - browser will automatically send cookies (including cf_clearance)
    const response = await fetch(murliUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Check for Cloudflare challenge page
    if (isCloudflareChallenge(html)) {
      const error: MurliFetchError = {
        error: 'Cloudflare challenge detected',
        message: 'Please open madhubanmurli.org in a separate tab, complete any security check, then return here and retry.',
        isCloudflareChallenge: true,
        sourceUrl: murliUrl,
      };
      throw error;
    }

    return {
      content: html,
      date,
      language,
      sourceUrl: murliUrl,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Re-throw if it's already a MurliFetchError
    if (error && typeof error === 'object' && 'isCloudflareChallenge' in error) {
      throw error;
    }

    // Wrap other errors
    const fetchError: MurliFetchError = {
      error: 'Failed to fetch Murli',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      isCloudflareChallenge: false,
      sourceUrl: murliUrl,
    };
    throw fetchError;
  }
}

/**
 * Cache Murli content in localStorage
 */
const CACHE_PREFIX = 'murli_cache_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedMurli(date: string, language: string): MurliFetchResult | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${date}_${language}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now > parsed.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error reading Murli cache:', error);
    return null;
  }
}

export function setCachedMurli(result: MurliFetchResult): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${result.date}_${result.language}`;
    const expiresAt = Date.now() + CACHE_TTL;
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: result,
      expiresAt,
    }));
  } catch (error) {
    console.error('Error caching Murli:', error);
    // Ignore quota exceeded errors
  }
}

/**
 * Fetch Murli with caching support
 */
export async function fetchMurliWithCache(options: MurliFetchOptions): Promise<MurliFetchResult> {
  // Check cache first - ensure it matches both date AND language
  const cached = getCachedMurli(options.date, options.language);
  if (cached && cached.language === options.language && cached.date === options.date) {
    return cached;
  }

  // Fetch fresh data
  const result = await fetchMurli(options);
  
  // Validate result before caching
  if (result && result.content && result.language === options.language && result.date === options.date) {
    // Cache the result
    setCachedMurli(result);
    return result;
  }
  
  throw new Error('Invalid response: content, language, or date mismatch');
}
