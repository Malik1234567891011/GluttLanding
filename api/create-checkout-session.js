const Stripe = require("stripe");

const dishField = {
  key: "dish",
  label: { type: "custom", custom: "What do you want to cook?" },
  type: "text",
  optional: false,
  text: { maximum_length: 200 },
};

const guestsField = {
  key: "guests",
  label: { type: "custom", custom: "How many people are you cooking for?" },
  type: "numeric",
  optional: false,
  numeric: { maximum_length: 3 },
};

const planConfig = {
  session: {
    priceEnv: "STRIPE_PRICE_COOK_SESSION",
    label: "Glutt in-home cooking session",
    mode: "payment",
    customFields: [dishField, guestsField],
  },
  monthly: {
    priceEnv: "STRIPE_PRICE_COOK_MONTHLY",
    label: "Glutt two cooking sessions per month",
    mode: "subscription",
    customFields: [guestsField],
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
    return sendJson(res, 500, { error: "Checkout is not configured yet." });
  }

  const body = getRequestBody(req);
  const plan = body.plan;
  const selectedPlan = planConfig[plan];

  if (!selectedPlan) {
    return sendJson(res, 400, { error: "Choose a valid booking option." });
  }

  const priceId = process.env[selectedPlan.priceEnv];

  if (!priceId) {
    return sendJson(res, 500, { error: "That booking option is not configured yet." });
  }

  const stripe = new Stripe(stripeSecretKey);
  const siteUrl = getSiteUrl(req);

  const metadata = {
    plan,
    product: selectedPlan.label,
    fulfillment: "in_home_cooking_session",
  };

  const params = {
    mode: selectedPlan.mode,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    automatic_tax: {
      enabled: process.env.STRIPE_AUTOMATIC_TAX === "true",
    },
    custom_fields: selectedPlan.customFields,
    metadata,
    custom_text: {
      submit: {
        message:
          "After checkout, we email you a calendar link so you can pick a time that works for you.",
      },
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  };

  if (selectedPlan.mode === "subscription") {
    params.subscription_data = { metadata };
  } else {
    params.customer_creation = "always";
    params.payment_intent_data = { metadata };
  }

  try {
    const session = await stripe.checkout.sessions.create(params);

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error", error);
    return sendJson(res, 500, { error: "Unable to start checkout. Please try again." });
  }
};
