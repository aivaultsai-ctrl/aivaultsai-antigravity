import Link from 'next/link';
import { ArrowRight, Handshake, Globe, TrendingUp } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function PartnersPage() {
    return (
        <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#00e0ff] selection:text-black">
            <PublicHeader />

            <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e0ff]/10 text-[#00e0ff] text-xs font-bold tracking-wide uppercase mb-8 border border-[#00e0ff]/20">
                    For Investors & Agencies
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Powering the Next Generation of <span className="text-[#00e0ff]">AI Agencies</span>
                </h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Partner with AIVaultsAI to deploy autonomous workforces for your clients.
                    White-label solutions, enterprise support, and revenue sharing.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="mailto:partners@aivaultsai.one" className="h-14 px-8 rounded-lg bg-[#00e0ff] text-black font-bold text-lg flex items-center gap-2 hover:bg-[#33e7ff] transition-all">
                        Become a Partner <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <section className="py-24 bg-[#0B1120] border-y border-white/5">
                <div className="container px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                    <div className="text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center mb-6 text-[#00e0ff]">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Agency Whitelabel</h3>
                        <p className="text-gray-400">Deploy our AI Agents under your own brand. Manage all client instances from a single master dashboard.</p>
                    </div>

                    <div className="text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center mb-6 text-[#00e0ff]">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Revenue Share</h3>
                        <p className="text-gray-400">Earn up to 30% recurring commission on all referred enterprise licenses and custom deployments.</p>
                    </div>

                    <div className="text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center mb-6 text-[#00e0ff]">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Global Infrastructure</h3>
                        <p className="text-gray-400">We handle the servers, LLM orchestration, and security. You focus on client relationships and strategy.</p>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Invest in the Future of Work</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    We are building the operating system for the autonomous enterprise.
                    Interested in our vision and roadmap?
                </p>
                <Link href="mailto:invest@aivaultsai.one" className="text-[#00e0ff] font-bold hover:underline">
                    Request Investor Deck
                </Link>
            </section>

            <footer className="py-12 border-t border-white/10 bg-[#0F172A] relative z-10 text-center text-sm text-gray-500">
                <p>© 2025 AIVaultsAI. All rights reserved.</p>
            </footer>
        </main>
    );
}
