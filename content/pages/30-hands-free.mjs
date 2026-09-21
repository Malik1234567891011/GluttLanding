export default {
  slug: 'guides/hands-free-cooking',
  order: 30,
  navLabel: 'Hands-free cooking, explained',
  crumb: 'Hands-free cooking',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Every way to follow a recipe without touching your phone, from voice apps to smart glasses.',
  title: 'Hands-Free Cooking App Guide: Follow Recipes by Voice (2026)',
  ogTitle: 'Hands-free cooking: how to follow a recipe without touching your phone',
  description:
    'How to follow a recipe without touching your phone: voice cooking apps, AI chefs, Siri and Alexa, smart glasses and gestures compared, with setup tips.',
  eyebrow: 'Guide · Voice cooking',
  h1: 'Hands-free cooking: <em>follow a recipe without touching your phone.</em>',
  lede:
    'Raw chicken on your fingers, flour up to the wrists, a screen that locks itself every thirty seconds. Here is every practical way to cook from a recipe without touching your phone, and how they compare.',
  published: '2026-09-20',
  updated: '2026-09-20',
  image: '/assets/app/cookmode-video-900.webp',
  imageAlt: 'Glutt cook mode playing a technique clip for the current recipe step.',
  mentionsApp: true,
  answer:
    'The most hands-free way to cook from a recipe is a voice cooking assistant: an app that reads each step aloud, listens for questions and runs timers by voice. Some only understand fixed commands like "next." Conversational AI chefs such as Polly in <a href="/ai-chef">Glutt</a> answer free-form questions about the recipe you are cooking. Prop the phone at eye level, keep the screen awake, and use earbuds or Meta glasses if the kitchen is loud.',
  body: `
            <h2>Why cooking hands-free matters</h2>
            <p>
              It is not only about keeping your screen clean. FoodSafety.gov estimates that 1 in 6 Americans
              get sick from food poisoning each year and 128,000 are hospitalized, and its first rule is to wash
              your hands for at least 20 seconds, with soap, after handling raw meat, poultry, seafood or
              uncooked eggs. <sup><a href="#src-h">1</a></sup> A recipe that needs you to unlock and scroll your
              phone between steps turns that into a choice between food safety and following the recipe. Voice
              removes the choice.
            </p>

            <h2>The five ways to cook hands-free</h2>
            <div class="table">
              <table>
                <thead>
                  <tr><th scope="col">Method</th><th scope="col">How it works</th><th scope="col">Good at</th><th scope="col">Weak at</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Conversational AI chef apps</th>
                    <td>An app reads the recipe aloud and answers free-form questions. Examples: Glutt (Polly), Suvio, Cookie Voice Recipes.</td>
                    <td>Real questions ("can I use olive oil instead?"), knows the recipe and step</td>
                    <td>Needs a data connection; most are subscriptions</td>
                  </tr>
                  <tr>
                    <th scope="row">Command-based recipe apps</th>
                    <td>Fixed voice commands like "next" and "repeat." Examples: SideChef, Pestle.</td>
                    <td>Predictable, fast, simple</td>
                    <td>Can't answer questions outside the commands</td>
                  </tr>
                  <tr>
                    <th scope="row">General voice assistants</th>
                    <td>Siri, Alexa, Google Assistant, ChatGPT Voice or Gemini Live, asked questions as you go.</td>
                    <td>Free, already on your devices, good for conversions and timers</td>
                    <td>Don't know your recipe or which step you're on</td>
                  </tr>
                  <tr>
                    <th scope="row">Smart glasses</th>
                    <td>Ray-Ban Meta or Oakley Meta glasses with Meta AI, or as a headset for a cooking app.</td>
                    <td>Truly hands-free, audio right at your ears, POV camera</td>
                    <td>Cost; Meta AI alone doesn't know your recipe</td>
                  </tr>
                  <tr>
                    <th scope="row">Gesture control</th>
                    <td>Wave or move a hand in front of the camera to advance steps. Example: Crouton.</td>
                    <td>Silent; works with a noisy extractor fan</td>
                    <td>Only moves between steps, no answers</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>How to set up a hands-free kitchen</h2>
            <ol>
              <li><strong>Put the phone at eye level</strong> on a stand or propped against the backsplash, out of the splash zone but where you can glance at it.</li>
              <li><strong>Keep the screen awake.</strong> A good cooking app does this for you in cook mode. Otherwise, lengthen Auto-Lock while you cook.</li>
              <li><strong>Read the recipe once before you start.</strong> Voice help is for the middle of the cook, not for discovering at step 6 that the dough needed to rest overnight.</li>
              <li><strong>Prep your mise en place.</strong> Chop, measure and open things first. Hands-free cooking goes smoothly when the hands-on work is done.</li>
              <li><strong>Pick your audio.</strong> The phone speaker is fine in a quiet kitchen. With a loud extractor or a sizzling pan, AirPods or <a href="/guides/cooking-with-meta-glasses">Meta glasses</a> keep the conversation clear.</li>
              <li><strong>Learn the wake word.</strong> In Glutt it is "Chef." With several assistants around, say the right name so the right one answers.</li>
            </ol>

            <h2>What to ask a voice cooking assistant</h2>
            <p>The questions that make voice worth it are the ones you would otherwise wash your hands to type:</p>
            <ul>
              <li>"What's the next step?" and "Say that again."</li>
              <li>"How much garlic was it?"</li>
              <li>"I don't have shallots. What can I use?"</li>
              <li>"Start a 12-minute timer for the pasta."</li>
              <li>"Is this oil hot enough?" (with a camera-enabled assistant)</li>
              <li>"How do I know when the onions are caramelized?"</li>
              <li>"Can I make this dairy-free?"</li>
            </ul>

            <blockquote>
              <p>"Being able to cook hands free and ask questions verbally is a game changer."</p>
              <cite>darklightaisawa, App Store review of Glutt, July 29, 2026</cite>
            </blockquote>

            <h2>How Glutt does hands-free cooking</h2>
            <p>
              Glutt was built around this problem. Its AI chef, Polly, walks you through the recipe you
              saved, listens for "Chef," answers out loud, runs the timer for each step that needs one, and
              can look at the pan through your iPhone camera if you turn it on. Cook mode uses type big enough
              to read from across the counter. <a href="/ai-chef">Here is what Polly can do.</a>
            </p>

            <div class="shot">
              <figure>
                <img src="/assets/app/voice-cookmode-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="Glutt cook mode showing one recipe step in large type with voice help available." />
                <figcaption>Cook mode: one step, big type, voice on.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/recipe-detail-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="A Glutt recipe detail screen for Beef Wellington." />
                <figcaption>Any saved recipe can be cooked with Polly.</figcaption>
              </figure>
            </div>

            <h2>Safety notes</h2>
            <ul>
              <li>Use a thermometer for meat. The USDA's safe minimum internal temperature for poultry is 165°F. <sup><a href="#src-h">2</a></sup></li>
              <li>Keep cables and phone stands away from burners and the sink.</li>
              <li>With glasses on, step back from boiling pots before you lean in. Steam fogs lenses fast.</li>
            </ul>
          `,
  faq: [
    {
      q: 'What is the best hands-free cooking app?',
      a: 'For free-form questions while you cook, choose a conversational AI chef app such as Glutt, whose AI chef Polly answers out loud and knows the recipe you are cooking. For simple step navigation, a command-based app like SideChef works. If you are blind or have low vision, Cookie Voice Recipes is built around VoiceOver.',
    },
    {
      q: 'Can Siri or Alexa read a recipe to me?',
      a: 'They can answer questions and set timers, and some recipe apps offer Siri Shortcuts or Alexa skills. But a general assistant does not know which recipe or step you are on, so you end up repeating context. Dedicated voice cooking apps keep track of that for you.',
    },
    {
      q: 'Is there a cooking app that listens and answers questions?',
      a: 'Yes. In Glutt, you say "Chef" and ask anything about the recipe you are cooking: substitutions, doneness, the next step or a timer. Polly, the AI chef, answers out loud.',
    },
    {
      q: 'Does hands-free cooking work in a noisy kitchen?',
      a: 'Usually, if the microphone is close to you. AirPods, other Bluetooth headsets or Meta glasses put the microphone near your mouth and the audio in your ears, which works much better than a phone across the room.',
    },
  ],
  faqSchema: true,
  sources: [
    { title: 'FoodSafety.gov: 4 Steps to Food Safety', url: 'https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety' },
    {
      title: 'USDA FSIS: Safe Minimum Internal Temperature Chart',
      url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
    },
  ],
  related: ['ai-chef', 'guides/cooking-with-meta-glasses', 'best-ai-cooking-apps'],
};
