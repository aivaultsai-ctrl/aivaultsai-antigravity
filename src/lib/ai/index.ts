import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { generateText, tool } from "ai";
import { adminDb } from "../firebase/admin";
import { AIEmployee } from "./types";

// Initialize the provider
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// NOTE: Tool definitions and runAIEmployee function commented out temporarily
// These need refactoring for AI SDK v6 compatibility
// The tool() function signature and CoreMessage type have changed
// Uncomment and update when needed for background job processing

/* DISABLED FOR BUILD - NEEDS AI SDK v6 REFACTORING
export const tools = {
    create_lead_entry: tool({
        description: "Save a new lead to the CRM database.",
        parameters: z.object({
            name: z.string().describe("The name of the lead"),
            email: z.string().email().describe("The email address"),
            company: z.string().optional().describe("Company name"),
            interestLevel: z.enum(["low", "medium", "high"]).describe("Estimated interest"),
        }),
        execute: async ({ name, email, company, interestLevel }) => {
            try {
                const ref = await adminDb.collection("leads").add({
                    name,
                    email,
                    company: company || "Unknown",
                    interestLevel,
                    createdAt: new Date(),
                    status: "new"
                });
                return { success: true, leadId: ref.id, message: "Lead captured successfully." };
            } catch (error) {
                return { success: false, message: "Failed to save lead." };
            }
        },
    }),
    search_knowledge_base: tool({
        description: "Search internal docs for pricing or features.",
        parameters: z.object({
            query: z.string().describe("The search query"),
        }),
        execute: async ({ query }) => {
            return {
                results: [
                    "Pricing: Free (0), Pro ($49), Enterprise ($499).",
                    "Features: AI Chat, Lead Gen, Auto-Scheduling.",
                ]
            };
        },
    }),
    escalate_to_human: tool({
        description: "Flag this conversation for human review.",
        parameters: z.object({
            reason: z.string().describe("Why human intervention is needed"),
        }),
        execute: async ({ reason }) => {
            return { assignedTo: "Human Support Team", ticketId: "TKT-" + Math.floor(Math.random() * 10000) };
        },
    }),
};

export async function runAIEmployee(
    employee: AIEmployee,
    messages: Array<{ role: string; content: string }>
) {
    const activeTools = Object.fromEntries(
        Object.entries(tools).filter(([key]) => employee.tools.includes(key))
    );

    const result = await generateText({
        model: google("gemini-1.5-pro-latest"),
        system: employee.systemPrompt,
        messages,
        tools: activeTools,
    });

    return result;
}
*/
