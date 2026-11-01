import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  getCanonicalUrl,
  generateKeywords,
  formatDateForSEO,
  getLanguageName,
  generateHreflangUrls,
  generateDefaultDescription,
} from '../utils/seoUtils';
import { site } from '../content/site';
import { pageMetadata } from '../content/seo';

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
}) {
  const home = pageMetadata();
  const langName = getLanguageName(language);
  const formattedDate = formatDateForSEO(date);
  const canonicalUrl = getCanonicalUrl(date, language);
  const hreflangUrls = generateHreflangUrls(date);
  const keywords = generateKeywords(language, date);

  const pageTitle = title
    ? `${title} | Brahma Kumaris Daily Murli`
    : `Daily Murli - ${formattedDate} - ${langName} | Brahma Kumaris`;

  const pageDescription =
    description ||
    generateDefaultDescription(date, language) ||
    site.description;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={site.brand} />
      <meta name="creator" content={site.brand} />
      <meta name="publisher" content={site.brand} />
      <meta name="application-name" content={site.brand} />
      <meta name="language" content={language} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" type="text/plain" href={`${site.url}/llms.txt`} title="LLM facts" />
      <link rel="alternate" type="text/plain" href={`${site.url}/llms-full.txt`} title="LLM full brief" />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={home.openGraph.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={site.brand} />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : language === 'gu' ? 'gu_IN' : site.locale} />
      <meta property="article:published_time" content={new Date(date).toISOString()} />
      <meta property="article:author" content="Brahma Kumaris World Spiritual University" />
      <meta property="article:section" content="Spiritual Reading" />
      <meta property="article:tag" content={keywords.join(', ')} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={home.twitter.image} />

      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <html lang={language} />

      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
    </Helmet>
  );
}
