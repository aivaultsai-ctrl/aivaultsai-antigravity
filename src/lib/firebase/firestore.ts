import { db } from "./config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export async function createUserDocument(user: User, additionalData?: any) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Idempotency check: Don't overwrite existing data
    if (!userSnap.exists()) {
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                createdAt: serverTimestamp(),
                role: "user",
                subscriptionTier: "free",
                onboardingCompleted: false,
                ...additionalData,
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
}
