"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../lib/firebase/config";
import { createUserDocument } from "../../../lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            const displayName = `${firstName} ${lastName}`.trim();
            await updateProfile(user, { displayName });

            await createUserDocument(user, { displayName });

            router.push("/dashboard");
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(err);
            setError(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[100px] rounded-full -z-10" />

            <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Initialize Workspace</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Deploy your first AI employee today.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <input
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                                placeholder="Alice"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <input
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                                placeholder="Smith"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Work Email</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-10 bg-primary hover:bg-primary/90 rounded-md font-medium text-primary-foreground transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Workspace"}
                    </button>

                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="font-semibold text-primary hover:text-primary/80">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
