export default {
  slug: 'guides/save-recipes-from-youtube',
  order: 41,
  navLabel: 'Save a recipe from a YouTube video',
  crumb: 'Save recipes from YouTube',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Get the ingredients and steps out of a cooking video, even when the recipe is only spoken.',
  title: 'How to Save a Recipe from a YouTube Video (2026)',
  ogTitle: 'How to save a recipe from a YouTube video, and cook from it',
  description:
    'How to save a recipe from a YouTube video: where creators put it, why Watch Later is not enough, and how to turn even a spoken-only video into a recipe.',
  eyebrow: 'Guide · Recipe import',
  h1: 'Save a recipe from a YouTube video, <em>not just the video.</em>',
  lede:
    'A great cooking video is a terrible thing to cook from. You need the quantities written down and the steps numbered, not a twenty-minute timeline to scrub through with flour on your hands.',
  published: '2026-10-20',
  updated: '2026-10-20',
  image: '/assets/screens/recipes-900.webp',
  imageAlt: 'The Glutt recipes screen with saved meals, collections and a pantry match.',
  mentionsApp: true,
  answer:
    'Saving the video to <strong>Watch Later</strong> or a playlist only saves the video. To save the <strong>recipe</strong>, first check the description: many creators paste the full ingredient list there, or link to it. Then share the video to a recipe app that reads it for you. In <a href="/">Glutt</a>, tap <strong>Share</strong> on the video, choose Glutt, and it builds the recipe from the description. If the description has no recipe, Glutt listens to the video and writes the spoken method out as ingredients and steps.',
  body: `
            <h2>Where the recipe in a YouTube video actually is</h2>
            <p>
              YouTube cooking videos put the recipe in one of four places, and it is worth knowing which
              before you try to save it:
            </p>
            <div class="table">
              <table>
                <thead><tr><th scope="col">Where it is</th><th scope="col">How to tell</th><th scope="col">What to do</th></tr></thead>
                <tbody>
                  <tr><th scope="row">In the description</th><td>Open the description below the title. A list with amounts means you are in luck</td><td>Any recipe app that reads descriptions will get it cleanly</td></tr>
                  <tr><th scope="row">On the creator's website</th><td>The description says "full recipe" with a link</td><td>Open the link and save that page instead. Recipe sites import best of all</td></tr>
                  <tr><th scope="row">On screen only</th><td>Quantities flash up as text during the video</td><td>Pause and screenshot those frames, then import the screenshots</td></tr>
                  <tr><th scope="row">Spoken only</th><td>Nothing written anywhere, the cook just tells you</td><td>Use an app that transcribes the audio, or write it down while you watch</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Pinned comments sometimes hold a recipe too. Most import tools only read the video's own page,
              so copy a pinned-comment recipe into a note or a screenshot yourself.
            </p>

            <h2>Why Watch Later is not a recipe box</h2>
            <p>
              YouTube's <strong>Save</strong> button adds the video to Watch Later or a playlist.
              <sup><a href="#src-h">1</a></sup> That is useful for finding the video again, but it keeps
              everything that makes cooking from video hard: no ingredient list to shop from, no way to scale
              servings, and a recipe that disappears if the video is removed or made private. Save the
              playlist for inspiration, and save the recipe somewhere you can cook from.
            </p>

            <h2>How to save a YouTube recipe to Glutt</h2>
            <ol>
              <li>Open the video in the YouTube app and tap <strong>Share</strong>.</li>
              <li>Choose <strong>Glutt</strong>. If it is not in the row, tap <strong>More</strong> to open the iPhone share sheet and add Glutt to your favorites once.</li>
              <li>Glutt reads the description. If the recipe is written there, it becomes ingredients, steps and timings.</li>
              <li>If the description has no recipe, Glutt listens to the video and writes the spoken method out instead.</li>
              <li>Check the result against the video, especially quantities a creator said quickly, then save.</li>
            </ol>
            <p>
              You can also copy the video link and paste it into Glutt's import screen. A Reddit post that
              links to a YouTube recipe works the same way: Glutt follows the link.
            </p>

            <h2>After it is saved</h2>
            <ul>
              <li><strong>See what you are missing.</strong> Glutt compares the ingredients with your pantry before you start, and only the gaps go to the grocery list.</li>
              <li><strong>Cook it hands-free.</strong> <a href="/ai-chef">Polly, Glutt's AI chef</a>, reads each step aloud, keeps your place and runs the timers, so you are not rewinding a video with wet hands.</li>
              <li><strong>Keep it if the video goes.</strong> The ingredients and steps live in the app, not on YouTube.</li>
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

            <h2>Other ways to do it</h2>
            <p>
              <strong>ReciMe</strong> imports YouTube videos through the share sheet as well, reading the
              description first and falling back to the audio, and it is on Android, which Glutt is not.
              <sup><a href="#src-h">2</a></sup> If you would rather not install anything, copy the description
              into your notes app, or screenshot the on-screen quantities. For TikTok and Instagram, see
              <a href="/guides/save-recipes-from-tiktok-instagram">saving recipes from TikTok and Instagram</a>.
            </p>
          `,
  faq: [
    {
      q: 'How do I save a recipe from a YouTube video?',
      a: 'Check the description first, since many creators paste the full recipe or link to it there. Then share the video to a recipe app such as Glutt or ReciMe, which turns it into an ingredient list and steps. Saving to Watch Later only saves the video, not the recipe.',
    },
    {
      q: 'Can an app get a recipe from a YouTube video with no written recipe?',
      a: 'Yes. When the description has no recipe, Glutt transcribes what the cook says in the video and writes it out as ingredients and steps. Check the quantities afterwards, because spoken amounts are easy to mishear or round.',
    },
    {
      q: 'Where is the recipe in a YouTube cooking video?',
      a: 'Usually in the description below the title, or behind a "full recipe" link to the creator\'s website. Some videos only show quantities on screen or say them out loud, and occasionally the recipe is in a pinned comment.',
    },
    {
      q: 'Will my saved recipe disappear if the YouTube video is deleted?',
      a: 'Not if you imported it. A Watch Later entry or playlist item vanishes with the video, but a recipe imported into Glutt keeps its ingredients and steps in the app.',
    },
    {
      q: 'Is Glutt available on Android?',
      a: 'Not currently. Glutt is an iPhone app for iOS 17.2 or later. ReciMe imports YouTube recipes on Android.',
    },
  ],
  faqSchema: true,
  sources: [
    {
      title: 'YouTube Help: Create and manage playlists',
      url: 'https://support.google.com/youtube/answer/57792',
    },
    {
      title: 'ReciMe Help Center: Import from YouTube',
      url: 'https://help.recime.app/en/articles/11625001-import-from-youtube',
    },
  ],
  related: ['guides/save-recipes-from-tiktok-instagram', 'ai-chef', 'guides/make-your-own-cookbook'],
  ctaTitle: 'Turn the video into <em>dinner.</em>',
};
