export default {
  slug: 'guides/save-recipes-from-instagram',
  order: 43,
  navLabel: 'Save recipes from Instagram',
  crumb: 'Save recipes from Instagram',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Get a recipe out of an Instagram post or Reel and into a list you can cook from.',
  title: 'How to Save Recipes From Instagram (Posts & Reels, 2026)',
  ogTitle: 'How to save recipes from Instagram, and actually cook them',
  description:
    'How to save a recipe from an Instagram post or Reel: why Saved is not enough, how to import the caption into a recipe app, and what to do when it is only spoken.',
  eyebrow: 'Guide · Recipe import',
  h1: 'Save recipes from Instagram, <em>not just the post.</em>',
  lede:
    'Instagram is where a lot of good recipes live, and where most of them get lost: a bookmark in a Saved folder you never open again. Here is how to get the recipe itself out, and what to do when the creator never wrote it down.',
  published: '2026-11-17',
  updated: '2026-11-17',
  image: '/assets/screens/recipes-900.webp',
  imageAlt: 'The Glutt recipes screen with saved meals, collections and a pantry match.',
  mentionsApp: true,
  answer:
    'Tapping the bookmark only saves the <strong>post</strong> inside Instagram. To save the <strong>recipe</strong>, share the post or Reel to a recipe app that reads the caption, where most food creators put the full ingredient list. In <a href="/">Glutt</a>, tap the share icon, choose Glutt (or copy the link and paste it into Glutt), and the caption becomes a recipe with ingredients and steps, with the photo kept. It works on public posts. If the recipe is only spoken in a Reel, screenshot the on-screen amounts, or look for the creator\'s TikTok, YouTube or website version, which apps can read in full.',
  body: `
            <h2>Why Instagram's Saved folder is not a recipe box</h2>
            <p>
              The bookmark icon puts a post into Saved, and you can sort Saved into collections such as
              "Dinners." That is fine for finding the post again. It is not fine for cooking: there is no
              ingredient list to shop from, no way to scale servings, you scroll a caption with wet hands, and
              the recipe disappears if the creator deletes the post or makes the account private.
            </p>

            <h2>Where the recipe is in an Instagram post</h2>
            <div class="table">
              <table>
                <thead><tr><th scope="col">Where it is</th><th scope="col">How to tell</th><th scope="col">Best way to save it</th></tr></thead>
                <tbody>
                  <tr><th scope="row">In the caption</th><td>Tap "more" under the post: a list with amounts</td><td>Share it to a recipe app; this is the easy case</td></tr>
                  <tr><th scope="row">On the creator's website</th><td>"Recipe on my blog" or "link in bio"</td><td>Open the site and save that page instead; websites import cleanly</td></tr>
                  <tr><th scope="row">On the slides or on screen</th><td>Amounts written on carousel images or flashed in the Reel</td><td>Screenshot those frames and import the screenshots</td></tr>
                  <tr><th scope="row">Spoken only</th><td>Nothing written anywhere</td><td>Find the same recipe on the creator's TikTok or YouTube, or write it down while you watch</td></tr>
                </tbody>
              </table>
            </div>

            <h2>How to save an Instagram recipe to Glutt</h2>
            <ol>
              <li>Open the post or Reel and tap the <strong>share</strong> (paper plane) icon.</li>
              <li>Tap <strong>Share to</strong> or <strong>More</strong> to reach the iPhone share sheet, then pick <strong>Glutt</strong>. Or tap <strong>Copy link</strong> and paste it into Glutt's import screen.</li>
              <li>Glutt reads the full caption and turns it into ingredients and steps, and keeps the post's photo.</li>
              <li>Check the result. If Glutt says the caption did not include the full recipe, the amounts are somewhere else: see the table above.</li>
            </ol>
            <p>
              This works for public posts and Reels. Instagram does not let apps read posts from private
              accounts, so for those, screenshot the caption and import the screenshot instead.
            </p>

            <h2>When the recipe is only spoken in a Reel</h2>
            <p>
              Plenty of Reels never write the recipe down. Glutt reads Instagram captions but does not listen
              to Instagram audio, so for a spoken-only Reel, it is worth a minute's detective work. Most food
              creators post the same video on TikTok or YouTube, and Glutt <em>does</em> transcribe the spoken
              method from those: see <a href="/guides/save-recipes-from-tiktok-instagram">saving from TikTok</a>
              and <a href="/guides/save-recipes-from-youtube">saving from YouTube</a>. Failing that, pause on the
              frames that show amounts and screenshot them.
            </p>

            <h2>After it is saved</h2>
            <ul>
              <li><strong>See what you are missing.</strong> Glutt checks the ingredients against your pantry, and only the gaps go on the grocery list.</li>
              <li><strong>Cook it hands-free.</strong> <a href="/ai-chef">Polly, Glutt's AI chef</a>, reads each step aloud, keeps your place and answers questions while you cook.</li>
              <li><strong>Keep it if the post goes.</strong> The ingredients and steps live in the app, not on Instagram.</li>
            </ul>

            <div class="shot">
              <figure>
                <img src="/assets/screens/recipes-560.webp" width="560" height="1217" loading="lazy" decoding="async"
                  alt="Glutt recipes screen with organized meals, collections and a pantry match on each card." />
                <figcaption>Imported recipes sit alongside everything else you have saved.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/grocery-list-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="A Glutt grocery list generated from saved recipes." />
                <figcaption>Only the missing ingredients go on the list.</figcaption>
              </figure>
            </div>

            <h2>Other apps that import from Instagram</h2>
            <p>
              ReciMe, Flavorish and Pestle also import Instagram posts, and ReciMe and Flavorish are on Android,
              which Glutt is not. Our <a href="/best-ai-cooking-apps">comparison of AI cooking apps</a> covers
              how they differ.
            </p>
          `,
  faq: [
    {
      q: 'How do I save a recipe from Instagram?',
      a: 'Share the post or Reel to a recipe app that reads the caption, such as Glutt, ReciMe or Flavorish. The app turns the caption into an ingredient list and steps. Bookmarking the post only saves it inside Instagram.',
    },
    {
      q: 'How do I save an Instagram Reel recipe if the recipe is not in the caption?',
      a: 'Check the creator\'s website ("link in bio") and their TikTok or YouTube, where the same video often has the recipe written out or can be transcribed. Otherwise, screenshot the frames that show the amounts and import the screenshots.',
    },
    {
      q: 'Can I import recipes from private Instagram accounts?',
      a: 'Usually not. Instagram does not let apps read posts from private accounts. Screenshot the caption and import the screenshot instead.',
    },
    {
      q: 'Will my saved recipe disappear if the Instagram post is deleted?',
      a: 'An Instagram bookmark will. A recipe imported into Glutt keeps its ingredients, steps and photo in the app.',
    },
    {
      q: 'Is Glutt available on Android?',
      a: 'Not currently. Glutt is an iPhone app for iOS 17.2 or later. ReciMe and Flavorish import Instagram recipes on Android.',
    },
  ],
  faqSchema: true,
  related: ['guides/save-recipes-from-tiktok-instagram', 'guides/save-recipes-from-youtube', 'ai-chef'],
  ctaTitle: 'Turn the post into <em>dinner.</em>',
};
