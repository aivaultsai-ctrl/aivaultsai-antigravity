"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ContactPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "General Inquiry";

    return (
        <main className="min-h-screen bg-[#0F172A] text-white p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto pt-20">
                <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                    Get Started with AIVaultsAI
                </h1>
                <p className="text-xl text-zinc-400 mb-8">
                    Interested in the <span className="text-[#00e0ff] font-semibold capitalize">{plan}</span> plan? Fill in your details and we'll have your AI workforce ready in no time.
                </p>

                <form className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-sm shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00e0ff] focus:ring-1 focus:ring-[#00e0ff] outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@company.com"
                                className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00e0ff] focus:ring-1 focus:ring-[#00e0ff] outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Company Name</label>
                        <input
                            type="text"
                            placeholder="Acme Corp"
                            className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00e0ff] focus:ring-1 focus:ring-[#00e0ff] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">What do you want to automate?</label>
                        <textarea
                            placeholder="I need help with sales outreach and customer support tickets..."
                            className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00e0ff] focus:ring-1 focus:ring-[#00e0ff] outline-none transition-all h-32 resize-none"
                        />
                    </div>

                    <button className="w-full py-4 rounded-xl bg-[#00e0ff] text-zinc-950 font-bold text-lg hover:bg-[#33e7ff] hover:shadow-[0_0_20px_#00e0ff40] transition-all transform hover:-translate-y-0.5">
                        Send Message 🚀
                    </button>

                    <p className="text-center text-zinc-500 text-sm mt-4">
                        We typically respond within 24 hours.
                    </p>
                </form>
            </div>
        </main>
    );
}
