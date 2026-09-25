export default {
  slug: 'guides/cook-with-what-you-have',
  order: 35,
  navLabel: 'Cook with what you already have',
  crumb: 'Cook with what you have',
  crumbs: [{ name: 'Guides', url: '/guides' }],
  cardText: 'Apps that turn the contents of your fridge into dinner, and how to make them work in a real kitchen.',
  title: 'What Can I Cook With What I Have? Apps and Tips (2026)',
  ogTitle: 'How to cook with what you already have',
  description:
    'How to find recipes from the ingredients already in your fridge: ingredient-matching apps, pantry-aware cooking apps, substitutions and habits that cut waste.',
  eyebrow: 'Guide · Pantry cooking',
  h1: 'Cook with what you <em>already have.</em>',
  lede:
    'The fridge is full and there is still "nothing to eat." Here is how to turn what you actually own into dinner, with or without an app, and which apps do it best.',
  published: '2026-09-24',
  updated: '2026-09-24',
  image: '/assets/app/kitchen-pantry-900.webp',
  imageAlt: 'The Glutt kitchen screen listing fridge and pantry items.',
  mentionsApp: true,
  answer:
    'Two kinds of app solve this. <strong>Ingredient-matching search</strong>, like SuperCook, takes a list of what you own and finds recipes that use it, free and fast. <strong>Pantry-aware cooking apps</strong>, like <a href="/">Glutt</a>, keep a picture of your kitchen so every recipe you look at already shows what you are missing and what you can swap it for. If you would rather not maintain a pantry list at all, photograph the open fridge and ask an AI assistant what to make.',
  body: `
            <h2>Why "what can I make?" is hard</h2>
            <p>
              The EPA says over one-third of the food produced in the United States is never eaten.
              <sup><a href="#src-h">1</a></sup> Most of that isn't carelessness, it is timing: the herbs wilt
              while you decide, the chicken gets pushed to Thursday, the half tin of coconut milk has no plan.
              Recipes are written for a shopping trip, not for what is in front of you tonight.
            </p>
            <p>The three problems any solution has to handle:</p>
            <ul>
              <li><strong>Telling it what you have</strong> without turning your evening into data entry.</li>
              <li><strong>"Enough" versus "some."</strong> Two eggs is not four eggs. Most tools ignore quantity.</li>
              <li><strong>Substitutions.</strong> Missing one thing shouldn't kill the recipe, and usually shouldn't.</li>
            </ul>

            <h2>The approaches, compared</h2>
            <div class="table">
              <table>
                <thead>
                  <tr><th scope="col">Approach</th><th scope="col">How it works</th><th scope="col">Good at</th><th scope="col">Weak at</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Ingredient search (SuperCook, Crumb)</th>
                    <td>Tick what you own; it searches recipes that use only those things.</td>
                    <td>Free, huge recipe pool, no commitment</td>
                    <td>You maintain the list; results are other people's recipes, not your saved ones</td>
                  </tr>
                  <tr>
                    <th scope="row">Pantry-aware cooking apps (Glutt, Cooklist)</th>
                    <td>The app keeps your fridge and pantry, then marks every recipe with what's missing.</td>
                    <td>Works on the recipes you already saved; flags gaps before you start</td>
                    <td>Needs the pantry kept roughly current</td>
                  </tr>
                  <tr>
                    <th scope="row">Grocery-account sync (Cooklist)</th>
                    <td>Pulls purchases from supermarket loyalty accounts.</td>
                    <td>Almost no manual entry</td>
                    <td>Only works with supported stores, and doesn't know what you've eaten</td>
                  </tr>
                  <tr>
                    <th scope="row">Generators (ChefGPT, ChatGPT)</th>
                    <td>You list ingredients, the AI invents a recipe.</td>
                    <td>Endlessly flexible, no setup</td>
                    <td>Invented recipes are unproven; quantities can be off</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>How Glutt does it</h2>
            <p>
              Glutt keeps a model of your actual kitchen, and uses it everywhere else in the app:
            </p>
            <ul>
              <li><strong>Add things the fast way.</strong> By voice, by camera, or by typing. Scan the shelf rather than typing twenty items.</li>
              <li><strong>Every recipe shows the gap.</strong> Open a recipe and you see what you're missing before you commit to cooking it.</li>
              <li><strong>Substitutes on the spot.</strong> Missing buttermilk, out of shallots: ask <a href="/ai-chef">Polly, the AI chef</a>, mid-cook and she offers a swap.</li>
              <li><strong>Only the gap goes to the grocery list</strong>, not the whole ingredient list.</li>
              <li><strong>Leftovers count too.</strong> Cooked portions are tracked so they get eaten instead of found later.</li>
            </ul>

            <div class="shot">
              <figure>
                <img src="/assets/app/kitchen-pantry-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="The Glutt kitchen screen listing fridge and pantry items with use-soon badges." />
                <figcaption>Your kitchen, as the app sees it.</figcaption>
              </figure>
              <figure>
                <img src="/assets/app/grocery-list-560.webp" width="560" height="1214" loading="lazy" decoding="async"
                  alt="A Glutt grocery list containing only the missing ingredients." />
                <figcaption>The list is only what you're missing.</figcaption>
              </figure>
            </div>

            <h2>Habits that work, with or without an app</h2>
            <ol>
              <li><strong>Shop your fridge first.</strong> Decide dinner from the two things that will spoil soonest, then fill in around them.</li>
              <li><strong>Keep a staples shelf you never count.</strong> Oil, rice, pasta, tinned tomatoes, stock, onions, eggs. If those are always there, "what can I make" becomes a much smaller question.</li>
              <li><strong>Learn five formulas, not fifty recipes.</strong> Fried rice, frittata, soup, traybake, pasta with whatever. Each absorbs almost any leftover.</li>
              <li><strong>Update the pantry once a week</strong>, after shopping. Two minutes then saves the guessing later.</li>
              <li><strong>Freeze in portions</strong> before food turns, not after you've decided you won't eat it.</li>
            </ol>
          `,
  faq: [
    {
      q: 'What app tells you what to cook with the ingredients you have?',
      a: 'SuperCook is the best-known free one: tick what you own and it finds matching recipes. Glutt approaches it from the other side, keeping your fridge and pantry so every recipe you have saved already shows what you are missing and what you can substitute.',
    },
    {
      q: 'Is there a free app for cooking with what is in your fridge?',
      a: 'Yes. SuperCook is free on the web, iPhone and Android. General assistants like ChatGPT are also free for this: photograph the open fridge and ask what you can make.',
    },
    {
      q: 'Can an app read my fridge from a photo?',
      a: 'Glutt can add pantry items from a camera photo, and general AI assistants can suggest dishes from a picture of your shelves. Expect to correct a few items either way: packaging hides what is inside, and no app knows how much is left in the jar.',
    },
    {
      q: 'What can I make with what I have right now?',
      a: 'Start with whatever spoils first and pick a format that absorbs it: fried rice, a frittata, soup, a traybake or pasta. Then ask an app, or Polly in Glutt, to adapt a recipe to the quantities you actually have.',
    },
  ],
  faqSchema: true,
  sources: [
    {
      title: 'EPA: From Farm to Kitchen, The Environmental Impacts of U.S. Food Waste',
      url: 'https://www.epa.gov/land-research/farm-kitchen-environmental-impacts-us-food-waste',
    },
  ],
  related: ['ai-chef', 'guides/save-recipes-from-tiktok-instagram', 'best-ai-cooking-apps'],
  ctaTitle: 'Cook what is <em>already in the fridge.</em>',
};
