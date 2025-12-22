import Link from 'next/link';
import { ArrowRight, Check, Zap, Globe, Shield } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-[#0F172A] relative overflow-hidden text-white font-sans selection:bg-[#00e0ff] selection:text-black">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Enterprise AI, <br />
                        <span className="text-[#00e0ff]">Simplified.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The power of a full AI workforce, integrated directly into your operations.
                        Secure, scalable, and built for business.
                    </p>

                    <div className="relative group w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#00e0ff]/20 bg-black/50">
                        {/* Simple Placeholder for Promo Video - simulating embed */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-[#00e0ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-[#00e0ff]/50 cursor-pointer hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#00e0ff] border-b-[10px] border-b-transparent ml-1" />
                                </div>
                                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase">Watch the Platform Demo</p>
                            </div>
                        </div>
                        {/* Actual iframe would go here: <iframe ... /> */}
                    </div>
                </div>
            </section>

            {/* Features Cards */}
            <section className="py-24 px-6 bg-[#0B1120]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-[#00e0ff]" />}
                        title="Instant Deployment"
                        desc="Launch trained AI agents in minutes, not months. No complex coding required."
                    />
                    <FeatureCard
                        icon={<Globe className="w-8 h-8 text-[#00e0ff]" />}
                        title="Global Scale"
                        desc="Deploy on servers worldwide. Multilingual support out of the box."
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-[#00e0ff]" />}
                        title="Enterprise Security"
                        desc="SOC2 compliant infrastructure with dedicated data isolation for every client."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00e0ff]/5 to-transparent pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Ready to transform your workforce?</h2>
                    <Link href="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-[#00e0ff] text-black font-bold rounded-lg text-lg hover:bg-[#00e0ff]/90 hover:scale-105 transition-all shadow-[0_0_30px_-5px_#00e0ff80]">
                        Start Your Free Trial <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="mt-6 text-sm text-gray-500">No credit card required for 14-day trial.</p>
                </div>
            </section>
        </main>
    );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#00e0ff]/50 transition-all group hover:-translate-y-1">
            <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#00e0ff] transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}
