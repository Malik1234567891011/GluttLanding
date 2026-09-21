/* ---------------------------------------------------------------------------
   site.mjs — the facts every generated page shares, and the schema.org nodes
   built from them. One place, so the site, the structured data and llms.txt
   can never describe Glutt differently.

   Facts are taken from the App Store listing (v1.2.3, 2026-09-07) and the app
   itself. Prices are deliberately not stated here: they have changed several
   times, and the App Store is the only place they are guaranteed current.
--------------------------------------------------------------------------- */

export const SITE = {
  origin: 'https://glutt.org',
  name: 'Glutt',
  appName: 'Glutt: Recipes & AI Chef',
  company: 'CielPM, Inc.',
  founder: 'Malik Shourbaji',
  email: 'hi@cielpm.ai',
  appStoreUrl: 'https://apps.apple.com/app/id6780553556',
  appStoreCanonical: 'https://apps.apple.com/us/app/glutt-recipes-ai-chef/id6780553556',
  developerUrl: 'https://apps.apple.com/us/developer/cielpm-inc/id6780553558',
  released: '2026-07-15',
  ogImage: '/assets/brand/og-glutt.jpg',
  ogImageAlt: 'Hot honey chicken rice bowl with avocado and corn, one of the recipes in Glutt.',
  oneLiner: 'Save any recipe, cook it hands-free with a live AI chef, and use what is already in your kitchen.',
  definition:
    'Glutt is an iPhone cooking app with Polly, a live voice AI chef that talks you through any recipe hands-free, answers questions out loud, runs your timers and can look at your pan through the camera. It saves recipes from TikTok, Instagram, YouTube and any website, and works with Ray-Ban Meta glasses for audio.',
};

export const ORG_ID = SITE.origin + '/#organization';
export const WEBSITE_ID = SITE.origin + '/#website';
export const APP_ID = SITE.origin + '/#app';
export const FOUNDER_ID = SITE.origin + '/about#founder';

SITE.founderNode = {
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: SITE.founder,
  jobTitle: 'Founder',
  worksFor: { '@id': ORG_ID },
  url: SITE.origin + '/about',
  sameAs: ['https://malikmakes.com'],
};

export function orgNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.company,
    url: SITE.origin + '/',
    logo: {
      '@type': 'ImageObject',
      url: SITE.origin + '/assets/brand/glutt-app-icon-512.png',
      width: 512,
      height: 512,
    },
    email: SITE.email,
    founder: { '@id': FOUNDER_ID },
    description: SITE.definition,
    sameAs: [SITE.appStoreCanonical, SITE.developerUrl],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE.email,
      url: SITE.origin + '/support',
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    alternateName: ['Glutt: Recipes & AI Chef', 'glutt.org'],
    url: SITE.origin + '/',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function appNode() {
  return {
    '@type': 'MobileApplication',
    '@id': APP_ID,
    name: SITE.appName,
    alternateName: 'Glutt',
    description: SITE.definition,
    url: SITE.origin + '/',
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'Food & Drink',
    operatingSystem: 'iOS 17.2 or later',
    availableOnDevice: 'iPhone',
    installUrl: SITE.appStoreCanonical,
    downloadUrl: SITE.appStoreCanonical,
    sameAs: [SITE.appStoreCanonical],
    datePublished: SITE.released,
    softwareVersion: '1.2.3',
    inLanguage: 'en',
    contentRating: '4+',
    image: SITE.origin + '/assets/brand/glutt-app-icon-512.png',
    screenshot: [
      SITE.origin + '/assets/screens/today-900.webp',
      SITE.origin + '/assets/app/voice-cookmode-900.webp',
      SITE.origin + '/assets/screens/recipes-900.webp',
      SITE.origin + '/assets/app/grocery-list-900.webp',
    ],
    featureList: [
      'Polly, a live voice AI chef: say "Chef" and ask questions out loud while you cook',
      'Hands-free step-by-step cook mode with automatic timers',
      'Polly can look at your pan through the iPhone camera',
      'Works with Ray-Ban Meta and Oakley Meta glasses microphones and speakers over Bluetooth',
      'Save recipes from TikTok, Instagram, YouTube, Reddit, websites and screenshots',
      'Pantry, fridge and equipment tracking with missing-ingredient checks and substitutes',
      'Automatic grocery lists',
      'Calories and protein per serving, scaled to the servings you cook',
      'Skills: 75 cooking techniques with photo-checked practice and Cook Ranks',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'free',
      description: 'Free to download. Glutt Premium subscription required for full use, with a free trial.',
      url: SITE.appStoreCanonical,
    },
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
  };
}
