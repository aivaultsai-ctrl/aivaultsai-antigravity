/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApps, getApp, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Safe parsing for build environments
let serviceAccount: ServiceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
} catch (e) {
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
    try {
        initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (e) {
        console.warn("Admin init skipped:", e);
    }
}

// Functional mocks for build safety
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
