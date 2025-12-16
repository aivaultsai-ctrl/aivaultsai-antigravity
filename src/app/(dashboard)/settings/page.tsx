"use client";

import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function SettingsPage() {
    return (
        <>
            <DashboardHeader title="Settings" />
            <div className="p-8">
                <div className="max-w-xl space-y-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">Workspace Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground">Always active on AIVaults.</p>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative">
                                    <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Notifications</p>
                                    <p className="text-xs text-muted-foreground">Email alerts for new leads.</p>
                                </div>
                                <div className="h-6 w-11 bg-white/10 rounded-full relative">
                                    <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/50 shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">Billing</h3>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">Free Plan Active</p>
                                <p className="text-xs text-muted-foreground mt-1">Upgrade to deploy more agents.</p>
                            </div>
                            <button className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-md transition-colors">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
