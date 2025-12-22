import { Plus, MoreVertical, Activity, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ChatbotsDashboard() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Workforce Overview</h1>
                        <p className="text-[#9CA3AF]">Manage your deployed AI employees.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /> Deploy New Employee
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Total Conversations" value="1,284" change="+12.5%" icon={<MessageSquare className="w-5 h-5 text-[#3B82F6]" />} />
                    <StatCard label="Active Leads Captured" value="86" change="+4.2%" icon={<Users className="w-5 h-5 text-[#10B981]" />} />
                    <StatCard label="Avg. Response Time" value="0.8s" change="-10%" icon={<Activity className="w-5 h-5 text-[#8B5CF6]" />} />
                </div>

                {/* Employees List */}
                <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#1F2937] flex justify-between items-center bg-[#1F2937]/30">
                        <h2 className="font-semibold text-[#E5E7EB]">Active Employees</h2>
                    </div>
                    <div>
                        {employees.map((emp) => (
                            <div key={emp.id} className="px-6 py-4 border-b border-[#1F2937] last:border-0 hover:bg-[#1F2937]/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center border border-[#374151]">
                                        <span className="text-lg">{emp.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[#E5E7EB]">{emp.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                                            <span>{emp.role}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Online
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm text-[#E5E7EB]">{emp.conversations} chats</div>
                                        <div className="text-xs text-[#9CA3AF]">this week</div>
                                    </div>
                                    <button className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#374151] rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, icon }: any) {
    return (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-xl hover:border-[#374151] transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#1F2937] rounded-lg border border-[#374151]">{icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                    {change}
                </span>
            </div>
            <div className="text-2xl font-bold text-[#E5E7EB] mb-1">{value}</div>
            <div className="text-sm text-[#9CA3AF]">{label}</div>
        </div>
    )
}

const employees = [
    { id: 1, name: "Sarah - Sales Lead", role: "Lead Qualification", icon: "👩‍💼", conversations: 542 },
    { id: 2, name: "TechBot 9000", role: "Technical Support", icon: "🤖", conversations: 128 },
    { id: 3, name: "Onboarding Guide", role: "Customer Success", icon: "🎓", conversations: 89 },
]
