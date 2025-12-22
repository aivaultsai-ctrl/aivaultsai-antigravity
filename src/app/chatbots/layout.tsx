import React from 'react';
import Link from 'next/link';
import { Bot, LayoutDashboard, CreditCard, PlayCircle } from 'lucide-react';

export default function ChatbotsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0F172A] text-[#E5E7EB] font-sans selection:bg-[#3B82F6] selection:text-white">
            {/* Navigation */}
            <nav className="border-b border-[#1F2937] bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/chatbots" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
                        <Bot className="w-6 h-6 text-[#3B82F6]" />
                        <span>AI Workforce</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3AF]">
                        <Link href="/chatbots/demo" className="hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" /> Demo
                        </Link>
                        <Link href="/chatbots/pricing" className="hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4" /> Pricing
                        </Link>
                        <Link href="/chatbots/dashboard" className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#3B82F6]/90 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#1F2937] bg-[#111827] mt-24 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[#9CA3AF] text-sm">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-[#3B82F6]" />
                        <span className="font-semibold text-white">AI Workforce</span>
                    </div>
                    <p>© {new Date().getFullYear()} AIVaults. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
