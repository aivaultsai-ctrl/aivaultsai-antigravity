import Link from 'next/link';
import {
    ArrowRight,
    PlayCircle,
    Cpu,
    Zap,
    GraduationCap,
    LayoutDashboard,
    CheckCircle2,
    X,
    Check
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import SolutionsPricing from '@/components/landing/SolutionsPricing';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#00e0ff] selection:text-black overflow-hidden relative">
            <PublicHeader />

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container relative z-10 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00e0ff]/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
                        Your Autonomous <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e0ff] to-cyan-400">AI Workforce</span> Starts Here
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        Build, deploy, and manage AI employees that automate your business — from administration and sales to support and data operations.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/register" className="h-14 px-8 rounded-lg bg-[#00e0ff] text-black font-bold text-lg flex items-center gap-2 hover:bg-[#33e7ff] hover:shadow-[0_0_30px_#00e0ff50] transition-all transform hover:-translate-y-1">
                            Deploy Your First AI Agent <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/business" className="h-14 px-8 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium text-lg flex items-center gap-2 transition-all">
                            <PlayCircle className="w-5 h-5 text-[#00e0ff]" /> Watch How It Works
                        </Link>
                    </div>
                </div>

                {/* Hero Video Placeholder */}
                <div className="max-w-6xl mx-auto aspect-video bg-black/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative group cursor-pointer backdrop-blur-sm">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0F172A] via-transparent to-transparent">
                        <div className="flex flex-col items-center gap-4 transform group-hover:scale-105 transition-transform duration-500">
                            <div className="w-24 h-24 rounded-full bg-[#00e0ff]/20 flex items-center justify-center border border-[#00e0ff]/50 backdrop-blur-md">
                                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-[#00e0ff] border-b-[12px] border-b-transparent ml-1" />
                            </div>
                            <span className="text-sm font-medium tracking-widest uppercase text-[#00e0ff]">System Demo</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SOLUTIONS & PRICING --- */}
            <SolutionsPricing />

            {/* --- POSITIONING STATEMENT --- */}
            <section className="py-24 bg-[#0B1120] relative border-y border-white/5">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#00e0ff]/10 text-[#00e0ff] text-sm font-bold tracking-wide mb-6 border border-[#00e0ff]/20">
                        NOT ANOTHER CHATBOT
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">A fully autonomous AI operations platform.</h2>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        AIVaultsAI is not a simple chat interface. It is a <span className="text-white font-semibold">command center</span> for autonomous AI agents that work inside your business — continuously, reliably, and without supervision.
                    </p>
                    <p className="text-xl text-white font-medium mt-6">
                        You don’t talk to AI. You deploy AI to work for you.
                    </p>
                </div>
            </section>

            {/* --- CORE PILLARS --- */}
            <section className="py-32 container px-6 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<Cpu className="w-8 h-8 text-[#00e0ff]" />}
                        title="AI Employees"
                        desc="Deploy agents that handle administration, lead intake, support, and data processing. Independent and reliable."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-amber-500" />}
                        title="Business Automation"
                        desc="Turn repetitive processes into autonomous systems. CRM updates, task routing, API workflows."
                    />
                    <FeatureCard
                        icon={<GraduationCap className="w-8 h-8 text-purple-500" />}
                        title="AI Training"
                        desc="Learn to use AI in production. Step-by-step tutorials and real execution environments."
                    />
                    <FeatureCard
                        icon={<LayoutDashboard className="w-8 h-8 text-green-500" />}
                        title="Command Center"
                        desc="Control everything from one dashboard. Live system status, active tasks, and performance metrics."
                    />
                </div>
            </section>

            {/* --- COMPARISON TABLE --- */}
            <section className="py-24 bg-[#0B1120] border-y border-white/5">
                <div className="container px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why AIVaultsAI is different</h2>
                        <p className="text-gray-400">From hobbyist tools to enterprise systems.</p>
                    </div>

                    <div className="bg-[#0F172A] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-3 p-6 border-b border-white/5 bg-[#1E293B]/50 font-bold text-sm uppercase tracking-wider text-gray-400">
                            <div className="col-span-1">Feature</div>
                            <div className="col-span-1 text-center">Others</div>
                            <div className="col-span-1 text-center text-[#00e0ff]">AIVaultsAI</div>
                        </div>

                        <ComparisonRow feature="Interface" other="Chatbots" us="Autonomous Agents" />
                        <ComparisonRow feature="Capability" other="Single-purpose Tools" us="Full Business Systems" />
                        <ComparisonRow feature="Interaction" other="Manual Prompts" us="Self-operating Workflows" />
                        <ComparisonRow feature="Readiness" other="Experiments" us="Production-ready" />
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00e0ff]/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-5xl md:text-6xl font-bold mb-8">Build once. Automate forever.</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Deploy AI employees that work 24/7, scale with your business, and eliminate operational drag.
                    </p>

                    <div className="flex flex-col gap-4 items-center">
                        <Link href="/register" className="h-16 px-10 rounded-xl bg-[#00e0ff] text-black font-bold text-xl flex items-center gap-3 hover:bg-[#33e7ff] hover:scale-105 transition-all shadow-[0_0_40px_-5px_#00e0ff60]">
                            Deploy Your First AI Agent <ArrowRight className="w-6 h-6" />
                        </Link>
                        <Link href="/agents" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm mt-4">
                            Enter the Command Center <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/5 bg-[#0F172A] py-16">
                <div className="container px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
                    <div className="flex flex-col gap-2">
                        <span className="text-white font-bold text-lg">AIVaultsAI</span>
                        <p>A trading name of S. Meester Bestratingen</p>
                        <p>KvK: 93216653</p>
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                    <p>© 2025 AIVaultsAI. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#00e0ff]/30 transition-all group hover:-translate-y-1 h-full">
            <div className="w-14 h-14 rounded-xl bg-[#1E293B] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
        </div>
    )
}

function ComparisonRow({ feature, other, us }: any) {
    return (
        <div className="grid grid-cols-3 p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
            <div className="col-span-1 font-medium text-gray-300">{feature}</div>
            <div className="col-span-1 text-center text-gray-500 flex items-center justify-center gap-2">
                <X className="w-4 h-4 text-red-500/50" /> {other}
            </div>
            <div className="col-span-1 text-center font-bold text-white flex items-center justify-center gap-2 bg-[#00e0ff]/5 py-1 rounded">
                <Check className="w-4 h-4 text-[#00e0ff]" /> {us}
            </div>
        </div>
    )
}
