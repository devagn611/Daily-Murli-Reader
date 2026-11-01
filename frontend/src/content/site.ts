/**
 * Single source of public SEO/GEO copy.
 * Client-facing language only. No stack, prices, email, or unofficial BK claims.
 */

export const SITE_URL = 'https://murli.devagn.com';

export const site = {
  legalName: 'Daily Murli Reader',
  brand: 'Daily Murli Reader',
  shortName: 'Daily Murli',
  url: SITE_URL,
  language: 'en-IN',
  locale: 'en_IN',
  region: 'IN',
  placename: 'India',
  classification: 'Spiritual reading',
  homeTitle: 'Daily Murli Reader | Brahma Kumaris Daily Murli',
  description:
    'Daily Murli Reader helps Brahma Kumaris students read the daily Murli from anywhere. Available in Hindi, Gujarati, English, and seven more languages.',
  punchline: 'Read Daily Murli from anywhere',
  keywords: [
    'Daily Murli',
    'Daily Murli Reader',
    'Brahma Kumaris',
    'Madhuban Murli',
    'BK Murli',
    'Brahma Kumaris Daily Reading',
    'spiritual reading',
    'दैनिक मुरली',
  ],
  features: [
    'Read the daily Murli by date',
    'Choose among 10 Murli languages',
    'Listen to audio when it is available for the selected date and language',
    'Print the Murli',
    'Increase, decrease, or reset font size',
    'Switch between light and dark mode',
  ],
  audiences: ['Brahma Kumaris students'],
  murliLanguages: [
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
  ],
  github: 'https://github.com/devagn611/Daily-Murli-Reader',
  contentSource: 'https://madhubanmurli.org',
  contentSourceName: 'madhubanmurli.org',
  logoPath: '/brahmakumaris_logo.png',
  ogImagePath: '/opengraph-image.png',
  themeColor: '#000000',
  backgroundColor: '#f9fafb',
  pages: [
    {
      path: '/',
      name: 'Home',
      purpose: 'Read the daily Murli by date and language',
    },
  ],
  faq: [
    {
      question: 'What is Daily Murli Reader?',
      answer:
        'Daily Murli Reader is a web app that helps Brahma Kumaris students read the daily Murli from anywhere.',
    },
    {
      question: 'Who is Daily Murli Reader for?',
      answer:
        'It is for Brahma Kumaris students who want to read the daily Murli on the web.',
    },
    {
      question: 'Which languages can I read?',
      answer:
        'You can read Murli in Hindi, Gujarati, English, Nepali, Kannada, Tamil, Telugu, Malayalam, Bengali, and Oriya.',
    },
    {
      question: 'Can I listen to the Murli?',
      answer:
        'Yes. Daily Murli Reader includes an audio player when audio is available for the selected date and language.',
    },
    {
      question: 'Can I print the Murli?',
      answer:
        'Yes. Use the Print button to print the Murli for the selected date and language.',
    },
    {
      question: 'Can I change font size or theme?',
      answer:
        'Yes. You can increase, decrease, or reset font size, and switch between light mode and dark mode.',
    },
    {
      question: 'Where does the Murli text come from?',
      answer:
        'Murli text and audio come from madhubanmurli.org, the Madhuban Murli source used by Brahma Kumaris students.',
    },
    {
      question: 'Is this the official Brahma Kumaris website?',
      answer:
        'No. Daily Murli Reader is a student-made reader. It is not the official Brahma Kumaris website.',
    },
  ],
} as const;

export type SiteFaq = (typeof site.faq)[number];
