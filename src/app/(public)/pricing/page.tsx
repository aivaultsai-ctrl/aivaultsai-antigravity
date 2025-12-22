import Link from 'next/link';
import { Check, ArrowRight, Zap, Shield, Cpu } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#00e0ff] selection:text-black">
            <PublicHeader />

            {/* Header */}
            <section className="pt-32 pb-20 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Build Once. Automate Forever.</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Transparent pricing for your autonomous workforce. Start with a single agent or deploy a full enterprise system.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24 px-6 container max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Starter */}
                    <PricingCard
                        name="Starter"
                        price="$49"
                        desc="Perfect for solo entrepreneurs and creators."
                        features={[
                            "1 Autonomous Agent",
                            "1,000 Action Credits/mo",
                            "Standard Support",
                            "Basic Analytics",
                            "Email & Calendar Integration"
                        ]}
                        cta="Start Trial"
                        href="/register?plan=starter"
                    />

                    {/* Business (Highlighted) */}
                    <div className="relative transform md:-translate-y-4">
                        <div className="absolute -inset-1 bg-gradient-to-b from-[#00e0ff] to-blue-600 rounded-2xl blur-sm opacity-50" />
                        <div className="relative bg-[#0F172A] border border-[#00e0ff]/50 rounded-xl p-8 h-full flex flex-col shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00e0ff] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_#00e0ff]">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-5xl font-bold text-white">$149</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8 border-b border-white/10 pb-8">
                                For growing teams ready to automate operations.
                            </p>
                            <ul className="space-y-4 mb-8 flex-1">
                                <FeatureItem text="3 Autonomous Agents" highlighted />
                                <FeatureItem text="10,000 Action Credits/mo" />
                                <FeatureItem text="Priority Support" />
                                <FeatureItem text="Advanced Workflows" />
                                <FeatureItem text="CRM & Slack Integration" />
                                <FeatureItem text="Team Roles & Permissions" />
                            </ul>
                            <Link href="/register?plan=growth" className="w-full py-4 rounded-lg bg-[#00e0ff] text-black font-bold text-center hover:bg-[#33e7ff] transition-all shadow-[0_0_20px_#00e0ff40]">
                                Deploy Growth System
                            </Link>
                        </div>
                    </div>

                    {/* Enterprise */}
                    <PricingCard
                        name="Enterprise"
                        price="Custom"
                        desc="Full-scale automation for organizations."
                        features={[
                            "Unlimited Agents",
                            "Unlimited Credits",
                            "Dedicated Account Manager",
                            "Custom LLM Fine-tuning",
                            "SSO & SOC2 Compliance",
                            "SLA Guarantees"
                        ]}
                        cta="Contact Sales"
                        href="/business"
                        secondary
                    />

                </div>
            </section>

            {/* Hybrid Model Section */}
            <section className="py-24 bg-[#0B1120] border-t border-white/5">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">The Hybrid Model: Service to Product</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00e0ff]/30 to-transparent" />

                        <Step
                            step="01"
                            title="Service"
                            desc="We build custom AI solutions for your specific business needs."
                            icon={<Cpu />}
                        />
                        <Step
                            step="02"
                            title="System"
                            desc="We convert solutions into reusable, autonomous workflows."
                            icon={<Zap />}
                        />
                        <Step
                            step="03"
                            title="Product"
                            desc="You scale with proprietary AI tools accessible via our platform."
                            icon={<Shield />}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-[#0F172A] relative z-10 text-center text-sm text-gray-500">
                <p>© 2025 AIVaultsAI. All rights reserved.</p>
            </footer>
        </main>
    );
}

function PricingCard({ name, price, desc, features, cta, href, secondary }: any) {
    return (
        <div className="bg-[#111827] border border-white/10 rounded-xl p-8 flex flex-col hover:border-[#00e0ff]/30 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold text-white">{price}</span>
                {price !== 'Custom' && <span className="text-gray-400">/mo</span>}
            </div>
            <p className="text-gray-400 text-sm mb-8 border-b border-white/10 pb-8">
                {desc}
            </p>
            <ul className="space-y-4 mb-8 flex-1">
                {features.map((f: string, i: number) => (
                    <FeatureItem key={i} text={f} />
                ))}
            </ul>
            <Link href={href} className={`w-full py-4 rounded-lg font-bold text-center border transition-all ${secondary ? 'border-white/20 bg-transparent text-white hover:bg-white/5' : 'border-[#00e0ff] text-[#00e0ff] hover:bg-[#00e0ff]/10'}`}>
                {cta}
            </Link>
        </div>
    )
}

function FeatureItem({ text, highlighted }: any) {
    return (
        <li className="flex items-start gap-3 text-sm text-gray-300">
            <Check className={`w-5 h-5 shrink-0 ${highlighted ? 'text-[#00e0ff]' : 'text-gray-500'}`} />
            {text}
        </li>
    )
}

function Step({ step, title, desc, icon }: any) {
    return (
        <div className="relative z-10 bg-[#0F172A] p-6 rounded-xl border border-white/5 mx-2">
            <div className="text-xs font-bold text-[#00e0ff] mb-2 uppercase tracking-widest">{step}</div>
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto mb-4 text-white">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    )
}
