"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Play,
    CheckCircle2,
    Clock,
    Loader2,
    BarChart3,
} from "lucide-react";
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const WORKFLOWS = [
    { id: "content-to-leads", name: "Content to Leads Pipeline" },
    {
        id: "support-to-insight",
        name: "Support Ticket Analysis (Coming Soon)",
        disabled: true,
    },
    {
        id: "daily-growth-loop",
        name: "Daily Growth Loop (Coming Soon)",
        disabled: true,
    },
];

export default function OrchestrationPage() {
    const [selectedWorkflow, setSelectedWorkflow] = useState("content-to-leads");
    const [isRunning, setIsRunning] = useState(false);
    const [params, setParams] = useState({
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Default for demo
        targetPlatforms: "linkedin, tiktok",
        targetAudience: "B2B SaaS Founders",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentResult, setCurrentResult] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);

    // Load History
    useEffect(() => {
        if (!db) return;
        const q = query(
            collection(db, "workflow_executions"),
            orderBy("startTime", "desc"),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setHistory(items);
        });

        return () => unsubscribe();
    }, []);

    const runWorkflow = async () => {
        setIsRunning(true);
        setCurrentResult(null);

        try {
            const res = await fetch("/api/orchestration/run-workflow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workflow: selectedWorkflow,
                    params: {
                        ...params,
                        targetPlatforms: params.targetPlatforms
                            .split(",")
                            .map((p) => p.trim()),
                    },
                }),
            });

            if (!res.ok) throw new Error("Workflow failed");

            const data = await res.json();
            setCurrentResult(data);
        } catch (error) {
            console.error("Workflow error:", error);
            // Handle error state in UI
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <>
            <DashboardHeader title="Agent Orchestration" />
            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 glass-panel border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4">
                                Configuration
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">
                                        Select Workflow
                                    </label>
                                    <select
                                        value={selectedWorkflow}
                                        onChange={(e) => setSelectedWorkflow(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                    >
                                        {WORKFLOWS.map((w) => (
                                            <option
                                                key={w.id}
                                                value={w.id}
                                                disabled={w.disabled}
                                                className="bg-slate-900 text-white"
                                            >
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedWorkflow === "content-to-leads" && (
                                    <>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                YouTube URL
                                            </label>
                                            <input
                                                value={params.videoUrl}
                                                onChange={(e) =>
                                                    setParams({ ...params, videoUrl: e.target.value })
                                                }
                                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Platforms (comma sep)
                                            </label>
                                            <input
                                                value={params.targetPlatforms}
                                                onChange={(e) =>
                                                    setParams({
                                                        ...params,
                                                        targetPlatforms: e.target.value,
                                                    })
                                                }
                                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Target Audience
                                            </label>
                                            <input
                                                value={params.targetAudience}
                                                onChange={(e) =>
                                                    setParams({
                                                        ...params,
                                                        targetAudience: e.target.value,
                                                    })
                                                }
                                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </>
                                )}

                                <Button
                                    onClick={runWorkflow}
                                    disabled={isRunning}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mt-4"
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" /> Run Workflow
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {/* Recent History */}
                        <div className="glass-panel p-6 rounded-xl border border-white/5">
                            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Recent Executions
                            </h3>
                            <div className="space-y-3">
                                {history.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No recent runs.
                                    </p>
                                )}
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {history.map((run: any) => (
                                    <div
                                        key={run.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-xs"
                                    >
                                        <div>
                                            <p className="font-medium text-white truncate max-w-[120px]">
                                                {run.type}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {new Date(run.startTime).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-emerald-400 font-mono">
                                                {run.totalDuration}
                                            </span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visualization & Results */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress / Status */}
                        <Card className="p-8 glass-panel border-white/10 min-h-[400px] flex flex-col">
                            {!currentResult && !isRunning ? (
                                <div className="m-auto text-center text-muted-foreground">
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Ready to orchestrate your AI workforce.</p>
                                    <p className="text-sm">Select parameters and click run.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-white mb-6">
                                        Execution Pipeline
                                    </h2>

                                    <div className="space-y-8 relative">
                                        {/* Connecting Line */}
                                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10 z-0" />

                                        {/* STEPS */}
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(
                                            currentResult?.steps ||
                                            (isRunning
                                                ? [{ agent: "content-agent", status: "running" }]
                                                : [])
                                        ).map((step: any, idx: number) => (
                                            <div key={idx} className="relative z-10 flex gap-4">
                                                <div
                                                    className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-4 border-background shrink-0
                            ${step.status === "completed"
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-blue-500 animate-pulse text-white"
                                                        }
                        `}
                                                >
                                                    {step.status === "completed" ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    )}
                                                </div>
                                                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-semibold text-white capitalize">
                                                            {step.agent}
                                                        </h3>
                                                        <span className="text-xs font-mono text-muted-foreground">
                                                            {step.duration || "..."}
                                                        </span>
                                                    </div>
                                                    {step.output && (
                                                        <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                                                            {JSON.stringify(step.output, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Final Results */}
                                    {currentResult && (
                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <h3 className="text-lg font-bold text-white mb-4">
                                                Workflow Results
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {Object.entries(currentResult.results).map(([k, v]) => (
                                                    <div
                                                        key={k}
                                                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3"
                                                    >
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {k.replace(/([A-Z])/g, " $1").trim()}
                                                        </p>
                                                        <p className="text-xl font-bold text-emerald-400">
                                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                            {String(v as any)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
