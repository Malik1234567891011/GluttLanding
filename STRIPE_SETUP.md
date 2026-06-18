# Stripe preorder setup

Glutt uses Stripe Checkout through the Vercel serverless function at `/api/create-checkout-session`.

## Stripe objects to create

Create one product for Glutt early access, then create two one-time prices in USD:

- Yearly early bird preorder: `32.99 USD`
- First month early bird preorder: `8.00 USD`

Current live Stripe Price IDs:

- Yearly early bird preorder: `price_1TjXe5L6unL9FTMGTQbYYOod`
- First month early bird preorder: `price_1TjXfnL6unL9FTMGKiHWoea7`

The public site explains that future launch prices are expected to increase to `38 USD/year` and `14 USD/month`.

## Vercel environment variables

Add these to the Vercel project for Production:

- `STRIPE_SECRET_KEY`: your Stripe secret key
- `STRIPE_PRICE_YEARLY_PREORDER`: `price_1TjXe5L6unL9FTMGTQbYYOod`
- `STRIPE_PRICE_MONTHLY_PREORDER`: `price_1TjXfnL6unL9FTMGKiHWoea7`
- `SITE_URL`: `https://glutt.org`
- `STRIPE_AUTOMATIC_TAX`: `true` only if Stripe Tax is enabled and configured in your Stripe account

## Fulfillment

Stripe Checkout collects the customer email. After payment, manually send the TestFlight invite or access
instructions to the email from the Stripe payment/customer record.
