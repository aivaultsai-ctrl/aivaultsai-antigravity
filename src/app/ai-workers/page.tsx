"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import {
    Bot,
    Headphones,
    PenTool,
    Calendar,
    FileText,
    Zap,
    TrendingUp,
    Clock,
    Check,
    X,
    ArrowRight
} from "lucide-react";

const WORKERS = [
    {
        title: "Sales Closer AI",
        tagline: "Your unstoppable 24/7 sales machine.",
        icon: TrendingUp,
        features: ["Follow-ups & objections", "Lead qualification", "Outreach automation", "Books meetings automatically"],
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        title: "Customer Support AI",
        tagline: "Instant support. Zero wait times.",
        icon: Headphones,
        features: ["Ticket handling", "Escalation logic", "Multichannel support", "Learns tone & policies"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Marketing Content AI",
        tagline: "24/7 creative content engine.",
        icon: PenTool,
        features: ["Ads, captions, blogs", "Email campaigns", "Content remixing", "A/B testing"],
        gradient: "from-orange-400 to-red-500"
    },
    {
        title: "Appointment Setter AI",
        tagline: "Books meetings while you sleep.",
        icon: Calendar,
        features: ["Lead pre-qualification", "Calendar syncing", "Multi-channel replies", "Auto no-show follow-ups"],
        gradient: "from-teal-400 to-emerald-500"
    },
    {
        title: "Back-Office Automation AI",
        tagline: "Eliminate repetitive admin tasks.",
        icon: FileText,
        features: ["Document processing", "Reporting & invoicing", "CRM/ERP updates", "Email triage"],
        gradient: "from-cyan-400 to-blue-500"
    }
];

const COMPARISON = [
    { feature: "Availability", human: "8 hours / day", ai: "24/7/365", winner: "ai" },
    { feature: "Cost (Monthly)", human: "$3,000 - $8,000", ai: "$99 - $499", winner: "ai" },
    { feature: "Scalability", human: "Slow (Hiring/Training)", ai: "Instant", winner: "ai" },
    { feature: "Multitasking", human: "Limited", ai: "Unlimited", winner: "ai" },
    { feature: "Learning Curve", human: "Weeks/Months", ai: "Instant Knowledge", winner: "ai" },
];

const PRICING = [
    {
        tier: "Starter",
        price: "$99",
        users: "1 AI Employee",
        features: ["Basic Knowledge Base", "Email Support", "Standard Response Time"]
    },
    {
        tier: "Pro",
        price: "$299",
        popular: true,
        users: "3 AI Employees",
        features: ["Advanced Logic", "CRM Integration", "Priority Support", "Custom Workflows"]
    },
    {
        tier: "Enterprise",
        price: "Custom",
        users: "Unlimited AI Employees",
        features: ["Dedicated Account Manager", "Custom LLM Training", "SLA Guarantees", "Full API Access"]
    }
];

export default function AIWorkersPage() {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02] -z-20" />

            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

            <PublicHeader />

            {/* HERO SECTION */}
            <section className="pt-32 pb-20 container text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-6 backdrop-blur-sm">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Next-Gen Workforce</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Meet Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                        Autonomous AI Workforce
                    </span>
                </h1>

                <p className="max-w-3xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed">
                    5 specialized AI employees that automate sales, support, marketing, scheduling, and back-office operations — 24/7.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="h-14 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transform hover:scale-105"
                    >
                        Get a Free AI Demo <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                        href="#workers-grid"
                        className="h-14 px-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center gap-2 transition-all backdrop-blur-sm"
                    >
                        Meet the AI Workers
                    </a>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">24/7 Operation</h3>
                        <p className="text-muted-foreground">Your business never sleeps, neither should your team.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">90% Cost Reduction</h3>
                        <p className="text-muted-foreground">Enterprise-grade output for a fraction of the payroll cost.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Instant Deployment</h3>
                        <p className="text-muted-foreground">Spin up a full department in minutes, not months.</p>
                    </div>
                </div>
            </section>

            {/* WORKERS GRID */}
            <section id="workers-grid" className="py-24 container">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {WORKERS.map((worker, i) => (
                        <div key={i} className="group relative rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)] transition-all duration-300">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative h-full flex flex-col p-6 rounded-3xl bg-[#0B0F19] overflow-hidden">
                                {/* Gradient Header */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${worker.gradient} opacity-20 blur-2xl rounded-full -mr-10 -mt-10 group-hover:opacity-30 transition-opacity`} />

                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <worker.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{worker.title}</h3>
                                    <p className="text-indigo-200/80 text-sm font-medium">{worker.tagline}</p>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {worker.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                                            <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* COMPARISON TABLE */}
            <section className="py-20 bg-black/20">
                <div className="container max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Human vs. AI Employee</h2>
                        <p className="text-muted-foreground">Why 10,000+ businesses are switching to autonomous workforces.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
                        <div className="grid grid-cols-3 p-4 border-b border-white/10 bg-white/5 font-semibold text-white">
                            <div className="text-muted-foreground">Comparison</div>
                            <div className="text-center">Human Employee</div>
                            <div className="text-center px-4 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit mx-auto">AI Employee</div>
                        </div>
                        {COMPARISON.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
                                <div className="font-medium text-white">{row.feature}</div>
                                <div className="text-center text-muted-foreground">{row.human}</div>
                                <div className="text-center font-semibold text-indigo-400 flex items-center justify-center gap-2">
                                    {row.winner === 'ai' && <Check className="w-4 h-4" />}
                                    {row.ai}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING PREVIEW */}
            <section className="py-24 container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground">Start small and scale your autonomous workforce as you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {PRICING.map((plan, i) => (
                        <div key={i} className={`relative p-8 rounded-3xl border flex flex-col ${plan.popular ? 'bg-indigo-950/20 border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/10'}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-white mb-2">{plan.tier}</h3>
                            <div className="text-3xl font-bold text-white mb-6">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-indigo-300 mb-6 font-medium">{plan.users}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white text-black hover:bg-gray-200'}`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full" />

                <div className="container relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Deploy Your AI Workforce?</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join the revolution. Automate your business today and experience the power of autonomous scaling.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="h-14 px-10 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                        >
                            Deploy AI Workforce
                        </Link>
                        <Link
                            href="/contact"
                            className="h-14 px-10 rounded-full bg-black/40 border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-black/60 transition-colors backdrop-blur-md"
                        >
                            Talk to an AI Specialist
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
