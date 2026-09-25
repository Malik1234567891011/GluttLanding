export default {
  slug: 'guides/learn-to-cook-with-ai',
  order: 55,
  navLabel: 'Learn to cook with an AI coach',
  crumb: 'Learn to cook with AI',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: '75 techniques, checked from a photo of your own work, with nine kitchen ranks to climb.',
  title: 'Learn to Cook With AI: Techniques, Practice and Real Feedback',
  ogTitle: 'Learning to cook with an AI coach that checks your work',
  description:
    'How to actually get better at cooking with an AI coach: which techniques to learn first, how photo-checked practice works, and where AI feedback helps and where it does not.',
  eyebrow: 'Guide · Learning to cook',
  h1: 'Learn to cook with <em>a coach that checks your work.</em>',
  lede:
    'Watching videos teaches you what a technique looks like, not whether you did it right. Here is how to actually build cooking skill, and how an AI coach can tell you when your knife cuts are uneven.',
  published: '2026-09-25',
  updated: '2026-09-25',
  image: '/assets/app/skills-lesson-900.webp',
  imageAlt: 'A knife skills lesson in Glutt.',
  mentionsApp: true,
  answer:
    'The fastest way to improve is deliberate practice with feedback: pick one technique, do it on purpose, and have someone check the result. Glutt\'s Skills map turns that into 75 techniques across 9 areas. You practice one, photograph what you made, and the AI chef checks it against what that skill actually asks for. Verified checks build a Cook Rating and move you up nine kitchen ranks, from Prep Cook to Head Chef.',
  body: `
            <h2>Why cooking videos don't make you a better cook</h2>
            <p>
              You can watch someone julienne a carrot twenty times and still produce uneven sticks, because
              nothing in that loop tells you what <em>your</em> carrot looks like. Skill comes from the
              opposite order: attempt, look at the result, correct, repeat. The missing piece at home is the
              person who looks at the result and tells you the truth.
            </p>
            <p>That is the one job an AI can genuinely do here, and it is worth being precise about the limits:</p>
            <ul>
              <li><strong>It can see</strong> whether your dice is even, whether the sear is deep or grey, whether the sauce broke, whether the dough is under-kneaded.</li>
              <li><strong>It cannot taste.</strong> Seasoning is still yours.</li>
              <li><strong>It cannot feel</strong> the dough's spring or the meat's give. It can tell you what to feel for.</li>
            </ul>

            <h2>The techniques worth learning first</h2>
            <p>
              Glutt's Skills map is organised into nine areas, and the order is deliberate: the first three
              carry almost every weeknight dinner.
            </p>
            <div class="table">
              <table>
                <thead><tr><th scope="col">Area</th><th scope="col">What it covers</th><th scope="col">Why it pays off</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Knife</th><td>Grip, claw, dice, julienne, chiffonade, breaking down a chicken</td><td>Faster prep, even cooking, fewer cut fingers</td></tr>
                  <tr><th scope="row">Heat</th><td>Searing, sautéing, roasting, frying temperatures, resting</td><td>The single biggest difference between home and restaurant food</td></tr>
                  <tr><th scope="row">Basics</th><td>Seasoning, boiling, blanching, mise en place, tasting as you go</td><td>Everything else assumes them</td></tr>
                  <tr><th scope="row">Eggs</th><td>Omelettes, poaching, custards, emulsions</td><td>Cheap to practise, instantly visible when it works</td></tr>
                  <tr><th scope="row">Sauces</th><td>Pan sauces, reductions, vinaigrettes, pestos</td><td>Turns plain protein and vegetables into a meal</td></tr>
                  <tr><th scope="row">Mother Sauces</th><td>Béchamel, velouté, espagnole, hollandaise, tomato</td><td>Learn five and hundreds of dishes open up</td></tr>
                  <tr><th scope="row">Meat</th><td>Doneness, resting, braising, roasting by cut</td><td>The most expensive thing to get wrong</td></tr>
                  <tr><th scope="row">Flavor</th><td>Balancing salt, fat, acid, heat; building layers</td><td>Why your food tastes flat when the recipe was followed exactly</td></tr>
                  <tr><th scope="row">Intuition</th><td>Cooking without a recipe, substituting, judging by sight and sound</td><td>The end goal: not needing the app</td></tr>
                </tbody>
              </table>
            </div>

            <h2>How photo-checked practice works in Glutt</h2>
            <ol>
              <li><strong>Pick a skill</strong> from the map, such as an even dice or a proper sear.</li>
              <li><strong>Read the check.</strong> Each skill states what a pass looks like, written in advance, not invented after the fact.</li>
              <li><strong>Cook it, then photograph your work.</strong></li>
              <li><strong>Chef scores it</strong> against those written criteria and tells you what to fix.</li>
              <li><strong>Verified checks build your Cook Rating</strong> and move you through nine ranks, Prep Cook to Head Chef.</li>
            </ol>
            <p>
              The ranks exist because "get better at cooking" is not a goal you can act on, and "pass the
              even-dice check" is. You can also ask <a href="/ai-chef">Polly</a> about a skill while you are
              in the middle of it.
            </p>

            <div class="shot">
              <figure>
                <img src="/assets/app/skills-lesson-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="A knife skills lesson in Glutt, with the check the photo will be scored against." />
                <figcaption>Each skill says what a pass looks like before you try it.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/streak-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="The Skills screen in Glutt showing a cooking streak." />
                <figcaption>Verified checks build the rating; streaks are just encouragement.</figcaption>
              </figure>
            </div>

            <div class="note">
              <p>
                <strong>On smart glasses:</strong> checking a technique through Ray-Ban Meta glasses while
                your hands are busy is the obvious next step, and Meta's toolkit for third-party camera
                access is still a developer preview. Today the check is a photo from your iPhone, and the
                glasses carry the conversation. See
                <a href="/guides/cooking-with-meta-glasses">cooking with Meta glasses</a>.
              </p>
            </div>

            <h2>A practice plan that works</h2>
            <ul>
              <li><strong>One technique a week,</strong> not one a night. Repetition beats variety here.</li>
              <li><strong>Practise on cheap ingredients.</strong> Onions, eggs, chicken thighs. Save the expensive cut for after the technique works.</li>
              <li><strong>Cook the same dish three times.</strong> The third one is where you learn, because you are no longer reading.</li>
              <li><strong>Fix one variable at a time.</strong> Hotter pan, or drier surface, or more oil. Not all three.</li>
              <li><strong>Keep the evidence.</strong> A photo of attempt one next to attempt five is more motivating than any streak counter.</li>
            </ul>
          `,
  faq: [
    {
      q: 'Can an AI teach you to cook?',
      a: 'It can teach the parts that are visible and checkable: knife cuts, sear colour, whether a sauce has split, whether bread is proofed. It cannot taste your food or feel the dough, so seasoning and texture judgement stay with you. In Glutt the AI chef checks a photo of your work against criteria written for that skill.',
    },
    {
      q: 'What is the best app to learn cooking techniques?',
      a: 'For technique with feedback, Glutt\'s Skills map covers 75 techniques across 9 areas and scores a photo of your attempt. For long-form instruction from named chefs, MasterClass is the better-known option. For free, YouTube plus deliberate repetition still works, you just have to be your own judge.',
    },
    {
      q: 'What are Cook Ranks?',
      a: 'Nine kitchen ranks in Glutt, from Prep Cook to Head Chef. You move up on verified skill checks, not on time spent in the app.',
    },
    {
      q: 'Does Glutt check my cooking through smart glasses?',
      a: 'Not in the App Store version. Skill checks use a photo taken with your iPhone. Meta\'s toolkit that would let an app use the glasses camera is still a developer preview.',
    },
    {
      q: 'Which cooking skill should I learn first?',
      a: 'Knife work and heat control. Even cuts make everything cook evenly, and understanding how hot a pan should be fixes most of what goes wrong at home.',
    },
  ],
  faqSchema: true,
  related: ['ai-chef', 'guides/cooking-with-meta-glasses', 'guides/cook-with-what-you-have'],
  ctaTitle: 'Get better, <em>one technique at a time.</em>',
};
