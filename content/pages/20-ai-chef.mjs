export default {
  slug: 'ai-chef',
  order: 20,
  navLabel: 'Polly, Glutt\'s AI chef',
  crumb: 'AI chef',
  cardText: 'A live voice AI chef that knows your recipe, runs your timers and can look at the pan.',
  title: 'AI Chef App: Meet Polly, the Live Voice AI Chef in Glutt',
  ogTitle: 'Meet Polly, the live AI chef that cooks with you',
  description:
    'Polly is the live voice AI chef in Glutt for iPhone. Say "Chef," ask out loud, and she walks you through every step, runs timers and can look at your pan.',
  eyebrow: 'The AI chef in Glutt',
  h1: 'Meet Polly, <em>the AI chef who cooks with you.</em>',
  lede:
    'Most AI recipe apps write you a recipe and leave. Polly stays for dinner. She is a live voice AI chef that talks you through the recipe you are cooking, out loud, while your hands are busy.',
  published: '2026-09-20',
  updated: '2026-09-24',
  author: 'org',
  image: '/assets/app/ask-polly-900.webp',
  imageAlt: 'Ask Polly: a chat with Glutt\'s AI chef about a recipe.',
  schemaType: 'WebPage',
  video: {
    src: '/assets/app/hero-video.mp4',
    poster: '/assets/app/hero-poster.webp',
    posterAbs: '/assets/app/hero-poster.jpg',
    width: 444,
    height: 876,
    duration: 'PT14S',
    uploadDate: '2026-09-08',
    name: 'Cooking with Polly, the AI chef in Glutt',
    description:
      'A screen recording of Glutt guiding a recipe step by step, with Polly, the live voice AI chef, listening for "Chef".',
    caption: 'Fourteen seconds of cook mode with Polly. Tap to play, sound optional.',
  },
  mentionsApp: true,
  includeApp: true,
  about: { '@id': 'https://glutt.org/#app' },
  answer:
    'Polly is the live voice AI chef inside <strong>Glutt: Recipes &amp; AI Chef</strong>, an iPhone cooking app. Say "Chef" and ask a question out loud: what to use instead of buttermilk, whether the chicken is done, what comes next. She answers straight away, walks you through every step of your recipe, runs your timers and, if you let her, looks at the pan through the camera. No tapping the screen with greasy hands.',
  body: `
            <h2>What Polly does</h2>
            <p>
              Polly works from the recipe in front of you, not from a blank chat box. She knows the
              ingredients, the number of servings, the step you are on and the timers you have running. That
              context is the difference between an AI chef and a chatbot that happens to know about food.
            </p>
            <ul>
              <li><strong>Walks you through every step,</strong> in order, and moves on when you are ready.</li>
              <li><strong>Answers questions out loud.</strong> Substitutions, doneness, "why is my sauce splitting," "how thin do I slice this."</li>
              <li><strong>Runs your timers.</strong> Steps like "sear 4 minutes per side" offer a countdown, and Polly keeps track of it.</li>
              <li><strong>Looks at the pan.</strong> Turn the camera on and ask "does this look right?" The camera is off until you choose to use it.</li>
              <li><strong>Changes the recipe.</strong> Missing an ingredient, want it lighter, cheaper or higher in protein? Ask, and the recipe changes.</li>
              <li><strong>Works through your glasses or earbuds.</strong> AirPods, any Bluetooth headset, or <a href="/guides/cooking-with-meta-glasses">Ray-Ban Meta and Oakley Meta glasses</a>, whose microphones and speakers Glutt picks automatically.</li>
            </ul>

            <h2>What a cook with Polly sounds like</h2>
            <p>A few typical exchanges. Polly's exact words depend on your recipe and what she sees.</p>
            <div class="table">
              <table>
                <thead><tr><th scope="col">You say</th><th scope="col">Polly</th></tr></thead>
                <tbody>
                  <tr><td>"Chef, I don't have buttermilk."</td><td>Offers a swap you can make from what you have, like milk with a spoon of lemon juice, and says how long to let it sit.</td></tr>
                  <tr><td>"Chef, is the chicken cooked through?"</td><td>Looks through the camera and tells you what she sees. For chicken, a thermometer reading of 165°F (74°C) is still the safe line.</td></tr>
                  <tr><td>"Chef, start the rice timer."</td><td>Starts the countdown for that step and tells you when it is done.</td></tr>
                  <tr><td>"Chef, what's next?"</td><td>Reads the next step and flags anything you should prep now.</td></tr>
                  <tr><td>"Chef, can I make this for two instead of four?"</td><td>Works out the quantities for two.</td></tr>
                </tbody>
              </table>
            </div>

            <div class="shot">
              <figure>
                <img src="/assets/app/ask-polly-560.webp" width="560" height="1127" loading="lazy" decoding="async"
                  alt="Ask Polly: a conversation with Glutt's AI chef about changing a recipe." />
                <figcaption>Ask Polly about any recipe, and the recipe changes.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/voice-cookmode-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="Glutt cook mode with the current step and voice help available." />
                <figcaption>Cook mode with Polly: big type, one step at a time.</figcaption>
              </figure>
            </div>

            <blockquote>
              <p>"Being able to cook hands free and ask questions verbally is a game changer."</p>
              <cite>darklightaisawa, App Store review of Glutt, July 29, 2026</cite>
            </blockquote>

            <h2>How Polly is different from ChatGPT, Siri or Alexa</h2>
            <p>
              General voice assistants are useful in a kitchen, and plenty of people cook with them. They
              were not built for it, though, and it shows.
            </p>
            <div class="table">
              <table>
                <thead>
                  <tr><th scope="col"></th><th scope="col">Polly in Glutt</th><th scope="col">General voice assistants</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Knows your recipe and step</th><td>Yes</td><td>Only what you tell them</td></tr>
                  <tr><th scope="row">Recipe stays on screen</th><td>Yes, in large type</td><td>Usually a chat transcript</td></tr>
                  <tr><th scope="row">Timers linked to steps</th><td>Yes</td><td>Separate, generic timers</td></tr>
                  <tr><th scope="row">Knows your pantry</th><td>Yes</td><td>No</td></tr>
                  <tr><th scope="row">Can see the pan</th><td>Yes, iPhone camera</td><td>Some can, with video mode</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              The recipe matters more than it sounds. When an AI improvises a dish from scratch, a mistake
              has nothing to be checked against. When it works from a recipe you chose and can see, you can
              catch it.
            </p>

            <h2>Beyond the stove: Skills and Cook Ranks</h2>
            <p>
              The same AI chef also teaches. Glutt's Skills tab is a map of 75 cooking techniques across
              9 regions. You practice one, photograph your work, and Chef scores it against what the check
              actually asks for. Verified checks build a Cook Rating and move you through nine Cook Ranks,
              from Prep Cook to Head Chef.
            </p>

            <h2>What Polly is not</h2>
            <ul>
              <li><strong>Not a food-safety authority.</strong> She can talk you through doneness cues, but a probe thermometer is the only reliable test for meat. The USDA's safe minimum is 165°F for poultry and 145°F for whole cuts of beef and pork with a 3-minute rest. <sup><a href="#src-h">1</a></sup></li>
              <li><strong>Not offline.</strong> Polly's voice runs live over the internet, so she needs a connection while you cook.</li>
              <li><strong>Not a replacement for tasting.</strong> She can't taste your food. You still get the final say on salt.</li>
            </ul>
          `,
  faq: [
    {
      q: 'What is the best AI chef app?',
      a: 'It depends on what you want the AI to do. If you want an AI that talks you through a recipe hands-free while you cook, Glutt, with its live voice AI chef Polly, was built for exactly that. If you mainly want recipe ideas from ingredients, a generator such as SuperCook or ChefGPT may suit you better. Our <a href="/best-ai-cooking-apps">comparison of AI cooking apps</a> covers the trade-offs honestly.',
    },
    {
      q: 'How do I talk to Polly?',
      a: 'Start a recipe with Polly in Glutt and say "Chef" (or "Hey Chef"), then ask your question. You can also tap to talk.',
    },
    {
      q: 'Can Polly see what I am cooking?',
      a: 'Yes, through your iPhone camera, when you turn it on. The camera is off by default.',
    },
    {
      q: 'Does Polly work with AirPods or Meta glasses?',
      a: 'Yes. Polly works with AirPods and other Bluetooth headsets, and with Ray-Ban Meta and Oakley Meta glasses, whose microphones and speakers Glutt selects automatically when they are connected.',
    },
    {
      q: 'Is Polly free?',
      a: 'Glutt is free to download. Polly is part of Glutt Premium, which starts with a free trial. Current prices are shown in the App Store.',
    },
    {
      q: 'Is Polly related to Amazon Polly?',
      a: 'No. Polly is the name of the AI chef inside the Glutt app. She is unrelated to Amazon Polly, Amazon\'s text-to-speech service.',
    },
  ],
  faqSchema: true,
  sources: [
    {
      title: 'USDA FSIS: Safe Minimum Internal Temperature Chart',
      url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
    },
    { title: 'Glutt: Recipes & AI Chef on the App Store', url: 'https://apps.apple.com/us/app/glutt-recipes-ai-chef/id6780553556' },
  ],
  related: ['guides/cooking-with-meta-glasses', 'guides/hands-free-cooking', 'faq'],
  ctaTitle: 'Cook with <em>Polly tonight.</em>',
};
