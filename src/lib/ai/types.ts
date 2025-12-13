export type AIRole = "sales" | "support" | "lead_gen" | "analyst";

export interface AIEmployee {
    id: string;
    name: string;
    role: AIRole;
    description: string;
    systemPrompt: string;
    tools: string[];
    avatarUrl?: string;
    isCustom?: boolean;
}

export const TOOLS = {
    SEARCH_KNOWLEDGE: "search_knowledge_base",
    CREATE_LEAD: "create_lead_entry",
    SCHEDULE_MEETING: "schedule_calendar_meeting",
    ESCALATE_HUMAN: "escalate_to_human",
} as const;
