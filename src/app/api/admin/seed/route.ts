import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/employee-prompts";

export const runtime = 'nodejs';

/**
 * SEED ROUTE: Idempotent provisioning for AI Employees.
 * Triggered manually or during deployment to ensure Firestore is in sync with Code.
 */
export async function POST(req: Request) {
    try {
        const batch = adminDb.batch();
        const timestamp = new Date();
        const seededIds: string[] = [];

        for (const emp of DEFAULT_EMPLOYEES) {
            // Using a deterministic ID based on role to prevent duplicates
            const docId = emp.role;
            const ref = adminDb.collection("ai_employees").doc(docId);

            batch.set(ref, {
                ...emp,
                id: docId,
                updatedAt: timestamp,
                active: true,
                isSystemDefault: true
            }, { merge: true });

            seededIds.push(docId);
        }

        // Log the seeding event for traceability
        const logRef = adminDb.collection("system_logs").doc("seeding_history");
        batch.set(logRef, {
            lastRun: timestamp,
            seededEmployees: seededIds,
            status: "success"
        }, { merge: true });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: "Employees seeded successfully.",
            data: {
                count: seededIds.length,
                ids: seededIds,
                timestamp: timestamp.toISOString()
            }
        });
    } catch (error: any) {
        console.error("[SEED_ERROR]:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
