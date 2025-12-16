"use client";

import { Bell, Search } from "lucide-react";

export function DashboardHeader({ title }: { title: string }) {
    return (
        <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Search placeholder */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search..."
                        className="h-9 w-64 rounded-full bg-white/5 border border-white/10 px-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                </div>

                <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                </button>
            </div>
        </header>
    );
}
