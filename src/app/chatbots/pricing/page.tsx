import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#E5E7EB] mb-4">Simple, transparent pricing</h1>
                    <p className="text-[#9CA3AF] text-lg">Choose the perfect digital workforce for your business.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? 'bg-[#1F2937] border-[#3B82F6] shadow-xl shadow-blue-900/10'
                                    : 'bg-[#111827] border-[#374151]'
                                } flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-[#9CA3AF]">/month</span>
                                </div>
                                <p className="text-[#9CA3AF] mt-4 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-[#D1D5DB]">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/chatbots/dashboard"
                                className={`w-full py-3 rounded-lg font-semibold text-center transition-all ${plan.popular
                                        ? 'bg-[#3B82F6] hover:bg-[#2563eb] text-white'
                                        : 'bg-[#374151] hover:bg-[#4B5563] text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const plans = [
    {
        name: "Starter",
        price: "$49",
        description: "Perfect for small sites and personal portfolios.",
        features: [
            "1 AI Employee",
            "1,000 conversations/mo",
            "Standard Support",
            "Basic Analytics",
            "Email Capture"
        ],
        cta: "Start Free Trial",
        popular: false
    },
    {
        name: "Business",
        price: "$149",
        description: "For growing companies that need 24/7 automation.",
        features: [
            "3 AI Employees",
            "10,000 conversations/mo",
            "Priority Support",
            "Advanced Sentiment Analysis",
            "CRM Integration (HubSpot, Salesforce)",
            "Custom Branding"
        ],
        cta: "Get Started",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full-scale solution for high traffic organizations.",
        features: [
            "Unlimited AI Employees",
            "Unlimited conversations",
            "Dedicated Account Manager",
            "SLA Guarantees",
            "On-premise Deployment Options",
            "Custom LLM Fine-tuning"
        ],
        cta: "Contact Sales",
        popular: false
    }
];
