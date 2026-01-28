/**
 * Utility to extract metadata from HTML content fetched from madhubanmurli.org
 */

/**
 * Extract title from HTML content
 */
export function extractTitle(html: string): string | null {
  if (!html) return null;

  // Try to extract from <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Try to extract from <h1> tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  // Try to extract from first heading
  const headingMatch = html.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim();
  }

  return null;
}

/**
 * Extract description from HTML content
 */
export function extractDescription(html: string): string | null {
  if (!html) return null;

  // Try to extract from meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch && metaDescMatch[1]) {
    return metaDescMatch[1].trim();
  }

  // Try to extract from first paragraph
  const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
  if (pMatch && pMatch[1]) {
    const text = pMatch[1].trim();
    if (text.length > 50) {
      return text.substring(0, 160) + (text.length > 160 ? '...' : '');
    }
    return text;
  }

  // Try to extract from first div with content
  const divMatch = html.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([^<]+)/i);
  if (divMatch && divMatch[1]) {
    const text = divMatch[1].trim();
    if (text.length > 50) {
      return text.substring(0, 160) + (text.length > 160 ? '...' : '');
    }
    return text;
  }

  return null;
}

/**
 * Extract main content text from HTML (for generating description)
 */
export function extractContentText(html: string, maxLength: number = 200): string {
  if (!html) return '';

  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > maxLength) {
    // Try to cut at sentence boundary
    const cutText = text.substring(0, maxLength);
    const lastPeriod = cutText.lastIndexOf('.');
    const lastExclamation = cutText.lastIndexOf('!');
    const lastQuestion = cutText.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > maxLength * 0.7) {
      return cutText.substring(0, lastSentenceEnd + 1);
    }
    
    return cutText + '...';
  }

  return text;
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  date: string,
  language: string,
  fallback?: string
): string {
  // Try to extract description from content
  const extractedDesc = extractDescription(content);
  if (extractedDesc && extractedDesc.length >= 50) {
    return extractedDesc;
  }

  // Try to extract text from content
  const contentText = extractContentText(content, 150);
  if (contentText && contentText.length >= 50) {
    return contentText;
  }

  // Use fallback or generate default
  if (fallback) {
    return fallback;
  }

  return `Read Daily Murli from Brahma Kumaris World Spiritual University. Today's spiritual message for ${date} in ${language.toUpperCase()}.`;
}

/**
 * Extract keywords from HTML content
 */
export function extractKeywords(html: string, language: string): string[] {
  if (!html) return [];

  const keywords: string[] = [];

  // Try to extract from meta keywords
  const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
  if (metaKeywordsMatch && metaKeywordsMatch[1]) {
    const metaKeywords = metaKeywordsMatch[1]
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    keywords.push(...metaKeywords);
  }

  // Add language-specific keywords
  const langKeywords: Record<string, string[]> = {
    hi: ['ब्रह्माकुमारी', 'दैनिक मुरली', 'मधुबन मुरली'],
    gu: ['બ્રહ્માકુમારી', 'દૈનિક મુરલી', 'મધુબન મુરલી'],
    en: ['Brahma Kumaris', 'Daily Murli', 'Spiritual Reading'],
    ne: ['ब्रह्माकुमारी', 'दैनिक मुरली'],
    kn: ['ಬ್ರಹ್ಮಕುಮಾರಿ', 'ದೈನಂದಿನ ಮುರ್ಲಿ'],
    ta: ['பிரம்ம குமாரி', 'தினசரி முர்லி'],
    te: ['బ్రహ్మ కుమారి', 'దైనందిన ముర్లి'],
    ml: ['ബ്രഹ്മകുമാരി', 'ദൈനംദിന മുര്ലി'],
    bn: ['ব্রহ্মাকুমারী', 'দৈনিক মুরলি'],
    or: ['ବ୍ରହ୍ମକୁମାରୀ', 'ଦୈନିକ ମୁରଲି'],
  };

  const languageKeywords = langKeywords[language] || [];
  keywords.push(...languageKeywords);

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Extract all metadata from HTML content
 */
export interface ExtractedMetadata {
  title: string | null;
  description: string | null;
  keywords: string[];
}

export function extractMetadata(html: string, language: string, date: string): ExtractedMetadata {
  const title = extractTitle(html);
  const description = extractDescription(html) || generateMetaDescription(html, date, language);
  const keywords = extractKeywords(html, language);

  return {
    title,
    description,
    keywords,
  };
}
