"use client";

import ChatWindow from "../../../components/features/chat/ChatWindow";
import { DEFAULT_EMPLOYEES } from "../../../lib/ai/employee-prompts";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
    const [selectedEmp, setSelectedEmp] = useState(DEFAULT_EMPLOYEES[0].role);

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Selector */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {DEFAULT_EMPLOYEES.map((emp) => (
                    <button
                        key={emp.role}
                        onClick={() => setSelectedEmp(emp.role)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap",
                            selectedEmp === emp.role
                                ? "bg-primary border-primary text-white shadow-[0_0_15px_-3px_var(--primary)]"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                        )}
                    >
                        {emp.name} ({emp.role})
                    </button>
                ))}
            </div>

            {/* Window */}
            <div className="flex-1 min-h-0">
                <ChatWindow key={selectedEmp} employeeId={selectedEmp} />
            </div>
        </div>
    );
}
