# Stripe checkout setup

The site sells in-person cooking sessions through Stripe Checkout, using the Vercel serverless function at
`/api/create-checkout-session`.

## Stripe objects

Both prices live under the existing product `prod_UizdvCq5nxAVqj` (Glutt Early Access):

| Site button      | What it is                                     | Price       | Stripe price ID                     |
| ---------------- | ---------------------------------------------- | ----------- | ----------------------------------- |
| Book one session | One visit, one meal, ingredients + tools on us  | `100 USD` one-time | `price_1U34g8L6unL9FTMGdDYHxdTk`    |
| Join Glutt       | Membership: two visits a month, ingredients included | `149 USD` / month | _fill in — the new $149 monthly price_ |

A Stripe price's amount cannot be edited after it is created, so raising the membership from `75` to
`149 USD` means a **new price object with a new ID**. The old `75 USD` price
(`price_1U34mHL6unL9FTMGgQdFjLzQ`) is dead — archive it so nobody can check out on it, and put the new ID in
`STRIPE_PRICE_COOK_MONTHLY`. The page advertises `149`, so a stale ID here silently charges the wrong amount.

The one-time price uses Checkout `mode: "payment"`; the monthly price is recurring and uses
`mode: "subscription"`. The function picks the mode per plan, so a recurring price ID in the one-time slot (or
vice versa) will make Stripe reject the session.

## Vercel environment variables

Add these to the Vercel project for Production:

- `STRIPE_SECRET_KEY`: your Stripe secret key
- `STRIPE_PRICE_COOK_SESSION`: `price_1U34g8L6unL9FTMGdDYHxdTk`
- `STRIPE_PRICE_COOK_MONTHLY`: the new `149 USD` / month price ID
- `SITE_URL`: `https://glutt.org`
- `STRIPE_AUTOMATIC_TAX`: `true` only if Stripe Tax is enabled and configured in your Stripe account

## What Checkout collects

- Email and phone number
- For a one-time session: the dish they want to cook and how many people they are feeding
- For the monthly plan: how many people they usually cook for

The answers show up on the Checkout session in the Stripe dashboard under the payment, and the plan is also
stamped into metadata (`plan`, `product`, `fulfillment: in_home_cooking_session`).

## Fulfillment

After payment, email the customer a calendar link so they can pick a time. Nothing is automated — there is no
webhook and no database; Stripe's dashboard is the record of who paid for what.

## Promises the membership makes

The site commits to three things that nothing in the code enforces — they are all manual:

- **Two sessions a month.** Track visits yourself; Stripe only knows they paid.
- **Unused sessions roll over for one month.** Also on you to honour.
- **Pause or cancel anytime.** Customers email `hi@cielpm.ai`. Cancel or pause the subscription from the
  Stripe dashboard (Billing → Subscriptions) before their next billing date. If self-serve becomes worth it,
  enable the Stripe Customer Portal and link to it from the pricing footnote.

## Note on tax category

The product's tax category is currently `txcd_10000000` (General - Electronically Supplied Services), which
described the old app preorder. An in-person cooking service is not an electronically supplied service. This
only matters if `STRIPE_AUTOMATIC_TAX` is turned on.
