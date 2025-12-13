import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_build", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2025-11-17.clover" as any,
    typescript: true,
});

export const PRICE_IDS = {
    PRO_MONTHLY: "price_1QPRO_MOCK", // Replace with real ID
    ENTERPRISE_MONTHLY: "price_1QENT_MOCK"
};
