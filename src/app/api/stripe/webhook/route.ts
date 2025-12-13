import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase/admin";
import Stripe from "stripe";

// Disable body parsing, we need raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            // Activate Pro Plan
            await adminDb.collection("users").doc(userId).update({
                "billing.tier": "pro",
                "billing.active": true,
                "billing.subscriptionId": session.subscription,
                "billing.renewalDate": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Approx
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}
