import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { CoreMessage, generateText, tool } from "ai";
import { adminDb } from "../firebase/admin";
import { AIEmployee } from "./types";

// Initialize the provider
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// Tool Definitions
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
            // In a real scenario, check auth context here or pass it in
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
            // Mock search for now
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
            // Log to a specialized collection
            return { assignedTo: "Human Support Team", ticketId: "TKT-" + Math.floor(Math.random() * 10000) };
        },
    }),
};

// Main Agent Runner for Server-Side calls (Non-Streaming)
// Useful for background jobs
export async function runAIEmployee(
    employee: AIEmployee,
    messages: CoreMessage[]
) {
    // Filter tools based on employee permissions
    const activeTools = Object.fromEntries(
        Object.entries(tools).filter(([key]) => employee.tools.includes(key))
    );

    const result = await generateText({
        model: google("gemini-1.5-pro-latest"),
        system: employee.systemPrompt,
        messages,
        tools: activeTools,
        maxSteps: 5, // Allow multi-step reasoning
    });

    return result;
}
