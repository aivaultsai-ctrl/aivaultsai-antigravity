import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col relative overflow-hidden bg-background">
            {/* Navigation Skeleton */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between">
                    <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-xs">AI</span>
                        </div>
                        AIVaultsAI
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                        <Link href="/register" className="text-sm font-medium bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">Get Started</Link>
                    </div>
                </div>
            </header>

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

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none opacity-30 mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none opacity-20" />
        </main>
    );
}
