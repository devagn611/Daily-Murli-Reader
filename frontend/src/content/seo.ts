import { site, SITE_URL } from './site';

export function absoluteUrl(path: string = '/'): string {
  if (!path || path === '/') {
    return `${SITE_URL}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
export const appId = `${SITE_URL}/#app`;
export const faqId = `${SITE_URL}/#faq`;

export function pageMetadata() {
  const canonical = absoluteUrl('/');
  const image = absoluteUrl(site.ogImagePath);
  const hreflang = [
    { lang: site.language, url: canonical },
    ...site.murliLanguages.map((lang) => ({
      lang: lang.code,
      url: `${SITE_URL}/?lang=${lang.code}`,
    })),
    { lang: 'x-default', url: canonical },
  ];

  return {
    title: site.homeTitle,
    description: site.description,
    canonical,
    keywords: site.keywords,
    hreflang,
    openGraph: {
      type: 'website' as const,
      locale: site.locale,
      siteName: site.brand,
      title: site.homeTitle,
      description: site.description,
      url: canonical,
      image,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: site.homeTitle,
      description: site.description,
      url: canonical,
      image,
    },
  };
}

export function organizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: site.brand,
    legalName: site.legalName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.logoPath),
    },
    image: absoluteUrl(site.ogImagePath),
    description: site.description,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    availableLanguage: site.murliLanguages.map((lang) => lang.name),
    knowsAbout: [
      'Daily Murli',
      'Brahma Kumaris',
      'Madhuban Murli',
      'BK Murli',
      'spiritual reading',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: site.github,
    },
    brand: {
      '@type': 'Brand',
      name: site.shortName,
    },
    sameAs: [site.github],
  };
}

export function websiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: absoluteUrl('/'),
    name: site.brand,
    description: site.description,
    inLanguage: site.language,
    publisher: {
      '@id': organizationId,
    },
  };
}

export function softwareApplicationGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': appId,
    name: site.brand,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: absoluteUrl('/'),
    description: site.description,
    featureList: [...site.features],
    inLanguage: site.murliLanguages.map((lang) => lang.code),
    countriesSupported: site.region,
    publisher: {
      '@id': organizationId,
    },
  };
}

export function faqPageGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': faqId,
    mainEntity: site.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}
