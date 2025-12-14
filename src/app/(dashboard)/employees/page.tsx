"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Plus, Trash2, Edit, Bot } from "lucide-react";
import { db } from "../../../lib/firebase/config";
import { collection, onSnapshot, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/prompts";
import { UpgradeModal } from "@/components/features/billing/UpgradeModal";
import { useAuth } from "@/lib/context/UserContext";

export default function EmployeesPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Real-time listener
        const unsubscribe = onSnapshot(collection(db, "ai_employees"), (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setEmployees(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const hireDefault = async () => {
        if (!user) return;

        // Check Subscription Tier
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const tier = userDoc.data()?.billing?.tier || "free";

        if (tier === "free") {
            setShowUpgrade(true);
            return;
        }

        // Allowed to hire
        const emp = DEFAULT_EMPLOYEES[0];
        await addDoc(collection(db, "ai_employees"), {
            ...emp,
            name: emp.name + " (Copy)",
            createdAt: new Date(),
            ownerId: user.uid
        });
    };

    const fireEmployee = async (id: string) => {
        if (confirm("Are you sure you want to terminate this AI employee?")) {
            await deleteDoc(doc(db, "ai_employees", id));
        }
    };

    return (
        <>
            <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
            <Header title="AI Workforce" />
            <div className="p-8">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium text-white">Active Units ({employees.length})</h2>
                    <button
                        onClick={hireDefault}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Hire New Employee
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Syncing neural network...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp) => (
                            <div key={emp.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{emp.name}</h3>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => fireEmployee(emp.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {emp.description || "No description provided."}
                                </p>

                                <div className="mt-auto pt-4 flex gap-2">
                                    <Link href={`/chat?employeeId=${emp.id}`} className="flex-1 h-9 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white flex items-center justify-center border border-white/5 transition-colors">
                                        Open Chat
                                    </Link>
                                    <button className="flex-1 h-9 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white flex items-center justify-center border border-white/5 transition-colors">
                                        Settings
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
