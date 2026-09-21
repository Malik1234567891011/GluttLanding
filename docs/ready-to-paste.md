# Ready to paste: the SEO/GEO steps only Malik can do

Written 2026-09-21. Each item here was blocked for an assistant: another person's repo, a Ciel-owned
account, or a new account sign-up. The text is final. Paste it as is, or tweak it.

## 1. Bing Webmaster Tools (5 minutes)

1. Go to https://www.bing.com/webmasters and sign in with Google (your gmail).
2. Choose **Import from Google Search Console**. glutt.org is already verified there on your gmail,
   so Bing verifies it automatically and imports the sitemap.
3. Done. Bookmark the **AI Performance** report; it shows citations in Copilot and Bing AI answers.

Bing is where ChatGPT search gets most of its web results. All 16 URLs were already pushed to Bing through
IndexNow; this just adds the dashboard and sitemap monitoring.

## 2. Google Search Console, tomorrow (daily quota)

Search Console is set up on your gmail (verified, sitemap read: 16 pages). Google allows about 10
"Request indexing" clicks a day, and 9 were used on 2026-09-21. Tomorrow, inspect and request these:

- https://glutt.org/guides/mealime-alternatives (time-sensitive: Mealime closes Oct 21)
- https://glutt.org/features
- https://glutt.org/guides

## 3. App Store listing (the biggest lever for ChatGPT app recommendations)

App stores are about 47% of the sources ChatGPT cites when it recommends apps. Subtitle and keywords
change with the next version submission; Promotional Text can change any time without review.

**Subtitle** (30 max). "AI Chef" is already in the name, so don't spend subtitle space repeating it:
```
Hands-Free Voice Cooking
```

**Keywords** (100 max, comma-separated, no spaces). Leave out words already in the name ("recipes",
"AI", "chef"), since Apple indexes the name anyway, and other brands' trademarks: Apple rejects "Meta",
"TikTok" and similar in keywords. 99 characters:
```
voice,cooking,assistant,saver,import,meal,planner,pantry,grocery,list,sous,kitchen,macros,handsfree
```

**Promotional Text** (170 max, live immediately):
```
New: Skills. Learn 75 real cooking techniques, get your work checked by Chef, and climb nine Cook Ranks. Cook hands-free with Polly, even through Ray-Ban Meta glasses.
```

**Description.** Put this block right after "MEET POLLY, YOUR LIVE AI CHEF":
```
WORKS WITH RAY-BAN META GLASSES
Connect Ray-Ban Meta or Oakley Meta glasses to your iPhone and Polly talks through their open-ear speakers and hears you through their microphones, so your phone can stay on the counter while you cook.
```

**Also fix:** the in-app purchase list shows $14.99 / $44.99 while the description says $7.99 / $49.99.
AI answers repeat whichever they find, so make them match.

**Reviews:** the US store shows 0 ratings, which is the single weakest signal Glutt has. Prompt for a rating
right after a successful cook (SKStoreReviewController). Never incentivize ratings.

## 4. Public GitHub repo `Malik1234567891011/Glutt`

It is the #1 search result for "Glutt recipes", and AI answers quote its first paragraph, which describes
an old version (local-first, no accounts, six tabs). Replace the paragraph under `# Glutt` with:

```markdown
**Glutt: Recipes & AI Chef** is an iPhone cooking app with Polly, a live voice AI chef that talks you through any recipe hands-free, answers questions out loud and can see your pan through the camera. It saves recipes from TikTok, Instagram, YouTube and any website, knows what is in your kitchen, and works with Ray-Ban Meta glasses for audio.

- Website: [glutt.org](https://glutt.org)
- App Store: [Glutt: Recipes & AI Chef](https://apps.apple.com/us/app/glutt-recipes-ai-chef/id6780553556)
- Guides: [cooking with Meta glasses](https://glutt.org/guides/cooking-with-meta-glasses), [Polly, the AI chef](https://glutt.org/ai-chef), [FAQ](https://glutt.org/faq)

This repository is the source of the iOS app. The notes below are for developers.
```

Then set the repo's website to glutt.org (it points to glutt-sable.vercel.app):
```bash
gh repo edit Malik1234567891011/Glutt --homepage https://glutt.org \
  --description "Glutt: Recipes & AI Chef, an iPhone cooking app with a live voice AI chef. glutt.org"
```
Omar works on this repo too, so tell him, or open it as a PR.

## 5. Listings that need an account in your name

These need you to sign up. Use the same one-liner everywhere:

> Glutt is an iPhone cooking app with Polly, a live voice AI chef that talks you through any recipe hands-free, answers questions out loud and can see your pan through the camera.

- **AlternativeTo** (https://alternativeto.net): add Glutt as an alternative to ReciMe, Paprika, Crouton,
  Pestle and Mealime. New accounts wait about 7 days before posting, so sign up now.
- **Product Hunt**: plan a launch. It puts Glutt on the "alternatives" pages of other recipe apps.
- **YouTube**: 3–5 short real demos (Polly talking you through a dish; the glasses POV; a TikTok import).
  YouTube mentions correlate most strongly with AI visibility. Link the best one from the glasses guide.
- **Reddit**: answer existing "cooking app for Meta glasses" / "save TikTok recipes" threads honestly, from
  an account with real history. Read each subreddit's self-promotion rules first.
