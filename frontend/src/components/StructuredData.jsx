import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  formatDateForSEO,
  getLanguageName,
  getCanonicalUrl,
} from '../utils/seoUtils';
import { site } from '../content/site';
import {
  organizationGraph,
  websiteGraph,
  softwareApplicationGraph,
  faqPageGraph,
  jsonLdScript,
  absoluteUrl,
} from '../content/seo';

/**
 * StructuredData component for JSON-LD schema markup
 * @param {Object} props
 * @param {string} props.date - Date in YYYY-MM-DD format
 * @param {string} props.language - Language code (hi, gu, en, etc.)
 * @param {string} [props.title] - Optional custom title
 * @param {string} [props.description] - Optional custom description
 * @param {string} [props.content] - Optional content for schema
 */
export default function StructuredData({
  date,
  language,
  title,
  description,
  content,
}) {
  const canonicalUrl = getCanonicalUrl(date, language);
  const formattedDate = formatDateForSEO(date);
  const langName = getLanguageName(language);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title || `Daily Murli - ${formattedDate} - ${langName}`,
    description:
      description ||
      `Read Daily Murli from Brahma Kumaris World Spiritual University in ${langName}. Today's spiritual message for ${formattedDate}.`,
    image: absoluteUrl(site.ogImagePath),
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Brahma Kumaris World Spiritual University',
    },
    publisher: {
      '@id': `${site.url}/#organization`,
    },
    isBasedOn: site.contentSource,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleBody: content
      ? content.replace(/<[^>]+>/g, '').substring(0, 500)
      : description,
    inLanguage: language,
    keywords: `Brahma Kumaris, Daily Murli, Madhuban Murli, ${langName}, Spiritual Reading`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {jsonLdScript(organizationGraph())}
      </script>
      <script type="application/ld+json">
        {jsonLdScript(websiteGraph())}
      </script>
      <script type="application/ld+json">
        {jsonLdScript(softwareApplicationGraph())}
      </script>
      <script type="application/ld+json">
        {jsonLdScript(faqPageGraph())}
      </script>
      <script type="application/ld+json">
        {jsonLdScript(articleSchema)}
      </script>
    </Helmet>
  );
}
