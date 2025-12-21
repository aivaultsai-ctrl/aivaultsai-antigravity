/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern to avoid re-initialization
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";
const app = (!getApps().length && hasValidConfig) ? initializeApp(firebaseConfig) : (getApps().length ? getApp() : null);

let auth: any;
let db: any;
let storage: any;
let functions: any;

if (typeof window !== "undefined" && app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app);
} else {
    // Mock clients for Server-Side build / mock env / missing config
    auth = { currentUser: null, onAuthStateChanged: () => () => { } };
    db = { collection: () => ({}) };
    storage = {};
    functions = {};
}

export { app, auth, db, storage, functions };
