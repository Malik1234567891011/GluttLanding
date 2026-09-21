export default {
  slug: 'guides/cooking-with-meta-glasses',
  order: 10,
  navLabel: 'Cooking with Meta glasses',
  crumb: 'Cooking with Meta glasses',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Ray-Ban Meta and Oakley Meta in the kitchen: what works today, and how to set up a hands-free AI chef.',
  title: 'Cooking with Meta Glasses: Hands-Free AI Chef for Ray-Ban Meta | Glutt',
  ogTitle: 'Cooking with Meta glasses: a hands-free AI chef in your ear',
  description:
    'How to cook hands-free with Ray-Ban Meta or Oakley Meta glasses: what Meta AI does, how to use Glutt\'s AI chef through the glasses, setup and limits.',
  eyebrow: 'Guide · Meta AI glasses',
  h1: 'Cooking with Meta glasses: <em>a hands-free AI chef in your ear.</em>',
  lede:
    'Ray-Ban Meta and Oakley Meta glasses are good at one thing every cook needs: they keep your hands free. Here is what they can do in the kitchen on their own, and how to turn them into a proper recipe coach with Glutt.',
  published: '2026-09-20',
  updated: '2026-09-20',
  image: '/assets/app/voice-cookmode-900.webp',
  imageAlt: 'Glutt cook mode showing the current recipe step with voice help from Polly.',
  mentionsApp: true,
  includeApp: true,
  about: [
    { '@type': 'Thing', name: 'Ray-Ban Meta smart glasses' },
    { '@type': 'Thing', name: 'Hands-free cooking' },
  ],
  answer:
    'Yes, you can cook with Meta glasses. Meta AI on Ray-Ban Meta and Oakley Meta glasses can answer cooking questions and set timers. For step-by-step help with a specific recipe, <a href="/ai-chef">Glutt\'s AI chef, Polly</a>, works through the glasses: when your glasses are connected to your iPhone, Glutt automatically uses their microphones and open-ear speakers, so you talk to Polly with the phone on the counter. Polly can see your pan through the iPhone camera; seeing through the glasses\' own camera is not available yet.',
  body: `
            <h2>What Meta glasses can do in the kitchen on their own</h2>
            <p>
              Meta sells its AI glasses partly as a cooking companion. Its own cooking page promises
              "real-time help planning your meal, shopping for ingredients and step-by-step cooking
              instructions," plus hands-free photos and video, and open-ear speakers so you can listen to
              a podcast "without missing the oven timer going off." <sup><a href="#src-h">1</a></sup>
            </p>
            <p>Out of the box, with the Meta AI app on your phone, the glasses give you:</p>
            <ul>
              <li><strong>Meta AI by voice.</strong> Say "Hey Meta" and ask for a substitution, a conversion or a recipe idea.</li>
              <li><strong>Live AI.</strong> Say "Hey Meta, start live AI" and the glasses' camera and microphone stay on, so Meta AI can answer about what you are looking at. Meta says live AI is available in English and rolling out in the US and Canada. <sup><a href="#src-h">2</a></sup></li>
              <li><strong>Open-ear audio.</strong> Speakers that sit near your ears, so you still hear the pan sizzle and the smoke alarm.</li>
              <li><strong>A point-of-view camera</strong> for photos and short videos of what you made.</li>
            </ul>
            <p>
              What they do not give you is your recipe. Meta AI answers from general knowledge. It does not
              know which recipe you saved last week, which step you are on, how many servings you are
              making, or what is in your fridge. For a quick question that is fine. For cooking a whole dish,
              that missing context is where things go wrong.
            </p>

            <h2>How to use Glutt's AI chef through your Meta glasses</h2>
            <p>
              <a href="/ai-chef">Polly is Glutt's live voice AI chef.</a> She works from the recipe you are
              actually cooking: she knows the ingredients, the step you are on and the timers that are
              running. When Meta glasses are connected to your iPhone, Glutt picks the glasses' microphones
              and speakers for Polly automatically. If AirPods are paired too, the glasses win. So Polly's
              voice comes out of the glasses, and she hears you through them, while your phone sits on the
              counter.
            </p>
            <h3>Setup, step by step</h3>
            <ol>
              <li><strong>Pair your glasses with your iPhone</strong> in the Meta AI app, the same way you set them up for music and calls.</li>
              <li><strong>Check the connection.</strong> In iPhone Settings, under Bluetooth, the glasses should show as Connected.</li>
              <li><strong>Save or open a recipe in Glutt.</strong> Anything works: one you <a href="/guides/save-recipes-from-tiktok-instagram">imported from TikTok or Instagram</a>, a website recipe or one from the Discover feed.</li>
              <li><strong>Start cooking with Polly.</strong> Glutt switches the audio to your glasses on its own. There is nothing to toggle.</li>
              <li><strong>Say "Chef," then ask.</strong> "Chef, what can I use instead of buttermilk?" "Chef, start a timer for the rice." "Chef, what's next?"</li>
              <li><strong>Prop the phone up</strong> facing the stove if you want Polly to look at the pan. She uses the iPhone camera for that.</li>
            </ol>
            <div class="note">
              <p>
                <strong>Two assistants, two wake words.</strong> "Hey Meta" talks to Meta AI. "Chef" talks to
                Polly in Glutt. They are separate, so use "Chef" for anything about the recipe in front of you.
              </p>
            </div>

            <div class="shot">
              <figure>
                <img src="/assets/app/voice-cookmode-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="Glutt cook mode showing the current step, with voice help from Polly available." />
                <figcaption>Cook mode: one step at a time, with Polly listening for "Chef."</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/cookmode-video-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="Glutt cook mode playing a short technique clip for the current step." />
                <figcaption>When a technique needs showing, cook mode plays a short clip.</figcaption>
              </figure>
            </div>

            <h2>Meta AI vs Glutt on Meta glasses</h2>
            <div class="table">
              <table>
                <thead>
                  <tr><th scope="col"></th><th scope="col">Meta AI (built in)</th><th scope="col">Glutt with Polly</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Wake word</th><td>"Hey Meta"</td><td>"Chef" or "Hey Chef"</td></tr>
                  <tr><th scope="row">Knows your recipe</th><td>No, general knowledge</td><td>Yes: ingredients, servings, current step</td></tr>
                  <tr><th scope="row">Step-by-step guidance</th><td>On request</td><td>Walks you through every step in order</td></tr>
                  <tr><th scope="row">Timers</th><td>Yes</td><td>Yes, tied to the step that needs them</td></tr>
                  <tr><th scope="row">Can see your food</th><td>Yes, with live AI (glasses camera)</td><td>Yes, through the iPhone camera</td></tr>
                  <tr><th scope="row">Knows your pantry</th><td>No</td><td>Yes, and flags missing ingredients</td></tr>
                  <tr><th scope="row">Saves recipes from TikTok and Instagram</th><td>No</td><td>Yes</td></tr>
                  <tr><th scope="row">Cost</th><td>Included with the glasses</td><td>Free download, with a free trial of Glutt Premium</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              They are not rivals. Many people will use both: Meta AI to snap a photo or play music, Polly to
              actually get dinner made.
            </p>

            <h2>Which Meta glasses work with Glutt?</h2>
            <p>
              Glutt uses the glasses the way your iPhone does for phone calls: as a Bluetooth headset with a
              microphone. It recognizes Ray-Ban Meta and Oakley Meta frames by name and prefers them for
              Polly's audio. That covers Ray-Ban Meta (Gen 1 and Gen 2), Oakley Meta HSTN and Oakley Meta
              Vanguard. Any other Bluetooth headset, including AirPods, works too. On Meta Ray-Ban Display,
              Glutt uses the audio only. It does not draw anything on the display.
            </p>

            <h2>What about Polly seeing through the glasses' camera?</h2>
            <p>
              That is the obvious next step, and we have prototyped it. It is not in the App Store version, for
              a reason outside our control: Meta's Wearables Device Access Toolkit, the only way a third-party
              app can use the glasses' camera, is still a developer preview. Meta's own FAQ says developers
              "cannot yet distribute them to end users." <sup><a href="#src-h">3</a></sup> We plan to bring
              it to Glutt once Meta opens publishing. Until then, Polly looks through your iPhone camera, which
              tends to have the better view of the pan anyway.
            </p>

            <h2>Tips for cooking with smart glasses</h2>
            <ul>
              <li><strong>Keep the phone within a few meters.</strong> Bluetooth audio drops if you walk to the other side of the house with the recipe still running.</li>
              <li><strong>Charge first.</strong> A long braise plus a live voice session is a lot of audio time for small frames. Top up the glasses before you start a big cook.</li>
              <li><strong>Mind the steam.</strong> Leaning over a boiling pot fogs lenses. Step back to read the phone if you need to.</li>
              <li><strong>Talk normally.</strong> The glasses' microphones are close to your mouth, so you don't need to raise your voice over the extractor fan.</li>
              <li><strong>Wipe your fingers before you tap the frames.</strong> The touchpad on the arm is the one thing you still touch. Voice is cleaner.</li>
            </ul>
          `,
  faq: [
    {
      q: 'Can you use Ray-Ban Meta glasses for cooking?',
      a: 'Yes. Out of the box, Meta AI on the glasses can answer cooking questions, set timers and, with live AI, talk about what the camera sees. For guidance through a specific recipe, you can run Glutt\'s AI chef Polly through the glasses\' speakers and microphones.',
    },
    {
      q: 'Is there a recipe app for Meta glasses?',
      a: 'Glutt is an iPhone recipe app whose AI chef, Polly, works through Ray-Ban Meta and Oakley Meta glasses. Glutt automatically uses the glasses\' microphones and open-ear speakers when they are connected, so you can talk to Polly hands-free while you cook.',
    },
    {
      q: 'Do I need Meta glasses to use Glutt?',
      a: 'No. Polly works through your iPhone\'s speaker and microphone, AirPods, or any Bluetooth headset. The glasses are just the most hands-free way to wear her.',
    },
    {
      q: 'Can Glutt see through my Meta glasses camera?',
      a: 'Not yet. Third-party access to the glasses\' camera goes through Meta\'s Wearables Device Access Toolkit, which is still a developer preview without public distribution. Polly can see your food through the iPhone camera today.',
    },
    {
      q: 'Does Glutt work with Meta Ray-Ban Display?',
      a: 'For audio, yes: Glutt treats the glasses as a Bluetooth headset. Glutt does not show anything on the Display\'s screen.',
    },
    {
      q: 'Is Glutt made by Meta?',
      a: 'No. Glutt is an independent app made by CielPM, Inc. It is not affiliated with or endorsed by Meta Platforms or EssilorLuxottica. Ray-Ban and Oakley are trademarks of their owners.',
    },
  ],
  faqSchema: true,
  sources: [
    { title: 'Meta: Cooking with AI glasses', url: 'https://www.meta.com/ai-glasses/cooking/' },
    { title: 'Meta AI Glasses Help: How to use live AI on AI glasses', url: 'https://www.meta.com/help/ai-glasses/894093646030348/' },
    { title: 'Meta for Developers: Wearables Device Access Toolkit FAQ', url: 'https://developers.meta.com/wearables/faq/' },
  ],
  related: ['ai-chef', 'guides/hands-free-cooking', 'best-ai-cooking-apps'],
  ctaTitle: 'Put a chef in <em>your glasses.</em>',
};
