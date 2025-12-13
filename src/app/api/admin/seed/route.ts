import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/prompts";

export const runtime = 'nodejs'; // Use node runtime for admin SDK

export async function POST(req: Request) {
    // Simple protection: check for a secret header or allow dev mode
    // For now, this is an internal utility.

    try {
        const batch = adminDb.batch();

        for (const emp of DEFAULT_EMPLOYEES) {
            const ref = adminDb.collection("ai_employees").doc(emp.role); // Use role as ID for simplicity
            batch.set(ref, {
                ...emp,
                updatedAt: new Date(),
                active: true
            }, { merge: true });
        }

        await batch.commit();

        return NextResponse.json({ success: true, message: "Employees seeded successfully." });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
