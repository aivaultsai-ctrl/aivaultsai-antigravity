import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { CheckCircle2, Bot, Workflow, GraduationCap, ArrowRight, Layers } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-24 container px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
                        Unlock the Power of AI <br />
                        <span className="text-primary">for Your Business</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                        Artificial Intelligence is no longer a luxury. It is a practical tool that can save time, reduce costs, and create real competitive advantage.
                    </p>
                    <div className="inline-block p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="px-6 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            At AIVaultsAI, we help businesses move from curiosity to results.
                        </span>
                    </div>
                </div>
            </section>

            {/* What We Do Grid */}
            <section className="py-20 bg-black/20">
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            AIVaultsAI is a hybrid AI platform — combining hands-on services with scalable digital products.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Bot className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">1. AI Assistants for Businesses</h3>
                            <p className="text-muted-foreground mb-6">
                                We design and deploy AI assistants that work for your company 24/7. Not generic chatbots — trained for your business.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> AI customer service assistants</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> AI admin & intake bots</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Workflow-tailored tools</li>
                            </ul>
                        </div>

                        {/* Card 2 */}
                        <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 hover:border-green-500/50 transition-all group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Workflow className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">2. Business Automation</h3>
                            <p className="text-muted-foreground mb-6">
                                We help companies automate time-consuming processes. Fewer manual tasks, fewer errors, and more focus on growth.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Customer communication</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Administrative workflows</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Internal knowledge management</li>
                            </ul>
                        </div>

                        {/* Card 3 */}
                        <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 hover:border-purple-500/50 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">3. AI Training & Tutorials</h3>
                            <p className="text-muted-foreground mb-6">
                                AI only creates value when people know how to use it. Practical, clear, and jargon-free training.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Step-by-step video tutorials</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Learning paths for teams</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Real business application</li>
                            </ul>
                        </div>

                        {/* Card 4 */}
                        <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 hover:border-orange-500/50 transition-all group">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Layers className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">4. From Service to Scalable Products</h3>
                            <p className="text-muted-foreground mb-6">
                                Start with services. Scale with products. A hybrid model allowing companies to grow at their own pace.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Custom AI solutions first</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Reusable templates & systems</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Scalable products via platform</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 container px-6">
                <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#1F2937] to-[#111827] border border-white/5 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Why AIVaultsAI?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "Practical, result-driven AI",
                            "No technical background required",
                            "Built for small & medium businesses",
                            "Clear onboarding and support",
                            "Human guidance + smart automation"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-lg text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center p-6 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-lg text-white font-medium mb-2">We don’t promise magic.</p>
                        <p className="text-muted-foreground">We deliver working AI that saves time and creates value.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="container px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        The Future Is Automated. <br />
                        <span className="text-primary">Let’s Build It Together.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        AI is not about replacing people. It’s about freeing them from repetitive work and giving businesses room to grow.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25">
                            Start Today <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/chatbots" className="px-8 py-4 rounded-lg bg-secondary text-secondary-foreground font-medium text-lg hover:bg-secondary/80 border border-white/10 transition-all">
                            Explore Agents
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black/40 backdrop-blur-md relative z-10">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-white">AIVaultsAI</span>
                        </div>
                        <p>A trading name of S. Meester Bestratingen</p>
                        <p>KvK: 93216653</p>
                    </div>
                    <div className="text-right">
                        <p>© 2025 AIVaultsAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
