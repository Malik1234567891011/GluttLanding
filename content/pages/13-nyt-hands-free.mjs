export default {
  slug: 'guides/nyt-cooking-hands-free-meta-glasses',
  order: 13,
  navLabel: 'NYT Cooking Hands-Free on Meta glasses',
  crumb: 'NYT Cooking Hands-Free',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'How to set up NYT Cooking on Meta AI glasses, what it needs, and what to use when it is not an option.',
  title: 'NYT Cooking Hands-Free on Meta Glasses: Setup, Requirements, Fixes',
  ogTitle: 'How to use NYT Cooking Hands-Free with Meta AI glasses',
  description:
    'How to use NYT Cooking Hands-Free on Ray-Ban Meta, Oakley Meta and Meta Ray-Ban Display: requirements, setup, voice commands, and why the option can be missing.',
  eyebrow: 'Guide · Meta AI glasses',
  h1: 'NYT Cooking Hands-Free <em>on Meta glasses.</em>',
  lede:
    'New York Times Cooking can now read a recipe to you through Meta AI glasses, one step at a time, and show the steps in the lens on Meta Ray-Ban Display. Here is what it needs, how to set it up, and what to do when it will not work for you.',
  published: '2026-11-17',
  updated: '2026-11-17',
  image: '/assets/app/voice-cookmode-900.webp',
  imageAlt: 'Glutt cook mode showing the current recipe step, with voice help from Polly.',
  mentionsApp: true,
  about: [
    { '@type': 'Thing', name: 'NYT Cooking' },
    { '@type': 'Thing', name: 'Ray-Ban Meta' },
    { '@type': 'Thing', name: 'Hands-free cooking' },
  ],
  answer:
    'NYT Cooking <strong>Hands-Free</strong> reads recipe steps through Meta AI glasses and moves on when you say "next." It needs an <strong>iPhone 15 or later on iOS 26 or later with Apple Intelligence on</strong>, the Meta AI app connected to your glasses, and a recipe that supports it: a selection of NYT recipes to start. It is not available on iPad. To start, open a supported recipe and choose <strong>Hands-Free</strong> in its Preparation section. If your phone is older, you are on iPad, or the recipe is not from NYT, <a href="/">Glutt</a> talks you through any recipe you have saved through the same glasses, on iOS 17.2 or later.',
  body: `
            <h2>What NYT Cooking Hands-Free does</h2>
            <p>
              It turns a supported NYT recipe into spoken steps. NYT's editors rewrote long steps into short
              instructions with the ingredients and amounts built in, so you are not listening to a paragraph
              read out word for word. <sup><a href="#src-h">2</a></sup> There are two versions, depending on
              your glasses: <sup><a href="#src-h">1</a></sup>
            </p>
            <div class="table">
              <table>
                <thead><tr><th scope="col">Experience</th><th scope="col">What you get</th><th scope="col">Glasses</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Audio</th><td>Each step read aloud through the glasses' speakers; move through the recipe by voice</td><td>Ray-Ban Meta, Oakley Meta HSTN, Oakley Meta Vanguard, Ray-Ban Meta Optics, Meta Ray-Ban Display</td></tr>
                  <tr><th scope="row">Audio and display</th><td>The same, plus the steps shown in the lens; navigate by voice, the touchpad or Meta Neural Band gestures</td><td>Meta Ray-Ban Display only</td></tr>
                </tbody>
              </table>
            </div>

            <h2>What you need</h2>
            <ul>
              <li><strong>An iPhone 15 or later.</strong> It is not available on iPad.</li>
              <li><strong>iOS 26 or later, with Apple Intelligence turned on.</strong> Check Settings if you are not sure.</li>
              <li><strong>The Meta AI app</strong>, updated and connected to your glasses. Glasses software updates also happen there.</li>
              <li><strong>Bluetooth and microphone access</strong> for NYT Cooking, so it can reach the glasses and hear you.</li>
              <li><strong>A supported recipe.</strong> Hands-Free works on a selection of NYT recipes to start, with more being added.</li>
            </ul>
            <p>
              NYT's help page also asks that the glasses are switched on, worn, and have their arms fully
              unfolded. <sup><a href="#src-h">1</a></sup>
            </p>

            <h2>How to set it up</h2>
            <ol>
              <li>Open a recipe that supports Hands-Free in the NYT Cooking app. The first time, a prompt offers to connect your glasses; if it does not appear, tap <strong>Hands-Free</strong> in the recipe's Preparation section.</li>
              <li>Allow NYT Cooking to find Bluetooth devices, and accept the terms.</li>
              <li>The Meta AI app opens and asks to connect NYT Cooking to your glasses. Approve it, and you are sent back.</li>
              <li>Allow microphone access. Your glasses show up as connected.</li>
              <li>Tap <strong>Start Hands-Free</strong>, then cook. Say <strong>"next"</strong>, <strong>"back"</strong> or <strong>"help"</strong> to move around, and <strong>"exit"</strong> to stop.</li>
            </ol>

            <h2>Why is the Hands-Free option missing?</h2>
            <ul>
              <li><strong>The recipe is not supported yet.</strong> Only some recipes have it. NYT points to collections such as its most popular recipes and quick weeknight dinners as good places to look.</li>
              <li><strong>The app cannot see your glasses.</strong> The option only appears when NYT Cooking detects connected glasses: check they are on, connected in the Meta AI app, and in Bluetooth range.</li>
              <li><strong>Your phone does not qualify.</strong> An iPhone 14 or older, an iPad, or Apple Intelligence switched off will keep it hidden.</li>
            </ul>

            <h2>When NYT Hands-Free is not the right fit</h2>
            <p>
              If you cook from NYT Cooking on a recent iPhone, use it: the step rewrites are genuinely good.
              It is a narrator for NYT's own catalogue, though, so three groups are left out:
            </p>
            <ul>
              <li><strong>Older iPhones and iPads.</strong> Anything below an iPhone 15, or any iPad, cannot run it.</li>
              <li><strong>Recipes from anywhere else.</strong> A TikTok you saved, a family recipe, a food blog: Hands-Free only reads supported NYT recipes.</li>
              <li><strong>Cooks with questions.</strong> It moves you through steps. It does not answer "can I use butter instead?" or "is this browned enough?"</li>
            </ul>
            <p>
              That is the gap <a href="/">Glutt</a> fills with the same glasses. Glutt uses them as a Bluetooth
              headset, so <a href="/ai-chef">Polly, its AI chef</a>, talks you through <em>any</em> recipe you
              saved, from <a href="/guides/save-recipes-from-tiktok-instagram">TikTok and Instagram</a>,
              <a href="/guides/save-recipes-from-youtube">YouTube</a>, websites or screenshots, keeps your place,
              runs timers, and answers questions out loud. It runs on iOS 17.2 or later. It does not draw
              anything on the Display's screen; that part is NYT's advantage today.
            </p>

            <div class="table">
              <table>
                <thead><tr><th scope="col"></th><th scope="col">NYT Cooking Hands-Free</th><th scope="col">Glutt with Meta glasses</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Recipes</th><td>A selection of NYT recipes</td><td>Any recipe you save or import</td></tr>
                  <tr><th scope="row">Phone</th><td>iPhone 15 or later, iOS 26+, Apple Intelligence; no iPad</td><td>iOS 17.2 or later</td></tr>
                  <tr><th scope="row">Voice</th><td>Commands: next, back, help, exit</td><td>Conversation: say "Chef" and ask anything about the recipe</td></tr>
                  <tr><th scope="row">Steps in the Display lens</th><td>Yes</td><td>No, audio only</td></tr>
                  <tr><th scope="row">Glasses</th><td>Connected through the Meta AI app</td><td>Any Meta glasses paired as Bluetooth audio</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Plenty of people will use both: NYT for its own recipes, Glutt for everything else. For the
              full picture of cooking with the glasses, see
              <a href="/guides/cooking-with-meta-glasses">cooking with Meta glasses</a> and
              <a href="/guides/cooking-with-meta-ray-ban-display">cooking with Meta Ray-Ban Display</a>.
            </p>
          `,
  faq: [
    {
      q: 'Does NYT Cooking work with Ray-Ban Meta glasses?',
      a: 'Yes. NYT Cooking Hands-Free reads supported recipes aloud through Ray-Ban Meta, Oakley Meta HSTN, Oakley Meta Vanguard and other Meta AI glasses, and shows the steps in the lens on Meta Ray-Ban Display. It needs an iPhone 15 or later on iOS 26 with Apple Intelligence on.',
    },
    {
      q: 'Why don\'t I see Hands-Free on an NYT Cooking recipe?',
      a: 'Either the recipe is not supported yet (only a selection are), NYT Cooking cannot detect your glasses (check they are on, connected in the Meta AI app and in Bluetooth range), or your device does not qualify: it needs an iPhone 15 or later on iOS 26 with Apple Intelligence, and it is not available on iPad.',
    },
    {
      q: 'What voice commands does NYT Cooking Hands-Free use?',
      a: 'Say "next," "back" or "help" to move through the recipe, and "exit" to leave Hands-Free mode.',
    },
    {
      q: 'Can I use NYT Cooking Hands-Free on an iPad or an older iPhone?',
      a: 'No. NYT says it needs an iPhone 15 or later and is not available on iPad. Glutt works with Meta glasses as Bluetooth audio on iOS 17.2 or later and talks you through any recipe you saved.',
    },
    {
      q: 'Can NYT Cooking Hands-Free read recipes from other websites?',
      a: 'No. It reads supported NYT Cooking recipes. To cook a recipe from TikTok, Instagram, YouTube or another site hands-free through Meta glasses, import it into an app like Glutt, whose AI chef reads the steps and answers questions.',
    },
  ],
  faqSchema: true,
  sources: [
    { title: 'NYT Help Center: Hands-Free Cooking with Meta AI Glasses', url: 'https://help.nytimes.com/360011047512-New-York-Times-Cooking/hands-free-cooking-with-meta-ai-glasses' },
    { title: 'Engadget: New York Times Cooking is coming to Meta\'s AI and display glasses', url: 'https://www.engadget.com/2268183/new-york-times-cooking-is-coming-to-metas-ai-and-display-glasses/', note: 'September 24, 2026' },
  ],
  related: ['guides/cooking-with-meta-glasses', 'guides/cooking-with-meta-ray-ban-display', 'ai-chef'],
  ctaTitle: 'Cook <em>any recipe</em> through your glasses.',
};
