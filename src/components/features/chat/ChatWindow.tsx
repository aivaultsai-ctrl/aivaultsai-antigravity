"use client";

import { useChat } from "ai/react";
import { MessageBubble } from "./MessageBubble";
import { Send, Sparkles, Loader2, StopCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    employeeId?: string; // Optional: specific employee to talk to
    initialMessage?: string;
}

export default function ChatWindow({ employeeId = "sales", initialMessage }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({
        api: "/api/ai/chat",
        body: { employeeId },
        initialMessages: initialMessage ? [{ id: "init", role: "assistant", content: initialMessage }] : [],
        onError: (err) => console.error("Chat Error", err)
    });

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-sm tracking-wide text-white">
                        {employeeId.toUpperCase()} UNIT
                    </span>
                </div>
                {isLoading && (
                    <button onClick={() => stop()} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                        <StopCircle className="w-3 h-3" /> STOP GENERATION
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 select-none">
                        <Sparkles className="w-12 h-12 mb-4 text-primary opacity-50" />
                        <p>Initialize conversation...</p>
                    </div>
                )}

                {messages.map((m) => (
                    <MessageBubble key={m.id} role={m.role as "user" | "assistant"} content={m.content} />
                ))}

                {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                        System Error: {error.message}. Please retry.
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder={`Message ${employeeId}...`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
