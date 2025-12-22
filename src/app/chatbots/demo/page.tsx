'use client';

import { useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';

export default function DemoPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi there! I am the automated support agent for this demo. How can I help you optimize your website today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "That's a great question. In a real deployment, I would be trained on your specific business data, FAQs, and documentation to answer that instantly. Would you like to see how to train me?"
            }]);
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
            {/* Configuration Side (Visual Only) */}
            <div className="hidden md:block bg-[#111827] border-r border-[#1F2937] p-8">
                <h2 className="text-xl font-bold text-white mb-6">Employee Configuration</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Employee Name</label>
                        <input type="text" disabled value="Support Agent 01" className="w-full bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] opacity-75" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Role</label>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-1 bg-[#3B82F6]/20 border border-[#3B82F6] text-[#3B82F6] text-xs rounded-full font-medium">Customer Support</div>
                            <div className="px-3 py-1 bg-[#1F2937] border border-[#374151] text-[#6B7280] text-xs rounded-full">Sales SDR</div>
                            <div className="px-3 py-1 bg-[#1F2937] border border-[#374151] text-[#6B7280] text-xs rounded-full">Technical Guide</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Knowledge Base Sources</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-[#D1D5DB] p-3 bg-[#1F2937] rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]" /> example.com/pricing
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#D1D5DB] p-3 bg-[#1F2937] rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]" /> example.com/docs
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#1F2937]">
                        <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Tone of Voice</h3>
                        <input type="range" className="w-full h-2 bg-[#374151] rounded-lg appearance-none cursor-not-allowed opacity-60" disabled />
                        <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                            <span>Professional</span>
                            <span>Friendly</span>
                            <span>Casual</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Side */}
            <div className="bg-[#0F172A] relative flex flex-col h-[calc(100vh-64px)]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-[#374151]' : 'bg-[#3B82F6]'}`}>
                                    {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-[#374151] text-white rounded-tr-none'
                                        : 'bg-[#1F2937] text-[#E5E7EB] border border-[#374151] rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-[#1F2937] bg-[#111827]/50 backdrop-blur-sm">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-4 pr-12 text-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] placeholder:text-[#6B7280]"
                        />
                        <button type="submit" disabled={!input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
                        <Sparkles className="w-3 h-3 text-[#3B82F6]" /> Powered by AIVaults Neural Engine
                    </div>
                </div>
            </div>
        </div>
    );
}
