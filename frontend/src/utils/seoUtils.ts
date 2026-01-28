/**
 * SEO utility functions for generating URLs, keywords, and language mappings
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

/**
 * Get the base URL for the site (used for canonical URLs and Open Graph)
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for SSR or when window is not available
  return 'https://murli.devagn.com'; // Update with your actual domain
}

/**
 * Generate canonical URL for a specific date and language
 */
export function getCanonicalUrl(date: string, language: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/?date=${date}&lang=${language}`;
}

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang?.name || code.toUpperCase();
}

/**
 * Get native language name from code
 */
export function getLanguageNativeName(code: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang?.nativeName || code.toUpperCase();
}

/**
 * Format date for SEO (readable format)
 */
export function formatDateForSEO(date: string): string {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

/**
 * Generate keywords based on language and date
 */
export function generateKeywords(language: string, date: string): string[] {
  const baseKeywords = [
    'Brahma Kumaris',
    'Daily Murli',
    'Madhuban Murli',
    'Brahma Kumaris Daily Reading',
    'Spiritual Reading',
    'BK Murli',
    'Brahma Kumaris World Spiritual University',
  ];

  const langKeywords: Record<string, string[]> = {
    hi: ['ब्रह्माकुमारी', 'दैनिक मुरली', 'मधुबन मुरली', 'ब्रह्माकुमारी दैनिक मुरली'],
    gu: ['બ્રહ્માકુમારી', 'દૈનિક મુરલી', 'મધુબન મુરલી', 'બ્રહ્માકુમારી દૈનિક મુરલી'],
    en: ['Brahma Kumaris', 'Daily Murli', 'Spiritual Reading', 'BK Daily Reading'],
    ne: ['ब्रह्माकुमारी', 'दैनिक मुरली', 'आध्यात्मिक पाठ'],
    kn: ['ಬ್ರಹ್ಮಕುಮಾರಿ', 'ದೈನಂದಿನ ಮುರ್ಲಿ', 'ಆಧ್ಯಾತ್ಮಿಕ ಓದುವಿಕೆ'],
    ta: ['பிரம்ம குமாரி', 'தினசரி முர்லி', 'ஆன்மீக வாசிப்பு'],
    te: ['బ్రహ్మ కుమారి', 'దైనందిన ముర్లి', 'ఆధ్యాత్మిక పఠనం'],
    ml: ['ബ്രഹ്മകുമാരി', 'ദൈനംദിന മുര്ലി', 'ആധ്യാത്മിക വായന'],
    bn: ['ব্রহ্মাকুমারী', 'দৈনিক মুরলি', 'আধ্যাত্মিক পাঠ'],
    or: ['ବ୍ରହ୍ମକୁମାରୀ', 'ଦୈନିକ ମୁରଲି', 'ଆଧ୍ୟାତ୍ମିକ ପାଠ'],
  };

  const languageKeywords = langKeywords[language] || [];
  
  return [...baseKeywords, ...languageKeywords, `Daily Murli ${date}`, `Murli ${date}`];
}

/**
 * Generate hreflang URLs for all supported languages
 */
export function generateHreflangUrls(date: string): Array<{ lang: string; url: string }> {
  const baseUrl = getBaseUrl();
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
    url: `${baseUrl}/?date=${date}&lang=${lang.code}`,
  }));
}

/**
 * Generate default meta description
 */
export function generateDefaultDescription(date: string, language: string): string {
  const langName = getLanguageName(language);
  const formattedDate = formatDateForSEO(date);
  return `Read Daily Murli from Brahma Kumaris World Spiritual University in ${langName}. Today's spiritual message for ${formattedDate}. Available in multiple languages.`;
}
