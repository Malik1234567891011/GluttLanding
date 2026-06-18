const Stripe = require("stripe");

const planConfig = {
  yearly: {
    priceEnv: "STRIPE_PRICE_YEARLY_PREORDER",
    label: "Glutt yearly preorder",
  },
  monthly: {
    priceEnv: "STRIPE_PRICE_MONTHLY_PREORDER",
    label: "Glutt first month preorder",
  },
};

function getSiteUrl(req) {
  const configuredUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (configuredUrl) {
    return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`;
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function getRequestBody(req) {
  if (!req.body || typeof req.body !== "string") {
    return req.body || {};
  }

  try {
    return JSON.parse(req.body);
  } catch (_error) {
    return {};
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return sendJson(res, 500, { error: "Stripe is not configured yet." });
  }

  const body = getRequestBody(req);
  const plan = body.plan;
  const selectedPlan = planConfig[plan];

  if (!selectedPlan) {
    return sendJson(res, 400, { error: "Choose a valid preorder plan." });
  }

  const priceId = process.env[selectedPlan.priceEnv];

  if (!priceId) {
    return sendJson(res, 500, { error: "Selected preorder plan is not configured yet." });
  }

  const stripe = new Stripe(stripeSecretKey);
  const siteUrl = getSiteUrl(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_creation: "always",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: process.env.STRIPE_AUTOMATIC_TAX === "true",
      },
      metadata: {
        plan,
        product: selectedPlan.label,
        fulfillment: "manual_testflight_invite",
      },
      payment_intent_data: {
        metadata: {
          plan,
          product: selectedPlan.label,
          fulfillment: "manual_testflight_invite",
        },
      },
      custom_text: {
        submit: {
          message:
            "After checkout, Glutt will email your TestFlight invite or access instructions manually.",
        },
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error", error);
    return sendJson(res, 500, { error: "Unable to start checkout. Please try again." });
  }
};
