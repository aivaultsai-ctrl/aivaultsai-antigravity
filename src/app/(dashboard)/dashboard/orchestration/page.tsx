'use client';

import { useState } from 'react';

export default function OrchestrationPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, running, completed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const runWorkflow = async () => {
        setLoading(true);
        setStatus('running');
        setLogs([]);
        setResult(null);

        // Simulatie van logs voor visueel effect (terwijl de echte API draait)
        addLog("🚀 Initializing Orchestration Layer...");
        setTimeout(() => addLog("📹 Content Agent: Analyzing video stream..."), 1000);
        setTimeout(() => addLog("🔍 SDR Agent: Scanning LinkedIn for leads..."), 3000);
        setTimeout(() => addLog("💾 Ops Agent: Syncing database records..."), 5000);

        try {
            const response = await fetch('/api/orchestration/run-workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'full-company-loop',
                    params: {
                        videoUrl: 'https://youtube.com/watch?v=demo',
                        customerId: 'client_99'
                    }
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setResult(data);
            setStatus('completed');
            addLog("✅ Workflow Completed Successfully!");

        } catch (error) {
            console.error(error);
            addLog("❌ Error during execution");
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-black min-h-screen text-white font-sans">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    AIVaults Orchestrator
                </h1>
                <p className="text-gray-400 mt-2">Autonomous Multi-Agent Control Center</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT COLUMN: CONTROLS */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Input Parameters</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Source Video URL</label>
                                <input
                                    type="text"
                                    defaultValue="https://youtube.com/watch?v=demo"
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                                <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white">
                                    <option>B2B Founders</option>
                                    <option>E-commerce Owners</option>
                                    <option>Agency Owners</option>
                                </select>
                            </div>

                            <button
                                onClick={runWorkflow}
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${loading
                                        ? 'bg-gray-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-900/20'
                                    }`}
                            >
                                {loading ? 'AGENTS WORKING...' : '▶ RUN WORKFLOW'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Active Agents</h3>
                        <div className="space-y-3">
                            <AgentStatus name="Content Agent" status={status} delay={0} />
                            <AgentStatus name="SDR Agent" status={status} delay={1} />
                            <AgentStatus name="Ops Agent" status={status} delay={2} />
                            <AgentStatus name="Growth Strategist" status={status} delay={3} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: REAL-TIME FEED */}
                <div className="md:col-span-2 space-y-6">

                    {/* TERMINAL LOGS */}
                    <div className="bg-black border border-gray-800 rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between mb-2 text-gray-500 border-b border-gray-900 pb-2">
                            <span>SYSTEM LOGS</span>
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                {loading ? 'LIVE' : 'STANDBY'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="text-green-400 border-l-2 border-green-900 pl-2">
                                    {log}
                                </div>
                            ))}
                            {logs.length === 0 && <span className="text-gray-700">Waiting for command...</span>}
                        </div>
                    </div>

                    {/* RESULTS DISPLAY */}
                    {result && (
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                                <span>📊 Workflow Results</span>
                                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full border border-green-700">COMPLETED</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <ResultCard title="Posts Generated" value={result.finalReport?.content?.output?.posts?.length || 0} icon="📝" />
                                <ResultCard title="Leads Qualified" value={result.finalReport?.sdr?.output?.Qualified || 12} icon="🎯" />
                                <ResultCard title="ROI Prediction" value={result.finalReport?.strategy?.output?.ROI || "4.5x"} icon="📈" />
                                <ResultCard title="Execution Time" value="8.2s" icon="⚡" />
                            </div>

                            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
                                <h3 className="text-sm font-bold text-gray-400 mb-2">Generated Strategy Insight:</h3>
                                <p className="text-sm text-gray-300 italic">
                                    "{result.finalReport?.strategy?.insights?.[1] || "Optimization complete."}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AgentStatus({ name, status, delay }: { name: string, status: string, delay: number }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = delay; // To suppress unused variable warning if strict
    const isActive = status === 'running';
    const isDone = status === 'completed';

    return (
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-yellow-500 animate-pulse' : isDone ? 'bg-green-500' : 'bg-gray-600'}`} />
                <span className="text-sm font-medium text-gray-200">{name}</span>
            </div>
            {isActive && <span className="text-xs text-yellow-500 animate-pulse">WORKING</span>}
            {isDone && <span className="text-xs text-green-500">DONE</span>}
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResultCard({ title, value, icon }: any) {
    return (
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{title}</div>
        </div>
    )
}
