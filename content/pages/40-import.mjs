export default {
  slug: 'guides/save-recipes-from-tiktok-instagram',
  order: 40,
  navLabel: 'Save recipes from TikTok, Instagram and YouTube',
  crumb: 'Save recipes from TikTok and Instagram',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Turn a cooking video or a screenshot into a clean recipe you will actually cook.',
  title: 'How to Save Recipes from TikTok, Instagram & YouTube (2026 Guide)',
  ogTitle: 'How to save recipes from TikTok, Instagram and YouTube, and actually cook them',
  description:
    'How to save recipes from TikTok, Instagram Reels, YouTube and websites, even videos where the recipe is only spoken, and turn them into dinner.',
  eyebrow: 'Guide · Recipe import',
  h1: 'Save recipes from TikTok, Instagram and YouTube, <em>and actually cook them.</em>',
  lede:
    'The average saved-recipe folder is a graveyard: reels you liked, screenshots you never opened, links that now lead nowhere. Here is how to get recipes out of social media and into a form you can cook from.',
  published: '2026-09-20',
  updated: '2026-09-20',
  image: '/assets/screens/recipes-900.webp',
  imageAlt: 'The Glutt recipes screen with saved meals, collections and a pantry match.',
  mentionsApp: true,
  answer:
    'The fastest way is to share the video straight to a recipe app. In <a href="/">Glutt</a>, tap Share on the TikTok, Instagram or YouTube video, choose Glutt, and it becomes a clean recipe with ingredients, steps and timings. If the method is only spoken in the video and never written down, Glutt listens to it and writes it out. Screenshots and recipe websites work the same way.',
  body: `
            <h2>Why "save" buttons don't work for recipes</h2>
            <p>
              TikTok's Favorites, Instagram's Saved and YouTube's Watch Later are built to bring you back to
              a video, not to help you cook it. When you are standing at the stove you want an ingredient list
              and numbered steps, not a 45-second clip to scrub through with wet hands. And a surprising number
              of cooking videos never write the recipe down at all: the quantities are said out loud once, over
              music.
            </p>

            <h2>How to save a recipe from TikTok</h2>
            <ol>
              <li>Open the video and tap <strong>Share</strong>.</li>
              <li>Choose <strong>Glutt</strong> from the share options. If you don't see it, tap <strong>More</strong> to open the iPhone share sheet, and add Glutt to your favorites there once.</li>
              <li>Glutt pulls out the ingredients, steps and timings. If the recipe is only spoken, it transcribes the audio.</li>
              <li>Check the result, fix anything the creator mumbled, and save.</li>
            </ol>

            <h2>How to save a recipe from Instagram Reels</h2>
            <ol>
              <li>Open the reel or post and tap the <strong>share</strong> (paper plane) icon.</li>
              <li>Choose <strong>Share to</strong> or <strong>More</strong> to reach the iPhone share sheet, then pick <strong>Glutt</strong>.</li>
              <li>Glutt reads the caption and the video, and builds the recipe.</li>
            </ol>
            <p>
              Alternatively, tap <strong>Copy link</strong> in Instagram and paste the link into Glutt's
              import screen.
            </p>

            <h2>YouTube, Reddit and recipe websites</h2>
            <p>
              The same share-sheet flow works from YouTube, Reddit and Safari. On a recipe website, Glutt skips
              the life story and the pop-ups and keeps the ingredients and the method.
            </p>

            <h2>Screenshots and photos</h2>
            <p>
              If the recipe is on a screenshot, a photo of a cookbook page or a card from a family member, add
              the image to Glutt and it reads the text into a recipe.
            </p>

            <div class="shot">
              <figure>
                <img src="/assets/screens/recipes-560.webp" width="560" height="1217" loading="lazy" decoding="async"
                  alt="Glutt recipes screen with organized meals, collections and a pantry match on each card." />
                <figcaption>Saved recipes, with a pantry match on every card.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/grocery-list-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="A Glutt grocery list generated from saved recipes." />
                <figcaption>Missing ingredients go straight to the grocery list.</figcaption>
              </figure>
            </div>

            <h2>From saved to cooked</h2>
            <p>Saving is the easy part. What gets the recipe made:</p>
            <ul>
              <li><strong>A pantry check.</strong> Glutt knows what is in your fridge and pantry, tells you what the recipe is missing before you start, and suggests substitutes.</li>
              <li><strong>A grocery list that builds itself</strong> from what is actually missing.</li>
              <li><strong>Hands-free cooking.</strong> Cook the saved recipe with <a href="/ai-chef">Polly, Glutt's AI chef</a>, who reads each step aloud and answers questions.</li>
              <li><strong>Calories and protein per serving,</strong> scaled to the servings you actually make.</li>
            </ul>

            <h2>Other apps that save recipes from social media</h2>
            <p>
              Glutt is not the only option, and it is fair to say so. ReciMe and Flavorish are popular
              organizers built around social imports. Paprika is a long-standing, buy-once recipe manager
              for websites. Pestle imports from Instagram and TikTok and adds voice commands. Our
              <a href="/best-ai-cooking-apps">comparison of AI cooking apps</a> covers how they differ.
              Glutt's difference is what happens after the import: a pantry that knows what you have, and a
              live AI chef to cook it with.
            </p>
          `,
  faq: [
    {
      q: 'What app can save recipes from TikTok videos?',
      a: 'Several can, including Glutt, ReciMe, Flavorish and Pestle. In Glutt you share the TikTok to the app and it builds the recipe, and if the method is only spoken in the video, Glutt listens and writes it down.',
    },
    {
      q: 'Can an app get a recipe from a video with no written recipe?',
      a: 'Yes. Glutt transcribes the spoken method from the video and turns it into ingredients and steps. Check the quantities afterwards, because creators sometimes round or skip them.',
    },
    {
      q: 'Can I save recipes from Instagram without the link breaking later?',
      a: 'Yes. Once a recipe is imported into Glutt, the ingredients and steps live in the app, so the recipe stays usable even if the original post is deleted or made private.',
    },
    {
      q: 'Does Glutt work with Pinterest?',
      a: 'If a pin links to a recipe website, open the website and share that page to Glutt. Glutt imports from any recipe site.',
    },
    {
      q: 'Is Glutt available on Android?',
      a: 'Not currently. Glutt is an iPhone app for iOS 17.2 or later.',
    },
  ],
  faqSchema: true,
  related: ['ai-chef', 'guides/hands-free-cooking', 'faq'],
};
