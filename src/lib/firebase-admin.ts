
import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Service Account setup from environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

let app: App;

if (!getApps().length) {
    if (serviceAccount) {
        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    } else {
        // Fallback for when no service account is present (e.g. dev/build time if strictly needed, or throw error)
        // For production, the service key is mandatory.
        // We initialize with default credentials (useful for GCP/Cloud Run) or empty options if just testing locally without admin.
        // But for lead capture, we need admin.
        app = initializeApp();
        console.warn("Firebase Admin initialized without explicitly provided service account key. Ensure GOOGLE_APPLICATION_CREDENTIALS is set if in production.");
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
    // If email is missing, we still save it as 'anonymous_visitor_{timestamp}' for stats
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
        // We do not re-throw because we don't want to break the user experience if logging fails
        return null;
    }
}
