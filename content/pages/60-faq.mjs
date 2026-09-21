export default {
  slug: 'faq',
  order: 60,
  navLabel: 'Glutt FAQ',
  crumb: 'FAQ',
  cardText: 'Pricing, devices, Polly, Meta glasses, imports, privacy: every common question, answered.',
  title: 'Glutt FAQ: Pricing, Polly the AI Chef, Meta Glasses and More',
  ogTitle: 'Glutt FAQ',
  description:
    'Answers about Glutt: Recipes & AI Chef: pricing, supported iPhones, Polly the AI chef, Meta glasses and AirPods, recipe imports, privacy and support.',
  eyebrow: 'Help',
  h1: 'Glutt, <em>frequently asked.</em>',
  lede: 'Everything people ask us about Glutt, the iPhone cooking app with a live AI chef. If your question is not here, email hi@cielpm.ai.',
  published: '2026-09-20',
  updated: '2026-09-20',
  author: 'org',
  schemaType: 'WebPage',
  includeApp: true,
  mentionsApp: true,
  faqSchema: true,
  hideCta: false,
  answer:
    '<strong>Glutt: Recipes &amp; AI Chef</strong> is an iPhone cooking app by CielPM, Inc. It saves recipes from TikTok, Instagram, YouTube and any website, knows what is in your kitchen, and lets you cook hands-free with Polly, a live voice AI chef. It is free to download, with a free trial of Glutt Premium, and runs on iPhone with iOS 17.2 or later.',
  body: `
            <p>
              Jump to: <a href="#about-glutt">About Glutt</a> · <a href="#polly">Polly, the AI chef</a> ·
              <a href="#glasses">Meta glasses and headphones</a> · <a href="#recipes">Recipes and kitchen</a> ·
              <a href="#account">Account, privacy and support</a>
            </p>
          `,
  faq: [
    // About Glutt
    {
      q: 'What is Glutt?',
      a: '<p id="about-glutt">Glutt (full name <strong>Glutt: Recipes &amp; AI Chef</strong>) is an iPhone cooking app. Save any recipe, cook it hands-free with a live AI chef, and use what is already in your fridge. It is made by CielPM, Inc. and launched on the App Store on July 15, 2026.</p>',
    },
    {
      q: 'How much does Glutt cost?',
      a: 'Glutt is free to download. Full use needs a Glutt Premium subscription, monthly or yearly, and you can start with a free trial. Prices are set in the App Store and can vary by country, so the App Store listing always shows the current price for you. You can cancel any time in your Apple Account settings.',
    },
    {
      q: 'Which devices does Glutt run on?',
      a: 'iPhone with iOS 17.2 or later. Glutt is not available for iPad, Android or the web.',
    },
    {
      q: 'What languages does Glutt support?',
      a: 'English.',
    },
    // Polly
    {
      q: 'Who is Polly?',
      a: '<p id="polly">Polly is Glutt\'s live voice AI chef. While you cook, you talk to her out loud: she walks you through every step, answers questions such as substitutions or whether something is done, runs your timers, and can look at the pan through your iPhone camera. <a href="/ai-chef">More about Polly.</a></p>',
    },
    {
      q: 'How do I start talking to Polly?',
      a: 'Open a recipe, start cooking with Polly, then say "Chef" (or "Hey Chef") followed by your question. You can also tap to talk.',
    },
    {
      q: 'Can Polly see my food?',
      a: 'Yes, through your iPhone camera, when you turn it on. The camera is off by default.',
    },
    {
      q: 'Does Polly need an internet connection?',
      a: 'Yes. Polly\'s voice runs live over the internet, so you need Wi-Fi or mobile data while cooking with her.',
    },
    // Glasses
    {
      q: 'Does Glutt work with Meta glasses?',
      a: '<p id="glasses">Yes, for audio. When Ray-Ban Meta or Oakley Meta glasses are connected to your iPhone, Glutt automatically uses their microphones and open-ear speakers for Polly, so you can talk to her with your phone on the counter. Seeing through the glasses\' camera is not available yet, because Meta\'s toolkit for third-party apps is still in developer preview. <a href="/guides/cooking-with-meta-glasses">Read the Meta glasses guide.</a></p>',
    },
    {
      q: 'Does Glutt work with AirPods?',
      a: 'Yes. Polly works with AirPods and other Bluetooth headsets. If both AirPods and Meta glasses are connected, Glutt prefers the glasses.',
    },
    {
      q: 'Is Glutt affiliated with Meta?',
      a: 'No. Glutt is an independent app by CielPM, Inc. and is not affiliated with or endorsed by Meta Platforms, Ray-Ban, Oakley or EssilorLuxottica.',
    },
    // Recipes and kitchen
    {
      q: 'Where can I import recipes from?',
      a: '<p id="recipes">TikTok, Instagram, YouTube, Reddit, any recipe website, and screenshots. Share the post or page to Glutt from the iPhone share sheet. If a video only says the method out loud, Glutt listens and writes it down. <a href="/guides/save-recipes-from-tiktok-instagram">How to import recipes.</a></p>',
    },
    {
      q: 'Does Glutt know what ingredients I have?',
      a: 'Yes. Tell Glutt what is in your fridge and pantry by voice, camera or typing, and tick off the equipment you own. Recipes then show what you are missing before you start, offer substitutes, and send the rest to your grocery list.',
    },
    {
      q: 'Does Glutt track calories and protein?',
      a: 'Every recipe shows calories and protein per serving, scaled to the number of servings you cook. There is no food diary or daily goal to keep up with.',
    },
    {
      q: 'What are Skills and Cook Ranks?',
      a: 'Skills is a map of 75 cooking techniques across 9 regions. You practice a technique, photograph your work, and the AI chef scores it against what the check asks for. Verified checks build a Cook Rating and move you through nine Cook Ranks, from Prep Cook to Head Chef.',
    },
    {
      q: 'Where do Glutt\'s recipes come from?',
      a: 'Your own imports and recipes you add, plus a Discover feed of dishes and cooking videos that learns your taste as you save and skip.',
    },
    // Account
    {
      q: 'Do I need an account?',
      a: '<p id="account">You can look around before creating an account. An account keeps your recipes and kitchen with you.</p>',
    },
    {
      q: 'How do I delete my account?',
      a: 'Follow the steps on the <a href="/delete-account">Delete Account</a> page, or email hi@cielpm.ai from the address linked to your account with the subject "Delete my account."',
    },
    {
      q: 'How does Glutt handle my data?',
      a: 'See the <a href="/privacy">Privacy Policy</a> for exactly what is collected and why. The camera is off unless you turn it on.',
    },
    {
      q: 'How do I contact Glutt support?',
      a: 'Email hi@cielpm.ai. We aim to reply within 2 business days. <a href="/support">Support page.</a>',
    },
  ],
  related: ['ai-chef', 'guides/cooking-with-meta-glasses', 'about'],
};
