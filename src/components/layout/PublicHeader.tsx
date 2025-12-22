"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PublicHeader() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs">AI</span>
                    </div>
                    AIVaultsAI
                </Link>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/agents"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith("/agents") ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Agents
                        </Link>
                        <Link
                            href="/business"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === "/business" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Business
                        </Link>
                        <Link
                            href="/chatbots"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith("/chatbots") ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Workforce
                        </Link>
                        <Link
                            href="/about"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === "/about" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            About
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">Login</Link>
                        <Link href="/register" className="text-sm font-medium bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-white">Get Started</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
