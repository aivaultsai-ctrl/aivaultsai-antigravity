import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { Resend } from "resend";

// Initialize Firebase Admin
if (!getApps().length) {
    // Basic check for minimal config to prevent hard crashes
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
    } else {
        // Fallback for build time or missing envs
        initializeApp();
        console.warn("Firebase Admin initialized without explicit credentials (env vars missing?)");
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia",
    typescript: true
});

const db = getFirestore();
const auth = getAuth();
const resend = new Resend(process.env.RESEND_API_KEY);

// Plan mapping (Product ID -> Internal Tier Name)
const PLAN_MAP: Record<string, string> = {
    "prod_TekGXFqEgJ6ERU": "starter",     // 1 AI agent
    "prod_TekJJBA0nItA6B": "professional", // 3 AI agents
    "prod_TekNthXi2XdhrN": "enterprise",   // Unlimited
};

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error("Webhook signature verify failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            await handleCheckoutCompleted(session);
        } catch (error) {
            console.error("Processing checkout finished failed:", error);
            // Return 200 to Stripe to avoid retries loops for logic errors (unless temporary)
            // But usually 500 triggers retry.
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email;
    const name = session.customer_details?.name || "Customer";

    if (!email) {
        console.error("No email in session");
        return;
    }

    // 1. Determine Plan
    // We need to fetch line items to see which Product ID was bought
    // because session object itself doesn't always show product ID at root level.
    // If you passed 'client_reference_id' or metadata, check that too.
    let tier = "starter"; // default fallback

    try {
        if (session.id) {
            const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['line_items']
            });
            const productId = expandedSession.line_items?.data[0]?.price?.product as string;

            if (productId && PLAN_MAP[productId]) {
                tier = PLAN_MAP[productId];
            } else {
                // Fallback by amount if product ID not found in map
                const amount = session.amount_total || 0;
                if (amount >= 24900) tier = "enterprise";
                else if (amount >= 7900) tier = "professional";
            }
        }
    } catch (e) {
        console.error("Failed to expand session for product ID", e);
    }

    console.log(`Processing Order for ${email}: Plan=${tier}`);

    // 2. Provision User
    let uid: string;
    let isNewUser = false;

    try {
        const user = await auth.getUserByEmail(email);
        uid = user.uid;
    } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
            isNewUser = true;
            const newUser = await auth.createUser({
                email: email,
                displayName: name,
                emailVerified: true,
            });
            uid = newUser.uid;
        } else {
            throw e;
        }
    }

    // 3. Set Claims & Firestore
    await auth.setCustomUserClaims(uid, { plan: tier, stripeCustomerId: session.customer });

    const updates = {
        uid: uid,
        email: email,
        displayName: name,
        plan: tier,
        stripeCustomerId: session.customer as string || '',
        subscriptionId: session.subscription as string || '',
        status: 'active',
        updatedAt: new Date(),
        ...(isNewUser && { createdAt: new Date() })
    };

    await db.collection("users").doc(uid).set(updates, { merge: true });

    // 4. Send Email
    if (isNewUser) {
        await resend.emails.send({
            from: 'AIVaults <onboarding@aivaultsai.one>',
            to: email,
            subject: `Welcome to AIVaults ${tier.toUpperCase()}`,
            html: `
                <h1>Welcome, ${name}!</h1>
                <p>Your ${tier} plan is active.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://aivaultsai.one'}/auth/signin">Login to Dashboard</a>
            `
        });
    }
}