import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, adminAuth } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    let event: Stripe.Event;

    // 1. Validate Signature
    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
            throw new Error('Missing Stripe environment variables');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    // 2. Handle Event
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
        }

        // Return 200 OK fast
        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook handler failed:', error);
        return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    // 3. Extract Data
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Customer';
    const amountTotal = session.amount_total; // e.g., 3999 for €39.99

    if (!customerEmail) {
        throw new Error('No email found in session');
    }

    // Determine Plan based on amount or metadata
    // Ideally use session.metadata.tier, but falling back to simple amount check if metadata missing
    let tier = 'starter';
    const priceCents = amountTotal || 0;

    if (priceCents >= 24900) tier = 'enterprise';
    else if (priceCents >= 7900) tier = 'professional';
    else tier = 'starter';

    // 4. Provision User in Firebase
    console.log(`Provisioning user ${customerEmail} for plan ${tier}`);

    let uid: string;
    let isNewUser = false;

    // A. Check if user exists in Auth
    try {
        const userRecord = await adminAuth.getUserByEmail(customerEmail);
        uid = userRecord.uid;
        console.log(`User existing: ${uid}`);
    } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
            // B. Create new user
            isNewUser = true;
            const newUser = await adminAuth.createUser({
                email: customerEmail,
                displayName: customerName,
                emailVerified: true // Trust Stripe verification
            });
            uid = newUser.uid;
            console.log(`User created: ${uid}`);
        } else {
            throw e;
        }
    }

    // C. Set Custom Claims (Role Based Access)
    await adminAuth.setCustomUserClaims(uid, {
        plan: tier,
        stripeCustomerId: session.customer
    });

    // D. Create/Update Firestore Document
    // Schema: users/{uid}
    const userDoc = {
        uid: uid,
        email: customerEmail,
        displayName: customerName,
        plan: tier,
        status: 'active',
        stripeCustomerId: session.customer as string,
        subscriptionId: session.subscription as string,
        updatedAt: new Date(),
        // Only set createdAt if new
        ...(isNewUser && { createdAt: new Date() })
    };

    await db.collection('users').doc(uid).set(userDoc, { merge: true });

    // 5. Send Welcome Email
    if (isNewUser) {
        await sendWelcomeEmail(customerEmail, customerName, tier);
    } else {
        // Optional: Send "Upgrade Confirmed" email could go here
    }
}

async function sendWelcomeEmail(email: string, name: string, tier: string) {
    try {
        await resend.emails.send({
            from: 'AIVaults <onboarding@aivaultsai.one>',
            to: email,
            subject: `Welcome to AIVaults ${tier.charAt(0).toUpperCase() + tier.slice(1)}! 🚀`,
            html: `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Welcome to your AI Workforce, ${name}!</h1>
                <p>Your <strong>${tier}</strong> plan has been successfully activated.</p>
                <p>We have automatically created your account.</p>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/signin" style="background-color: #00e0ff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Access Command Center
                </a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    If you didn't set a password yet, please use "Forgot Password" on the login screen to set one securely.
                </p>
            </div>
            `
        });
        console.log(`Welcome email sent to ${email}`);
    } catch (err) {
        console.error('Failed to send email:', err);
        // Non-fatal
    }
}
