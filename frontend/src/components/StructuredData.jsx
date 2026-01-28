import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  formatDateForSEO,
  getLanguageName,
  getCanonicalUrl,
  getBaseUrl,
} from '../utils/seoUtils';

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
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl(date, language);
  const formattedDate = formatDateForSEO(date);
  const langName = getLanguageName(language);

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Brahma Kumaris World Spiritual University',
    alternateName: 'BK',
    url: 'https://www.brahmakumaris.org',
    logo: `${baseUrl}/brahmakumaris_logo.png`,
    sameAs: [
      'https://www.facebook.com/brahmakumaris',
      'https://www.twitter.com/BrahmaKumaris',
      'https://www.instagram.com/brahmakumaris',
      'https://www.youtube.com/user/brahmakumaris',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Spiritual Guidance',
      availableLanguage: ['Hindi', 'Gujarati', 'English', 'Nepali', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Bengali', 'Oriya'],
    },
  };

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title || `Daily Murli - ${formattedDate} - ${langName}`,
    description: description || `Read Daily Murli from Brahma Kumaris World Spiritual University in ${langName}. Today's spiritual message for ${formattedDate}.`,
    image: `${baseUrl}/brahmakumaris_logo.png`,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Brahma Kumaris World Spiritual University',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brahma Kumaris World Spiritual University',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/brahmakumaris_logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleBody: content ? content.replace(/<[^>]+>/g, '').substring(0, 500) : description,
    inLanguage: language,
    keywords: `Brahma Kumaris, Daily Murli, Madhuban Murli, ${langName}, Spiritual Reading`,
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Daily Murli',
        item: `${baseUrl}/?date=${date}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: formattedDate,
        item: `${baseUrl}/?date=${date}&lang=${language}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: langName,
        item: canonicalUrl,
      },
    ],
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Daily Murli Reader',
    url: baseUrl,
    description: 'Read Daily Murli from Brahma Kumaris World Spiritual University. Available in multiple languages.',
    publisher: {
      '@type': 'Organization',
      name: 'Brahma Kumaris World Spiritual University',
    },
    inLanguage: ['hi', 'gu', 'en', 'ne', 'kn', 'ta', 'te', 'ml', 'bn', 'or'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?date={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}
