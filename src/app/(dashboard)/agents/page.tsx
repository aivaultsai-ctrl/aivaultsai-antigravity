'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Play, FileText, CheckCircle, Clock } from 'lucide-react';

export default function AgentsPage() {
    const [command, setCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]); // History of tasks
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);

    // Proactive suggestions logic
    useEffect(() => {
        // Every 60s check for inactivity (mock implementation)
        const timer = setInterval(() => {
            // Logic to show proactive toast could go here
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const handleExecute = async () => {
        if (!command.trim()) return;
        setIsProcessing(true);
        setSuggestionsVisible(false);

        // Mock AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newTask = {
            id: Date.now(),
            query: command,
            status: 'completed', // or 'pending_approval'
            output: {
                summary: "I've drafted a response to your client meeting request.",
                type: 'email_draft',
                content: "Subject: Follow up on AI integration\n\nHi John,\n\nThanks for your time yesterday...",
                actions: [
                    { label: "Send Email", intent: "send_email", primary: true },
                    { label: "Edit Draft", intent: "edit_email" }
                ]
            }
        };

        setTasks(prev => [newTask, ...prev]);
        setCommand('');
        setIsProcessing(false);
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Main Command Center */}
            <div className="flex-1 flex flex-col relative">

                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F172A]/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#00e0ff] shadow-[0_0_10px_#00e0ff]" />
                        <span className="text-sm font-medium text-gray-300">System Online</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Right header items if needed */}
                    </div>
                </header>

                {/* Activity Feed / Scroll Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">

                    {tasks.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00e0ff]/20 to-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_-10px_#00e0ff30] border border-white/5">
                                <Sparkles className="w-8 h-8 text-[#00e0ff]" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Good afternoon, Captain.</h1>
                            <p className="text-gray-400 max-w-md">Your autonomous workforce is standby. Choose a quick action or describe your objective below.</p>
                        </div>
                    )}

                    {/* Task Cards */}
                    {tasks.map((task) => (
                        <div key={task.id} className="w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-5">
                            {/* User Query */}
                            <div className="flex justify-end mb-6">
                                <div className="bg-[#1E293B] px-6 py-3 rounded-2xl rounded-tr-sm text-gray-200 border border-white/5 inline-block max-w-xl">
                                    {task.query}
                                </div>
                            </div>

                            {/* Agent Response Card */}
                            <div className="bg-black/40 border border-[#00e0ff]/20 rounded-2xl overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#00e0ff]" />

                                {/* Card Header */}
                                <div className="p-6 border-b border-white/5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#00e0ff]/10 flex items-center justify-center shrink-0 border border-[#00e0ff]/20">
                                        <Sparkles className="w-5 h-5 text-[#00e0ff]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white mb-1">Task Completed</h3>
                                        <p className="text-gray-400 text-sm">{task.output.summary}</p>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 bg-[#0B1120]/50 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap border-b border-white/5">
                                    {task.output.content}
                                </div>

                                {/* Actions */}
                                <div className="p-4 bg-[#0F172A] flex justify-end gap-3">
                                    {task.output.actions.map((action: any, idx: number) => (
                                        <button
                                            key={idx}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${action.primary
                                                    ? 'bg-[#00e0ff] text-black hover:bg-[#00e0ff]/90 hover:shadow-[0_0_15px_#00e0ff40]'
                                                    : 'border border-gray-700 hover:bg-white/5 text-gray-300'
                                                }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start w-full max-w-3xl mx-auto">
                            <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#00e0ff]/5 border border-[#00e0ff]/20 text-[#00e0ff] text-sm font-medium animate-pulse">
                                <span className="w-2 h-2 bg-[#00e0ff] rounded-full animate-bounce" />
                                Analyzing request...
                            </div>
                        </div>
                    )}

                    <div className="pb-32" /> {/* Spacer for bottom input */}
                </div>

                {/* Input Area (Floating) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent z-20">

                    {suggestionsVisible && tasks.length === 0 && (
                        <div className="flex justify-center gap-3 mb-6 flex-wrap">
                            <SuggestionChip icon={<FileText />} label="Draft Proposal" onClick={() => setCommand("Draft a proposal for client X")} />
                            <SuggestionChip icon={<Clock />} label="Schedule Analysis" onClick={() => setCommand("Analyze my calendar for next week")} />
                            <SuggestionChip icon={<Play />} label="Generate Content" onClick={() => setCommand("Generate 5 tweets about AI")} />
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00e0ff] to-purple-600 rounded-2xl opacity-20 group-focus-within:opacity-50 transition-opacity blur-md" />
                        <div className="relative flex items-center bg-[#1E293B] rounded-xl border border-white/10 shadow-2xl p-2">
                            <textarea
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleExecute())}
                                placeholder="What should we accomplish today?"
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 px-4 py-3 min-h-[56px] resize-none"
                                rows={1}
                            />
                            <button
                                onClick={handleExecute}
                                disabled={!command.trim() || isProcessing}
                                className="p-3 bg-[#00e0ff] hover:bg-[#00e0ff]/80 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-4">AI Agents can make mistakes. Review specific outputs before approving.</p>
                </div>
            </div>

            {/* Right Context Panel (Hidden on small screens) */}
            <div className="w-80 border-l border-white/5 bg-[#0F172A]/30 backdrop-blur-sm hidden xl:block p-6">
                <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Status</h3>

                <div className="space-y-6">
                    {/* Status Card 1 */}
                    <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-green-500/20 rounded text-green-500"><CheckCircle className="w-4 h-4" /></div>
                            <span className="text-sm font-medium">System Healthy</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[98%]" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Uptime</span>
                            <span>99.9%</span>
                        </div>
                    </div>

                    {/* Connected Tools */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-3">Active Integrations</h4>
                        <div className="space-y-2">
                            <IntegrationRow name="Gmail" status="connected" />
                            <IntegrationRow name="Notion" status="connected" />
                            <IntegrationRow name="Slack" status="syncing" />
                        </div>
                    </div>

                    {/* Memory Usage */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-3">Context Window</h4>
                        <div className="flex items-end gap-1 h-12">
                            <div className="w-1/5 bg-[#00e0ff]/20 h-[40%] rounded-t-sm" />
                            <div className="w-1/5 bg-[#00e0ff]/40 h-[70%] rounded-t-sm" />
                            <div className="w-1/5 bg-[#00e0ff]/60 h-[50%] rounded-t-sm" />
                            <div className="w-1/5 bg-[#00e0ff]/30 h-[30%] rounded-t-sm" />
                            <div className="w-1/5 bg-[#00e0ff]/10 h-[20%] rounded-t-sm" />
                        </div>
                        <p className="text-right text-xs text-gray-600 mt-1">2.4k tokens used</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuggestionChip({ icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E293B] border border-white/10 hover:border-[#00e0ff]/50 hover:bg-[#1E293B]/80 text-sm font-medium text-gray-300 hover:text-white transition-all shadow-lg shadow-black/20"
        >
            <span className="text-[#00e0ff]">{icon}</span>
            {label}
        </button>
    )
}

function IntegrationRow({ name, status }: any) {
    return (
        <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="text-sm text-gray-300 group-hover:text-white">{name}</span>
            </div>
            <span className="text-[10px] uppercase text-gray-600 font-medium">{status}</span>
        </div>
    )
}
