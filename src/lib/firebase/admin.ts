/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApps, getApp, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Safe parsing for build environments
let serviceAccount: ServiceAccount;
try {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}";
    // Handle cases where the env var might be wrapped in extra quotes
    const sanitizedKey = rawKey.trim().replace(/^['"]|['"]$/g, '');
    serviceAccount = JSON.parse(sanitizedKey);
    
    // Fix: Ensure private key newlines are correct
    if (serviceAccount && serviceAccount.privateKey) {
        serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
    }
} catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    serviceAccount = {} as ServiceAccount;
}

// Fallback for build time if keys are missing
if (!serviceAccount.projectId) {
    serviceAccount = {
        projectId: "mock-project",
        clientEmail: "mock@mock.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDb\n-----END PRIVATE KEY-----\n"
    } as any;
}

if (!getApps().length) {
    // Only attempt to initialize if we have real credentials and not the mock fallback
    const hasValidKey = serviceAccount.privateKey && 
                        serviceAccount.privateKey.includes("PRIVATE KEY") && 
                        serviceAccount.projectId !== "mock-project";

    if (hasValidKey) {
        try {
            initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (e) {
            console.warn("Admin init failed with provided credentials:", e);
        }
    }
}

// Functional mocks for build safety when admin is not initialized
const mockDb = {
    collection: () => ({
        doc: () => ({
            get: () => Promise.resolve({ exists: false, data: () => ({}) }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve()
        }),
        add: () => Promise.resolve({ id: 'mock-id' }),
        where: () => ({ get: () => Promise.resolve({ docs: [], empty: true }) })
    }),
    batch: () => ({
        set: () => { },
        commit: () => Promise.resolve()
    })
} as any;

const mockAuth = {
    verifyIdToken: () => Promise.resolve({ uid: 'mock-user' }),
    getUser: () => Promise.resolve({ uid: 'mock-user' })
} as any;

const adminDb = getApps().length ? getFirestore() : mockDb;
const adminAuth = getApps().length ? getAuth() : mockAuth;

export { adminDb, adminAuth };
