"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Play, Pause, Activity, TrendingUp, Users, FileText, Zap, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Agent {
    id: string;
    name: string;
    role: string;
    status: "active" | "inactive" | "paused";
    capabilities: string[];
    description: string;
    metrics: {
        [key: string]: number;
    };
    currentTask?: string;
}

export default function OperationsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, "ai_employees"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const agentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agent[];
            setAgents(agentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleAgent = async (agent: Agent) => {
        if (!db) return;
        const newStatus = agent.status === "active" ? "paused" : "active";
        try {
            await updateDoc(doc(db, "ai_employees", agent.id), {
                status: newStatus
            });
        } catch (err) {
            console.error("Failed to update agent status:", err);
        }
    };

    return (
        <>
            <DashboardHeader title="Operations Command Center" />
            <div className="p-8 space-y-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">System Health</p>
                            <h3 className="text-2xl font-bold text-foreground">99.9%</h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Agents</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {agents.filter(a => a.status === 'active').length} / {agents.length}
                            </h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Actions</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {agents.reduce((acc, curr) => {
                                    return acc + Object.values(curr.metrics || {}).reduce((a, b) => a + b, 0);
                                }, 0)}
                            </h3>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-white/10 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-orange-500/10 text-orange-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Revenue/Mo</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${agents.reduce((acc, curr) => acc + (curr.pricing || 0), 0)}
                            </h3>
                        </div>
                    </Card>
                </div>

                {/* Agents Grid */}
                <div>
                    <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" /> Active Workforce
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center p-12 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading agents...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.map((agent) => (
                                <div key={agent.id} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                                    {agent.status === "active" && (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Activity className="animate-pulse w-24 h-24" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start z-10">
                                        <div>
                                            <h3 className="font-bold text-foreground text-lg">{agent.name}</h3>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{agent.role}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold border capitalize ${agent.status === "active"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : agent.status === "paused"
                                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                            }`}>
                                            {agent.status}
                                        </div>
                                    </div>

                                    <div className="z-10 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-muted-foreground min-h-[4rem]">
                                        <span className="text-primary">{">"}</span> {agent.description}
                                        {Object.entries(agent.metrics || {}).slice(0, 2).map(([key, val]) => (
                                            <div key={key} className="mt-1 flex justify-between">
                                                <span>{key}:</span>
                                                <span className="text-white">{val}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex justify-end gap-2 z-10">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <FileText className="w-4 h-4 mr-2" /> Logs
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={agent.status === "active" ? "secondary" : "default"}
                                            onClick={() => toggleAgent(agent)}
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/5"
                                        >
                                            {agent.status === "active" ? (
                                                <><Pause className="w-4 h-4 mr-2" /> Pause</>
                                            ) : (
                                                <><Play className="w-4 h-4 mr-2" /> Start</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Automation Log Preview */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="text-sm font-medium text-foreground mb-4">Live System Logs & Metrics</h3>
                    <div className="font-mono text-xs text-muted-foreground space-y-2">
                        <p><span className="text-emerald-500">[System]</span> Listening for new tasks...</p>
                        <p><span className="text-blue-400">[Orchestrator]</span> All agents synced.</p>
                    </div>
                </div>

            </div>
        </>
    );
}
