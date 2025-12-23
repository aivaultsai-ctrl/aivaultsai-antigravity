
import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Service Account setup from environment variables
// SAFELY parse the JSON to prevent app crash if env var is malformed
let serviceAccount;
try {
    serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : undefined;
} catch (error) {
    console.warn("⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Admin SDK may fail.");
}

let app: App;

if (!getApps().length) {
    if (serviceAccount) {
        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    } else {
        // Fallback: This allows the app to start even if credentials are broken (logs error at runtime instead of crash)
        app = initializeApp();
    }
} else {
    app = getApps()[0];
}

export const adminAuth = getAuth(app);
export const db = getFirestore(app);

// --- LEAD CAPTURE HELPERS ---

export async function saveAdviceLead(data: {
    email?: string;
    businessDescription: string;
    advice: string;
}) {
    const leadData = {
        ...data,
        email: data.email || `anon_${Date.now()}@domain.com`,
        timestamp: new Date(),
        status: 'new',
        source: 'landing_page'
    };

    try {
        const leadRef = db.collection('advice_leads').doc();
        await leadRef.set(leadData);
        return leadRef.id;
    } catch (error) {
        console.error("Error saving lead to Firestore:", error);
        return null;
    }
}
