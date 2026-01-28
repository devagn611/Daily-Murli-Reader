import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  getCanonicalUrl,
  generateKeywords,
  formatDateForSEO,
  getLanguageName,
  generateHreflangUrls,
  generateDefaultDescription,
  getBaseUrl,
} from '../utils/seoUtils';

/**
 * SEOHead component for dynamic meta tags
 * @param {Object} props
 * @param {string} props.date - Date in YYYY-MM-DD format
 * @param {string} props.language - Language code (hi, gu, en, etc.)
 * @param {string} [props.title] - Optional custom title
 * @param {string} [props.description] - Optional custom description
 * @param {string} [props.content] - Optional content for meta tags
 */
export default function SEOHead({
  date,
  language,
  title,
  description,
  content,
}) {
  const langName = getLanguageName(language);
  const formattedDate = formatDateForSEO(date);
  const canonicalUrl = getCanonicalUrl(date, language);
  const hreflangUrls = generateHreflangUrls(date);
  const keywords = generateKeywords(language, date);
  const baseUrl = getBaseUrl();

  // Generate title
  const pageTitle = title
    ? `${title} | Brahma Kumaris Daily Murli`
    : `Daily Murli - ${formattedDate} - ${langName} | Brahma Kumaris`;

  // Generate description
  const pageDescription =
    description ||
    generateDefaultDescription(date, language) ||
    `Read Daily Murli from Brahma Kumaris World Spiritual University in ${langName}. Today's spiritual message for ${formattedDate}.`;

  // Generate image URL (using logo as default)
  const imageUrl = `${baseUrl}/brahmakumaris_logo.png`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Brahma Kumaris World Spiritual University" />
      <meta name="language" content={language} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Daily Murli Reader" />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : language === 'gu' ? 'gu_IN' : 'en_US'} />
      <meta property="article:published_time" content={new Date(date).toISOString()} />
      <meta property="article:author" content="Brahma Kumaris World Spiritual University" />
      <meta property="article:section" content="Spiritual Reading" />
      <meta property="article:tag" content={keywords.join(', ')} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@BrahmaKumaris" />

      {/* Hreflang Tags for Multi-Language SEO */}
      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* HTML Lang Attribute */}
      <html lang={language} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
    </Helmet>
  );
}
