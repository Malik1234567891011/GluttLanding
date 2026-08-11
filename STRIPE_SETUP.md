# Stripe checkout setup

The site sells in-person cooking sessions through Stripe Checkout, using the Vercel serverless function at
`/api/create-checkout-session`.

## Stripe objects

Both prices live under the existing product `prod_UizdvCq5nxAVqj` (Glutt Early Access):

| Site button      | What it is                                     | Price       | Stripe price ID                     |
| ---------------- | ---------------------------------------------- | ----------- | ----------------------------------- |
| Book a session   | One visit, one meal, ingredients + tools on us  | `100 USD` one-time | `price_1U34g8L6unL9FTMGdDYHxdTk`    |
| Start monthly    | Two visits every month, ingredients included    | `75 USD` / month   | `price_1U34mHL6unL9FTMGgQdFjLzQ`    |

The one-time price uses Checkout `mode: "payment"`; the monthly price is recurring and uses
`mode: "subscription"`. The function picks the mode per plan, so a recurring price ID in the one-time slot (or
vice versa) will make Stripe reject the session.

## Vercel environment variables

Add these to the Vercel project for Production:

- `STRIPE_SECRET_KEY`: your Stripe secret key
- `STRIPE_PRICE_COOK_SESSION`: `price_1U34g8L6unL9FTMGdDYHxdTk`
- `STRIPE_PRICE_COOK_MONTHLY`: `price_1U34mHL6unL9FTMGgQdFjLzQ`
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

## Cancelling a monthly plan

The site tells customers to email `hi@cielpm.ai` to cancel. Cancel the subscription from the Stripe dashboard
(Billing → Subscriptions) before their next billing date. If self-serve cancellation becomes worth it, enable
the Stripe Customer Portal and link to it.

## Note on tax category

The product's tax category is currently `txcd_10000000` (General - Electronically Supplied Services), which
described the old app preorder. An in-person cooking service is not an electronically supplied service. This
only matters if `STRIPE_AUTOMATIC_TAX` is turned on.
