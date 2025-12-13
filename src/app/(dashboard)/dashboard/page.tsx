"use client";

import { Header } from "@/components/layout/Header";
import { Users, MessageCircle, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Active Employees", value: "3", icon: Users, change: "+1 hired" },
        { label: "Leads Captured", value: "142", icon: TrendingUp, change: "+12% this week" },
        { label: "Tasks Automating", value: "8", icon: Zap, change: "Active" },
    ];

    return (
        <>
            <Header title="Command Center" />
            <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-default">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                                <p className="text-xs text-emerald-400 mt-2 font-medium">{stat.change}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">API Gateway</span>
                                <span className="text-emerald-400 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Database Sync</span>
                                <span className="text-emerald-400 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2">
                                <span className="text-muted-foreground">AI Models</span>
                                <span className="text-emerald-400 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> v1.5 Pro Ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mb-4 blur-xl opacity-20 absolute" />
                        <h3 className="text-lg font-semibold text-white relative">Deploy New Agent</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-2 mb-6 relative">
                            Configure a new AI employee to handle sales, support, or data entry tasks.
                        </p>
                        <button className="h-10 px-6 bg-primary hover:bg-primary/90 rounded-lg text-sm font-semibold text-white transition-colors relative">
                            Initialize Setup
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
