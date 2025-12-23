"use client";

import React, { useState } from "react";
import { Check, X, ArrowRight, Bot, Zap, Shield, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- CONFIGURATION ---
const STRIPE_LINKS = {
    starter: "https://buy.stripe.com/dRmfZh7Ef81MfXv01adwc06",
    pro: "https://buy.stripe.com/cNieVdf6H5TE7qZ29idwc07",
    enterprise: "https://buy.stripe.com/7sYcN5e2Dfue9z76pydwc05"
};

const CALENDAR_LINK = "https://calendly.com/yourname/30min";

// --- DATA: SOLUTIONS ---
const solutions = [
    {
        id: "sales",
        title: "Sales Closer AI",
        desc: "Your unstoppable 24/7 sales machine.",
        icon: <Zap className="h-6 w-6 text-yellow-500" />,
        features: ["Follow-ups & objections", "Lead qualification", "Outreach automation", "Books meetings automatically"],
        details: "This agent connects to your CRM, reads incoming leads, and engages them via SMS/Email within 30 seconds. It handles objection handling using GPT-4 logic and books meetings directly to your Calendly."
    },
    {
        id: "support",
        title: "Customer Support AI",
        desc: "Instant support. Zero wait times.",
        icon: <Shield className="h-6 w-6 text-blue-500" />,
        features: ["Ticket handling", "Escalation logic", "Multichannel support", "Learns tone & policies"],
        details: "Integrates with Zendesk/Intercom. It resolves 80% of L1 tickets automatically by reading your knowledge base. Escalates complex issues to humans with a full summary."
    },
    {
        id: "marketing",
        title: "Marketing Content AI",
        desc: "24/7 creative content engine.",
        icon: <Bot className="h-6 w-6 text-purple-500" />,
        features: ["Ads, captions, blogs", "Email campaigns", "Content remixing", "A/B testing"],
        details: "Generates SEO-optimized blogs, social captions, and ad copy. Can automatically post to LinkedIn and X (Twitter) on a schedule you define."
    },
    {
        id: "setter",
        title: "Appointment Setter AI",
        desc: "Books meetings while you sleep.",
        icon: <Check className="h-6 w-6 text-green-500" />,
        features: ["Lead pre-qualification", "Calendar syncing", "Multi-channel replies", "Auto no-show follow-ups"],
        details: "Focuses purely on getting meetings booked. It chases dead leads and reactivates old lists with personalized offers."
    },
    {
        id: "backoffice",
        title: "Back-Office Automation",
        desc: "Eliminate repetitive admin tasks.",
        icon: <Zap className="h-6 w-6 text-orange-500" />,
        features: ["Document processing", "Reporting & invoicing", "CRM/ERP updates", "Email triage"],
        details: "Reads PDFs, invoices, and emails to update your internal databases. Perfect for data entry automation."
    }
];

// --- DATA: PRICING ---
const pricingPlans = [
    {
        id: "starter",
        name: "Starter",
        price: "€39,99",
        period: "/maand",
        description: "Start small and scale your autonomous workforce.",
        features: ["1 autonomous AI agent", "24/7 operation and unlimited tasks", "Email support", "Dashboard access", "Upgrade anytime"],
        cta: "Deploy Now",
        popular: false
    },
    {
        id: "pro",
        name: "Professional",
        price: "€79,99",
        period: "/maand",
        description: "For growing businesses needing power.",
        features: ["3 AI agents simultaneously", "Multi-agent orchestration", "Advanced workflows", "Priority support", "API access"],
        cta: "Deploy Now",
        popular: true
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "€249,99",
        period: "/maand",
        description: "Unlimited scale for serious operations.",
        features: ["Unlimited AI agents", "Custom development", "Dedicated account manager", "White-label options", "SLA guarantee"],
        cta: "Deploy Now",
        popular: false
    }
];

export default function SolutionsPricing() {

    // Handlers
    const handlePurchase = (planId: string) => {
        if (planId === "starter") window.location.href = STRIPE_LINKS.starter;
        if (planId === "pro") window.location.href = STRIPE_LINKS.pro;
        if (planId === "enterprise") window.location.href = STRIPE_LINKS.enterprise;
    };

    const scrollToPricing = () => {
        document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full bg-zinc-950 text-zinc-100 py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-24">

                {/* --- SOLUTIONS SECTION --- */}
                <div className="space-y-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Your AI Workforce
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Select an agent to see how it automates your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((sol) => (
                            <Card key={sol.id} className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-all duration-300">
                                <CardHeader>
                                    <div className="mb-4">{sol.icon}</div>
                                    <CardTitle className="text-xl text-white">{sol.title}</CardTitle>
                                    <CardDescription className="text-zinc-400 h-10">{sol.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 mb-6">
                                        {sol.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* MODAL (VIEW DETAILS) */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                                                View Details <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl flex items-center gap-2">
                                                    {sol.icon} {sol.title}
                                                </DialogTitle>
                                                <DialogDescription className="text-zinc-400 text-lg pt-2">
                                                    {sol.desc}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                                <p className="text-zinc-300 leading-relaxed">
                                                    {sol.details}
                                                </p>
                                                <Separator className="my-4 bg-zinc-800" />
                                                <h4 className="font-semibold mb-3 text-indigo-400">Capabilities:</h4>
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {sol.features.map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-emerald-500" /> {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Button onClick={scrollToPricing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                                Deploy This Agent
                                            </Button>
                                        </DialogContent>
                                    </Dialog>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* --- COMPARISON SECTION (Simplified) --- */}
                <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
                    <h3 className="text-2xl font-bold text-center mb-8">Human vs. AI Employee</h3>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm md:text-base">
                        <div className="font-bold text-zinc-500">Metric</div>
                        <div className="font-bold text-zinc-300">Human</div>
                        <div className="font-bold text-indigo-400">AI Employee</div>

                        {/* Row 1 */}
                        <div className="text-zinc-500 py-2 border-b border-zinc-800">Availability</div>
                        <div className="text-zinc-300 py-2 border-b border-zinc-800">8 hrs/day</div>
                        <div className="text-indigo-400 py-2 border-b border-zinc-800">24/7/365</div>

                        {/* Row 2 */}
                        <div className="text-zinc-500 py-2 border-b border-zinc-800">Cost</div>
                        <div className="text-zinc-300 py-2 border-b border-zinc-800">€3k - €8k /mo</div>
                        <div className="text-indigo-400 py-2 border-b border-zinc-800">€39.99 - €79.99 /mo</div>
                    </div>
                </div>

                {/* --- PRICING SECTION --- */}
                <div id="pricing-section" className="space-y-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-zinc-400">
                            Start small and scale your autonomous workforce as you grow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col bg-zinc-900 border-zinc-800 ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-105 z-10' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-indigo-600 hover:bg-indigo-700">Most Popular</Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                                    <div className="mt-2 flex items-baseline text-white">
                                        <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                        <span className="ml-1 text-xl font-semibold text-zinc-500">{plan.period}</span>
                                    </div>
                                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-emerald-500" />
                                                </div>
                                                <p className="ml-3 text-sm text-zinc-300">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={() => handlePurchase(plan.id)}
                                        className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-zinc-800 hover:bg-zinc-700'} text-white`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* --- BOTTOM CTA --- */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 text-center border border-indigo-500/30">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Deploy Your AI Workforce?</h2>
                    <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">Join the revolution. Automate your business today and experience the power of autonomous scaling.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={scrollToPricing} size="lg" className="bg-white text-indigo-900 hover:bg-zinc-200 font-bold">
                            Deploy AI Workforce
                        </Button>
                        <Button onClick={() => window.open(CALENDAR_LINK, '_blank')} size="lg" variant="outline" className="border-indigo-400 text-indigo-100 hover:bg-indigo-900/50">
                            Talk to an AI Specialist
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
