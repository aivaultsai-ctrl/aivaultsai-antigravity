import { NextResponse } from "next/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const { idToken, priceId } = await req.json();

        // Verify user
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        const email = decodedToken.email;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId || PRICE_IDS.PRO_MONTHLY,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout_success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?checkout_canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Error:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
