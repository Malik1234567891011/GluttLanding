const HUB = [
  'guides/cooking-with-meta-glasses',
  'ai-chef',
  'guides/hands-free-cooking',
  'guides/cook-with-what-you-have',
  'guides/save-recipes-from-tiktok-instagram',
  'guides/mealime-alternatives',
  'best-ai-cooking-apps',
  'faq',
];

export default {
  slug: 'guides',
  order: 5,
  navLabel: 'Guides',
  crumb: 'Guides',
  cardText: 'Every Glutt guide in one place.',
  title: 'Cooking Guides: AI Chefs, Meta Glasses & Hands-Free Cooking | Glutt',
  ogTitle: 'Glutt guides',
  description:
    'Practical guides from Glutt: cooking with Meta glasses, hands-free and voice cooking, saving recipes from TikTok and Instagram, and an honest comparison of AI cooking apps.',
  eyebrow: 'Guides',
  h1: 'Cook smarter, <em>hands-free.</em>',
  lede:
    'Practical guides to cooking with AI: what voice chefs and smart glasses can actually do in a real kitchen, how to rescue recipes from social media, and which apps are worth your time.',
  published: '2026-09-20',
  updated: '2026-09-20',
  author: 'org',
  schemaType: 'CollectionPage',
  hideByline: true,
  ogType: 'website',
  body: (all) => {
    const pages = HUB.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean);
    return `<div class="cards">
              ${pages
                .map(
                  (p) => `<a href="${p.path}">
                <h2>${p.navLabel}</h2>
                <p>${p.cardText}</p>
              </a>`
                )
                .join('\n              ')}
            </div>`;
  },
  hasPart: HUB.map((slug) => ({ '@id': `https://glutt.org/${slug}#main` })),
  related: [],
};
