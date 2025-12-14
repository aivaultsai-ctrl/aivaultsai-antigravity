"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Assuming we have these or custom components
import { Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { auth } from "../../../lib/firebase/config";

const FEATURES = [
    "Unlimited AI Employees",
    "Unlimited Messages",
    "Access to GPT-4o Model",
    "Priority Support",
    "Custom Knowledge Base"
];

export function UpgradeModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) return;

            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                body: JSON.stringify({ idToken })
            });

            const { url } = await res.json();
            window.location.href = url;
        } catch (e) {
            console.error(e);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-background border border-primary/20 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">✕</button>

                <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                    <p className="text-sm text-muted-foreground mt-2">Unlock the full power of your AI workforce.</p>
                </div>

                <div className="space-y-4 mb-8">
                    {FEATURES.map((f) => (
                        <div key={f} className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-sm text-foreground">{f}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? "Processing..." : "Upgrade Now - $49/mo"}
                    </button>
                    <p className="text-xs text-center text-muted-foreground">Cancel anytime. Secure checkout via Stripe.</p>
                </div>
            </div>
        </div>
    );
}
