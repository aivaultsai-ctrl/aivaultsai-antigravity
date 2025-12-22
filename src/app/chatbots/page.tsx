import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageSquare, Zap, Shield } from 'lucide-react';

export default function ChatbotsLandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6] opacity-[0.05] rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#E5E7EB] mb-6 leading-tight">
                        Deploy an <span className="text-[#3B82F6]">AI Employee</span> <br />
                        on your website in minutes.
                    </h1>
                    <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Sales, support & lead capture — automated 24/7 without hiring staff.
                        Transform your static website into an intelligent workforce.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/chatbots/demo" className="w-full sm:w-auto px-8 py-3.5 bg-[#3B82F6] hover:bg-[#2563eb] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                            Get Started Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/chatbots/pricing" className="w-full sm:w-auto px-8 py-3.5 bg-[#1F2937] hover:bg-[#374151] text-[#E5E7EB] border border-[#374151] rounded-lg font-medium transition-all flex items-center justify-center">
                            View Pricing
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-[#6B7280] text-sm">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> No credit card required</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 5-minute setup</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 py-20 bg-[#111827]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-8 bg-[#1F2937]/50 border border-[#374151] rounded-2xl hover:bg-[#1F2937] transition-all group">
                                <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#374151]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#E5E7EB] mb-3">{feature.title}</h3>
                                <p className="text-[#9CA3AF] leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

const features = [
    {
        icon: <MessageSquare className="w-6 h-6 text-[#3B82F6]" />,
        title: "Intelligent Conversations",
        description: "Beyond simple chatbots. Our AI understands context, nuance, and intent to provide human-tier support."
    },
    {
        icon: <Zap className="w-6 h-6 text-[#10B981]" />,
        title: "Instant Lead Capture",
        description: "Automatically qualify leads and book meetings directly in your calendar while you sleep."
    },
    {
        icon: <Shield className="w-6 h-6 text-[#8B5CF6]" />,
        title: "Brand Safe Guardrails",
        description: "Strict controls ensure the AI always stays on-brand and follows your specific business rules."
    }
];
