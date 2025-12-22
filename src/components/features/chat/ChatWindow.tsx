"use client";

import { useChat } from "@ai-sdk/react";
import { MessageBubble } from "./MessageBubble";
import { Send, Sparkles, Loader2, StopCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    employeeId?: string;
    initialMessage?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1s

export default function ChatWindow({ employeeId = "sales", initialMessage }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    // Custom error state to handle transient vs permanent errors
    const [customError, setCustomError] = useState<string | null>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, error, reload } = useChat({
        api: "/api/ai/chat",
        body: { employeeId },
        initialMessages: initialMessage ? [{ id: "init", role: "assistant", content: initialMessage }] : [],
        maxSteps: 5, // Enable multi-step tools
        onError: (err) => {
            console.error("Chat Error:", err);
            setCustomError(err.message || "Connection failed");

            // Auto-retry logic for specific errors or generic failures
            if (retryCount < MAX_RETRIES && !isLoading) {
                const timeout = Math.pow(2, retryCount) * RETRY_DELAY_BASE;
                console.log(`Auto-retrying in ${timeout}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

                setIsRetrying(true);
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    reload().catch(e => {
                        console.error("Retry failed:", e);
                        setIsRetrying(false);
                    });
                    setIsRetrying(false);
                }, timeout);
            }
        },
        onFinish: () => {
            // Reset retry count on success
            setRetryCount(0);
            setCustomError(null);
            setIsRetrying(false);
        }
    });

    // Smart Auto-scroll: Only scroll if already near bottom or new message is from user
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            scrollRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: "smooth"
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleManualRetry = () => {
        setRetryCount(0);
        setCustomError(null);
        reload();
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {/* Header */}
            <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-white/5 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 w-2 rounded-full animate-pulse",
                        customError ? "bg-red-500" : (isLoading || isRetrying) ? "bg-blue-500" : "bg-emerald-500"
                    )} />
                    <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                        {employeeId.toUpperCase()} UNIT
                        {retryCount > 0 && isRetrying && <span className="text-xs text-muted-foreground">(Retrying...)</span>}
                    </span>
                </div>
                {(isLoading || isRetrying) && (
                    <button onClick={() => stop()} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors font-medium">
                        <StopCircle className="w-3 h-3" /> STOP
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-black/10">
                {messages.length === 0 && !customError && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 select-none animation-fade-in">
                        <Sparkles className="w-12 h-12 mb-4 text-primary opacity-50" />
                        <p>System Online. Initialize conversation...</p>
                    </div>
                )}

                {messages.map((m) => (
                    <MessageBubble key={m.id} role={m.role as "user" | "assistant"} content={m.content} />
                ))}

                {/* Loading Indicator inside chat flow */}
                {(isLoading || isRetrying) && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isRetrying ? "Re-establishing connection..." : "Processing..."}</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {customError && !isLoading && !isRetrying && (
                    <div className="flex flex-col items-center gap-2 p-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center max-w-md">
                            <div className="flex items-center justify-center gap-2 mb-1 font-semibold">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Transmission Failed</span>
                            </div>
                            {customError}
                        </div>
                        <button
                            onClick={handleManualRetry}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md text-sm transition-colors shadow-lg shadow-primary/20"
                        >
                            <RefreshCw className="w-4 h-4" /> Retry Message
                        </button>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl z-20">
                <form onSubmit={(e) => {
                    // Prevent submit if already loading to avoid state conflicts
                    if (isLoading || isRetrying) {
                        e.preventDefault();
                        return;
                    }
                    handleSubmit(e);
                }} className="relative flex items-center group">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder={customError ? "Resolve error to continue..." : `Message ${employeeId}...`}
                        disabled={isLoading || isRetrying}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isRetrying || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary-hover rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white shadow-md active:scale-95"
                    >
                        {isLoading || isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
