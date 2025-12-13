"use client";

import { UserProvider } from "@/lib/context/UserContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <UserProvider>{children}</UserProvider>;
}
