import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, Shield, Zap, Briefcase, Database, MessageSquare } from 'lucide-react';

export default function AIWorkforcePage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0F172A] text-white selection:bg-[#00e0ff] selection:text-black">

            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-[#0F172A]">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e0ff]/10 text-[#00e0ff] text-xs font-bold tracking-wide uppercase mb-8 border border-[#00e0ff]/20">
                        Enterprise Grade
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Deploy Your <span className="text-[#00e0ff]">AI Workforce</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Don't just chat. Delegate. <br />
                        Our AI employees handle complex workflows across sales, support, and operations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/agents" className="w-full sm:w-auto px-8 py-4 bg-[#00e0ff] hover:bg-[#33e7ff] text-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_#00e0ff40]">
                            Launch Command Center <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/business" className="w-full sm:w-auto px-8 py-4 bg-[#1F2937] hover:bg-[#374151] text-white border border-gray-700 rounded-lg font-medium transition-all flex items-center justify-center">
                            View Enterprise Plans
                        </Link>
                    </div>
                </div>
            </section>

            {/* Employee Types Grid */}
            <section className="px-6 py-20 bg-[#0B1120] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Available Roles</h2>
                        <p className="text-gray-400">Select the specialized agents you need for your team.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <RoleCard
                            icon={<Briefcase className="w-6 h-6 text-[#00e0ff]" />}
                            title="Business Assistant"
                            desc="Handles admin, scheduling, proposals, and generalized operational tasks."
                        />
                        <RoleCard
                            icon={<Zap className="w-6 h-6 text-amber-500" />}
                            title="Automation Agent"
                            desc="Connects your apps. Routes leads, updates CRM, and triggers workflows."
                        />
                        <RoleCard
                            icon={<MessageSquare className="w-6 h-6 text-green-500" />}
                            title="Content Creator"
                            desc="Drafts social posts, blogs, scripts, and marketing copy on demand."
                        />
                        <RoleCard
                            icon={<Bot className="w-6 h-6 text-pink-500" />}
                            title="Support Agent"
                            desc="24/7 customer service. Resolves tickets, answers FAQs, and escalates issues."
                        />
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="px-6 py-24 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for Production.</h2>
                        <div className="space-y-6">
                            <FeatureItem
                                title="Context Aware"
                                desc="Agents remember past interactions, company documents, and brand guidelines."
                            />
                            <FeatureItem
                                title="Human-in-the-Loop"
                                desc="Set approval gates. Agents propose actions, you approve them. Safe and controlled."
                            />
                            <FeatureItem
                                title="Secure by Default"
                                desc="Enterprise-grade encryption and data isolation. Your data trains ONLY your agents."
                            />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border border-white/10 p-2 shadow-2xl skew-y-1">
                        <div className="bg-[#0B1120] rounded-xl overflow-hidden border border-white/5">
                            <div className="h-8 bg-[#1E293B] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Using simple divs to simulate the dashboard UI */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/20 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-[#00e0ff]" />
                                    </div>
                                    <div className="bg-[#1E293B] p-3 rounded-lg rounded-tl-none border border-white/5 text-sm w-3/4">
                                        <p className="text-gray-300">I've analyzed the Q3 data. Revenue is up 12%. Should I generate the report?</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <div className="px-3 py-1.5 rounded bg-[#00e0ff] text-black text-xs font-bold">Approve</div>
                                    <div className="px-3 py-1.5 rounded bg-[#1E293B] text-gray-300 text-xs border border-white/10">Edit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

function RoleCard({ title, desc, icon }: any) {
    return (
        <div className="p-6 bg-[#111827] border border-white/5 rounded-xl hover:border-[#00e0ff]/30 transition-all hover:-translate-y-1 group">
            <div className="mb-4 p-3 bg-[#1E293B] rounded-lg inline-block group-hover:bg-[#00e0ff]/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function FeatureItem({ title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <CheckCircle2 className="w-6 h-6 text-[#00e0ff]" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
