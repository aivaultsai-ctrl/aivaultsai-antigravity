"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter, usePathname } from "next/navigation";

interface UserContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // Optional: Set a cookie here for middleware if strictly needed
            // For now, we rely on client-side protection for the initial implementation
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
        router.push("/");
    };

    return (
        <UserContext.Provider value={{ user, loading, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook for accessing user data
export function useAuth() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
}

// Hook for protecting routes
export function useRequireAuth(redirectUrl = "/login") {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push(`${redirectUrl}?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [user, loading, router, redirectUrl, pathname]);

    return { user, loading };
}
