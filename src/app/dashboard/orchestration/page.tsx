"use client";

import React, { useState } from "react";
import {
    Play,
    Pause,
    Settings,
    Plus,
    Activity,
    AlertCircle,
    CheckCircle2,
    Cpu
} from "lucide-react";

// Types
type PipelineStatus = "running" | "idle" | "error" | "paused";

interface Pipeline {
    id: string;
    name: string;
    type: string;
    status: PipelineStatus;
    lastRun: string;
    uptime: string;
}

// Mock Data (Replace with Supabase/Firebase fetch)
const initialPipelines: Pipeline[] = [
    {
        id: "p-1",
        name: "Instagram Content Agent",
        type: "Social Automation",
        status: "running",
        lastRun: "2 mins ago",
        uptime: "99.9%"
    },
    {
        id: "p-2",
        name: "Lead Scraper V2",
        type: "Browser Automation",
        status: "idle",
        lastRun: "4 hours ago",
        uptime: "98.5%"
    },
    {
        id: "p-3",
        name: "Stripe Webhook Handler",
        type: "Payment Processing",
        status: "error",
        lastRun: "10 mins ago",
        uptime: "95.0%"
    }
];

export default function OrchestrationPage() {
    const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines);

    const getStatusColor = (status: PipelineStatus) => {
        switch (status) {
            case "running": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case "idle": return "text-slate-500 bg-slate-500/10 border-slate-500/20";
            case "error": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "paused": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            default: return "text-slate-500";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Cpu className="h-8 w-8 text-indigo-500" />
                        AI Orchestration
                    </h1>
                    <p className="text-zinc-400 mt-1">Manage your active agents and automation pipelines.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    <Plus className="h-4 w-4" />
                    New Pipeline
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Activity className="h-4 w-4" /> Active Pipelines
                    </div>
                    <div className="text-3xl font-bold">4/12</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <CheckCircle2 className="h-4 w-4" /> Success Rate
                    </div>
                    <div className="text-3xl font-bold text-emerald-500">98.2%</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <AlertCircle className="h-4 w-4" /> Critical Errors
                    </div>
                    <div className="text-3xl font-bold text-red-500">1</div>
                </div>
            </div>

            {/* Pipeline List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="font-semibold">Active Pipelines</h2>
                </div>
                <div className="divide-y divide-zinc-800">
                    {pipelines.map((pipeline) => (
                        <div key={pipeline.id} className="p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-3 w-3 rounded-full ${pipeline.status === 'running' ? 'bg-emerald-500 animate-pulse' :
                                        pipeline.status === 'error' ? 'bg-red-500' : 'bg-zinc-600'
                                    }`} />
                                <div>
                                    <h3 className="font-medium text-lg">{pipeline.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                                        <span>{pipeline.type}</span>
                                        <span>•</span>
                                        <span>Last run: {pipeline.lastRun}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pipeline.status)} capitalize`}>
                                    {pipeline.status}
                                </span>
                                <div className="flex items-center gap-2 border-l border-zinc-700 pl-4 ml-4">
                                    <button className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                                        {pipeline.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </button>
                                    <button className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                                        <Settings className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
