"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Play, Pause, Activity, TrendingUp, Users, FileText, Zap } from "lucide-react";

// Mock data representing the 5 Agents
const AGENTS = [
    { id: 1, name: "Business Strategist", role: "CEO Agent", status: "Active", task: "Analyzing Q4 revenue models..." },
    { id: 2, name: "Automation Eng.", role: "Systems Agent", status: "Idle", task: "Waiting for webhook trigger..." },
    { id: 3, name: "Sales Closer", role: "Outreach Agent", status: "Active", task: "Drafting cold DMs for Campaign #4..." },
    { id: 4, name: "AI Developer", role: "Tool Builder", status: "Active", task: "Deploying API endpoint /api/ops..." },
    { id: 5, name: "Content Machine", role: "Growth Agent", status: "Paused", task: "Scheduled for 09:00 AM EST." },
];

export default function OperationsPage() {
    const [agents, setAgents] = useState(AGENTS);

    const toggleAgent = (id: number) => {
        setAgents(prev => prev.map(a => {
            if (a.id === id) {
                return { ...a, status: a.status === "Active" ? "Paused" : "Active" };
            }
            return a;
        }));
    };

    return (
        <>
            <Header title="Operations Command Center" />
            <div className="p-8 space-y-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">System Health</p>
                            <h3 className="text-2xl font-bold text-white">98%</h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Threads</p>
                            <h3 className="text-2xl font-bold text-white">12</h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tasks Completed</p>
                            <h3 className="text-2xl font-bold text-white">145</h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-orange-500/10 text-orange-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Leads Generated</p>
                            <h3 className="text-2xl font-bold text-white">24</h3>
                        </div>
                    </Card>
                </div>

                {/* Agents Grid */}
                <div>
                    <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" /> Active Workforce
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                            <div key={agent.id} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                                {agent.status === "Active" && (
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Activity className="animate-pulse w-24 h-24" />
                                    </div>
                                )}

                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{agent.role}</span>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold border ${agent.status === "Active"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : agent.status === "Idle"
                                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                        }`}>
                                        {agent.status}
                                    </div>
                                </div>

                                <div className="z-10 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-muted-foreground h-16">
                                    <span className="text-primary">{">"}</span> {agent.task}
                                </div>

                                <div className="mt-auto flex justify-end gap-2 z-10">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-white"
                                    >
                                        <FileText className="w-4 h-4 mr-2" /> Logs
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={agent.status === "Active" ? "secondary" : "default"}
                                        onClick={() => toggleAgent(agent.id)}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/5"
                                    >
                                        {agent.status === "Active" ? (
                                            <><Pause className="w-4 h-4 mr-2" /> Pause</>
                                        ) : (
                                            <><Play className="w-4 h-4 mr-2" /> Start</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Automation Log Preview */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="text-sm font-medium text-white mb-4">Live System Logs</h3>
                    <div className="font-mono text-xs text-muted-foreground space-y-2">
                        <p><span className="text-emerald-500">[20:04:15]</span> <span className="text-blue-400">Worker-2</span> Triggered webhook: lead_capture_v1</p>
                        <p><span className="text-emerald-500">[20:04:12]</span> <span className="text-purple-400">Sales-Agent</span> Email draft generated for lead_id: 8593</p>
                        <p><span className="text-emerald-500">[20:03:55]</span> <span className="text-yellow-400">System</span> Database backup completed in 450ms.</p>
                        <p><span className="text-emerald-500">[20:03:10]</span> <span className="text-pink-400">Content-Agent</span> TikTok script saved to Firestore.</p>
                    </div>
                </div>

            </div>
        </>
    );
}
