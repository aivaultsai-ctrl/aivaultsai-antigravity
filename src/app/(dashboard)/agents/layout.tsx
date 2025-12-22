import { ReactNode } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Cpu,
    Briefcase,
    Zap
} from 'lucide-react';

export default function AgentsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-[#0F172A] text-white font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-black">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-xl flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="h-16 flex items-center px-6 border-b border-white/5">
                        <span className="font-bold text-xl tracking-tight flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-[#00e0ff]" />
                            AIVaults
                            <span className="text-[10px] bg-[#00e0ff]/10 text-[#00e0ff] px-1.5 py-0.5 rounded border border-[#00e0ff]/20">PRO</span>
                        </span>
                    </div>

                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">My Agents</h3>
                            <nav className="space-y-1">
                                <SidebarLink href="/agents" icon={<Briefcase />} label="Business Assistant" active />
                                <SidebarLink href="/agents?type=automation" icon={<Zap />} label="Automation Agent" />
                                <SidebarLink href="/agents?type=content" icon={<MessageSquare />} label="Content Creator" />
                            </nav>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Workspace</h3>
                            <nav className="space-y-1">
                                <SidebarLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard Overview" />
                                <SidebarLink href="/settings" icon={<Settings />} label="Settings" />
                                <SidebarLink href="/employees" icon={<Users />} label="Team Access" />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors w-full rounded-lg hover:bg-white/5">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {children}
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: any) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                ? 'bg-[#00e0ff]/10 text-[#00e0ff] border border-[#00e0ff]/20 shadow-[0_0_15px_-5px_#00e0ff50]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            <span className={`w-5 h-5 ${active ? 'text-[#00e0ff]' : 'text-gray-500'}`}>{icon}</span>
            {label}
        </Link>
    )
}
