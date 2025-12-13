import { cn } from "@/lib/utils";
import { User, Bot, Sparkles } from "lucide-react";

interface MessageBubbleProps {
    role: "user" | "assistant" | "system" | "data"; // Vercel AI SDK types
    content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[80%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>

                {/* Avatar */}
                <div className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border",
                    isUser ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-white/10 text-muted-foreground"
                )}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                    "rounded-2xl px-4 py-2 text-sm shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 border border-white/10 text-foreground backdrop-blur-sm"
                )}>
                    {/* Simple markdown rendering could go here, for now raw text */}
                    <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
                </div>

            </div>
        </div>
    );
}
