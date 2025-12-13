"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Target,
    Settings,
    MessageSquare,
    LogOut,
    Sparkles,
    Terminal
} from "lucide-react";
import { useAuth } from "@/lib/context/UserContext";

const NAV_ITEMS = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Employees", href: "/employees", icon: Users },
    { label: "Chat Interface", href: "/chat", icon: MessageBubbleIcon },
    { label: "Lead Pipeline", href: "/leads", icon: Target },
    { label: "Operations", href: "/operations", icon: TerminalIcon },
    { label: "Settings", href: "/settings", icon: Settings },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TerminalIcon(props: any) {
    return <Terminal {...props} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MessageBubbleIcon(props: any) {
    return <MessageSquare {...props} />
}

export function Sidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();

    return (
        <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col h-full fixed top-0 left-0 z-40">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">AIVaults</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
