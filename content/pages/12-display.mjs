export default {
  slug: 'guides/cooking-with-meta-ray-ban-display',
  order: 12,
  navLabel: 'Cooking with Meta Ray-Ban Display',
  crumb: 'Meta Ray-Ban Display',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Recipe steps in your eyeline: what the Display can do in a kitchen today, NYT Cooking included.',
  title: 'Cooking With Meta Ray-Ban Display: Recipes in Your Eyeline',
  ogTitle: 'Cooking with Meta Ray-Ban Display',
  description:
    'What Meta Ray-Ban Display can actually do while you cook: Meta AI, recipe step cards, the Neural Band, the web-app platform, and how a phone cooking app fits alongside it.',
  eyebrow: 'Guide · Meta Ray-Ban Display',
  h1: 'Cooking with <em>Meta Ray-Ban Display.</em>',
  lede:
    'A screen in your glasses solves the oldest kitchen problem: reading the next step without touching anything. Here is what the Display does in a kitchen today, and where a phone app still does the work.',
  published: '2026-09-25',
  updated: '2026-11-17',
  image: '/assets/app/voice-cookmode-900.webp',
  imageAlt: 'Glutt cook mode showing the current step, with voice help from Polly.',
  mentionsApp: true,
  about: [{ '@type': 'Thing', name: 'Meta Ray-Ban Display' }, { '@type': 'Thing', name: 'Hands-free cooking' }],
  answer:
    'Meta Ray-Ban Display puts a small screen in your right lens, controlled by the Meta Neural Band on your wrist. For cooking today that means Meta AI by voice, timers, and glanceable cards. <strong>New York Times Cooking</strong> now has a hands-free mode that shows recipe steps in the lens and reads them aloud, on a small selection of its recipes. Third-party developers can now build Display <strong>web apps</strong>, and Meta names "cooking guides" as an example. <a href="/">Glutt</a> works with Display today through audio: its AI chef talks you through your own saved recipes. It does not draw on the Display screen yet.',
  body: `
            <h2>What makes the Display different from other AI glasses</h2>
            <p>
              Ordinary Ray-Ban Meta and Oakley Meta glasses are ears and, on most models, a camera. The
              Display adds a small screen in one lens and ships with the <strong>Meta Neural Band</strong>, a
              wristband you control it with. In a kitchen, that changes what is possible: you can
              <em>read</em> the next step instead of asking for it to be read aloud, which is faster and
              survives a noisy extractor fan.
            </p>

            <h2>What you can do in the kitchen today</h2>
            <ul>
              <li><strong>Ask Meta AI out loud</strong> for substitutions, conversions and timers, exactly as on the non-display glasses.</li>
              <li><strong>Glance at cards</strong> rather than listening to everything read out.</li>
              <li><strong>Keep your hands dirty.</strong> The Neural Band takes small finger movements, so you can move through content without touching a screen at all.</li>
              <li><strong>Run a cooking app's audio</strong> through the glasses, the way you would with any Bluetooth headset. That is how <a href="/ai-chef">Polly, Glutt's AI chef</a>, works with them today.</li>
            </ul>

            <h2>New York Times Cooking shows recipe steps in the lens</h2>
            <p>
              NYT Cooking previewed a hands-free mode at Meta Connect in September 2026, and it is now
              live. <sup><a href="#src-h">2</a>, <a href="#src-h">4</a></sup> On Meta Ray-Ban Display the
              steps appear in the lens as you cook and are read aloud, and you move through them by voice,
              with the touchpad on the glasses, or with Neural Band gestures. Other Meta AI glasses get the
              audio-only version.
            </p>
            <ul>
              <li><strong>Recipes:</strong> a small selection of NYT recipes to start, with more promised.</li>
              <li><strong>Phone:</strong> iPhone 15 or later, iOS 26 or later with Apple Intelligence on. Not available on iPad.</li>
              <li><strong>Setup:</strong> the Meta AI app connected to both the glasses and NYT Cooking.</li>
            </ul>
            <p>
              It is the clearest signal yet that step-by-step cooking is a first-class use for the Display,
              and if you cook from NYT Cooking it is excellent for their recipes. It reads their catalogue,
              not the recipe you saved off Instagram last week.
            </p>

            <h2>The Display can run third-party web apps now</h2>
            <p>
              Meta's developer documentation is direct about it: "Web apps run on Meta Ray-Ban Display glasses
              using standard web APIs," for "games, navigation tools, <strong>cooking guides</strong>, and other
              lightweight experiences without a companion app." <sup><a href="#src-h">1</a></sup> Input comes
              through gestures, with handwriting on the Neural Band, dictation or an on-screen keyboard for
              text, and there is a browser simulator so developers can build before owning the hardware.
            </p>
            <p>
              Separately, the <strong>Wearables Device Access Toolkit</strong>, which is what an iPhone app
              would use to reach the glasses' camera and sensors, reached <strong>1.0 on September 30,
              2026</strong> after a year in developer preview. Publishing did not open with it: Meta says
              "You'll soon be able to submit your Device Access Toolkit and Web Apps experiences to be
              published," and "We'll have more to share on submission and publishing timing soon."
              <sup><a href="#src-h">3</a></sup> So the honest state of play in November 2026 is: these
              experiences are buildable and testable, and not yet shippable to you.
            </p>

            <h2>Where a phone cooking app still does the work</h2>
            <div class="table">
              <table>
                <thead>
                  <tr><th scope="col"></th><th scope="col">Meta Ray-Ban Display alone</th><th scope="col">Display + a cooking app like Glutt</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Your own saved recipes</th><td>No</td><td>Yes: TikTok, Instagram, websites, screenshots</td></tr>
                  <tr><th scope="row">Knows your pantry</th><td>No</td><td>Yes, and what you're missing before you start</td></tr>
                  <tr><th scope="row">Step tracking and timers</th><td>Generic timers; NYT step cards on supported NYT recipes</td><td>Timers attached to the step that needs them</td></tr>
                  <tr><th scope="row">Answers questions mid-cook</th><td>Meta AI, from general knowledge</td><td>Polly, from the recipe you are cooking</td></tr>
                  <tr><th scope="row">Shown on the Display screen</th><td>Yes, that's the point</td><td>Not yet; Glutt uses the audio</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Put plainly: the Display is a very good pair of eyes and ears. What it lacks is memory of
              <em>your</em> kitchen, and that is the part a cooking app brings.
            </p>

            <h2>Setting it up for cooking</h2>
            <ol>
              <li><strong>Pair the glasses and the Neural Band</strong> in the Meta AI app.</li>
              <li><strong>Charge both before a long cook.</strong> A braise plus a live voice session is a lot of screen and radio time.</li>
              <li><strong>Pick your recipe on the phone first</strong>, then start cooking. Choosing is a screen job; cooking is not.</li>
              <li><strong>Prop the phone facing the stove</strong> if you want the AI chef to look at the pan; that vision comes from the iPhone camera, not the glasses.</li>
              <li><strong>Say "Chef"</strong> for Glutt, "Hey Meta" for Meta AI. Two assistants, two wake words.</li>
            </ol>
          `,
  faq: [
    {
      q: 'Is there a recipe app for Meta Ray-Ban Display?',
      a: 'Yes: New York Times Cooking has a hands-free mode that shows recipe steps on the Display and reads them aloud, on a small selection of its recipes, and it needs an iPhone 15 or later. Meta also lets developers build Display web apps and names cooking guides as an example use. Glutt works with Display today through audio: its AI chef talks you through recipes you saved, though it does not draw on the Display screen.',
    },
    {
      q: 'Can Meta Ray-Ban Display show recipe steps?',
      a: 'Yes. NYT Cooking shows recipe steps in the lens on supported recipes, and you move through them by voice, the touchpad or the Neural Band. Meta AI can show glanceable cards, and any developer can build a Display web app that shows steps.',
    },
    {
      q: 'Does Glutt work with Meta Ray-Ban Display?',
      a: 'Yes, for audio. Glutt uses the glasses as a Bluetooth headset, so Polly talks you through the recipe and hears your questions. Glutt does not render anything on the Display screen yet.',
    },
    {
      q: 'What is the Meta Neural Band?',
      a: 'The wristband sold with Meta Ray-Ban Display. It reads small finger movements so you can control the glasses without touching them, which is exactly what you want with wet hands.',
    },
    {
      q: 'Can third-party apps use the Meta glasses camera?',
      a: 'Not for public release yet. Meta\'s Wearables Device Access Toolkit reached 1.0 on September 30, 2026, but submissions for publishing are still not open, so nothing using the glasses camera can ship to end users yet.',
    },
  ],
  faqSchema: true,
  sources: [
    { title: 'Meta for Developers: Build web apps for AI glasses', url: 'https://developers.meta.com/wearables/web-apps/' },
    {
      title: 'Engadget: New York Times Cooking is coming to Meta\'s AI and display glasses',
      url: 'https://www.engadget.com/2268183/new-york-times-cooking-is-coming-to-metas-ai-and-display-glasses/',
      note: 'September 24, 2026',
    },
    { title: 'Meta for Developers: Wearables Device Access Toolkit FAQ', url: 'https://developers.meta.com/wearables/faq/' },
    { title: 'NYT Help Center: Hands-Free Cooking with Meta AI Glasses', url: 'https://help.nytimes.com/360011047512-New-York-Times-Cooking/hands-free-cooking-with-meta-ai-glasses' },
  ],
  related: ['guides/cooking-with-meta-glasses', 'guides/ai-glasses-for-cooking', 'ai-chef'],
  ctaTitle: 'Bring <em>your own recipes</em> to the glasses.',
};
