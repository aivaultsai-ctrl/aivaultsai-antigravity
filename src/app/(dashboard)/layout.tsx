"use client";

import { useRequireAuth } from "@/lib/context/UserContext";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useRequireAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                {/* Pages must render their own Header if they want specific titles, 
            or we can context-lift it. For simplicity, we let pages layout themselves inside or add a default wrapper. 
            Actually, let's put the container here and let pages be just content.
         */}
                {children}
            </main>
        </div>
    );
}
