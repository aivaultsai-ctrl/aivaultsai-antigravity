'use client';

import Link from 'next/link';
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Users, LayoutDashboard, TrendingUp, Zap, ArrowRight, Activity, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Active Workforce", value: "3 Agents", icon: Users, color: "text-[#00e0ff]" },
        { label: "Tasks Automating", value: "142", icon: Zap, color: "text-amber-500" },
        { label: "System Uptime", value: "99.99%", icon: Activity, color: "text-green-500" },
    ];

    return (
        <>
            <DashboardHeader title="Command Center" />
            <div className="p-8 space-y-8 min-h-[calc(100vh-64px)] bg-[#0B1120] text-white">

                {/* Welcome / Onboarding Hero */}
                <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-white/5 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-full bg-[#00e0ff]/5 skew-x-12 blur-xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e0ff]/10 text-[#00e0ff] text-xs font-bold uppercase tracking-widest mb-4 border border-[#00e0ff]/20">
                            Production Environment
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">
                            Your Autonomous Operations Center
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Everything is controlled from one place: active employees, live status, and growth metrics.
                            This is where operators work — not hobbyists.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/agents" className="px-6 py-3 bg-[#00e0ff] hover:bg-[#33e7ff] text-black font-bold rounded-lg shadow-[0_0_20px_#00e0ff40] flex items-center gap-2 transition-all">
                                Enter Command Center <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/ai-workers" className="px-6 py-3 bg-[#1F293B] hover:bg-[#334155] text-white font-medium rounded-lg border border-white/10 flex items-center gap-2 transition-all">
                                Deploy New Agent
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[#111827] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <div className={`h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Activity & Status */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                                Live System Status
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Operational
                            </div>
                        </div>
                        <div className="space-y-4">
                            <StatusRow label="API Gateway" status="Healthy" />
                            <StatusRow label="Vector Database" status="Synced" />
                            <StatusRow label="LLM Inference Nodes" status="Active (v4.0)" />
                            <StatusRow label="Payment Processor" status="Connected" />
                        </div>
                    </div>

                    <div className="bg-[#111827] border border-white/5 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00e0ff]/5 to-transparent pointer-events-none" />
                        <ShieldCheck className="w-12 h-12 text-[#00e0ff] mx-auto mb-4 opacity-80" />
                        <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                            Your data is isolated and encrypted. SOC2 compliant infrastructure active.
                        </p>
                        <button className="text-sm text-[#00e0ff] hover:text-white transition-colors font-medium">
                            View Compliance Report
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatusRow({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-mono text-gray-200">{status}</span>
        </div>
    )
}
