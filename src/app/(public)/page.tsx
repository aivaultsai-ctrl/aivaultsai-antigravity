import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col relative overflow-hidden bg-background">
            {/* Navigation Skeleton */}
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-32 container text-center relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Operational v2.0
                </div>

                <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6">
                    The Future of <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Autonomous Work</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                    Deploy enterprise-grade AI employees, specialized assistants, and custom automation workflows.
                    Secure, scalable, and built for the next generation of business.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register" className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                        Initialize Workspace <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/pricing" className="h-12 px-8 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center gap-2 hover:bg-secondary/80 border border-white/10 transition-all">
                        View Capabilities
                    </Link>
                </div>
            </section>

            {/* Feature Grid Skeleton */}
            <section className="py-24 bg-white/5 border-t border-white/5">
                <div className="container grid md:grid-cols-3 gap-8">
                    {[
                        { title: "AI Employees", desc: "Specialized agents for Sales, Support, and Admin tasks.", icon: Sparkles },
                        { title: "Secure Infrastructure", desc: "Enterprise-grade encryption and access controls.", icon: ShieldCheck },
                        { title: "Instant Scale", desc: "Spin up thousands of instances in seconds.", icon: Sparkles }
                    ].map((f, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-black/20 border border-white/5 hover:border-primary/50 transition-colors group">
                            <f.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-muted-foreground">{f.desc}</p>
                        </div>
                    ))}
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

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none opacity-30 mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none opacity-20" />
        </main>
    );
}
