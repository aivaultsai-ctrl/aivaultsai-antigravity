"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { db } from "../../../lib/firebase/config";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for leads
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setLeads(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            <DashboardHeader title="Lead Pipeline" />
            <div className="p-8">
                <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
                    <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                        <h3 className="text-sm font-medium text-white">Recent Captures</h3>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">Loading pipeline data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-black/20">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Interest</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                No leads captured yet. Start a chat with the Sales Agent.
                                            </td>
                                        </tr>
                                    )}
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{lead.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-semibold border",
                                                    lead.interestLevel === "high" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        lead.interestLevel === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                            "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                                )}>
                                                    {lead.interestLevel || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground capitalize">{lead.status}</td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
