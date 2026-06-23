"use client";
import Link from "next/link";

const agents = [
  {
    name: "RegulaBot",
    icon: "⚖️",
    description: "Monitor regulations, detect changes, get action checklists automatically.",
    href: "/dashboard/regulabot",
    color: "from-blue-600 to-blue-800",
    stat: "Live compliance monitoring",
  },
  {
    name: "ContractSense",
    icon: "📄",
    description: "Upload any contract and get instant risk analysis, red flags, and negotiation tips.",
    href: "/dashboard/contractsense",
    color: "from-purple-600 to-purple-800",
    stat: "AI-powered contract review",
  },
  {
    name: "GrantRadar",
    icon: "💰",
    description: "Discover grants matched to your mission with AI-drafted application sections.",
    href: "/dashboard/grantradar",
    color: "from-green-600 to-green-800",
    stat: "$485K found for BeLight",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Welcome to BeLight Nexus AI
        </h1>
        <p className="text-gray-400 mt-2">
          Your intelligent business platform. Three agents. One mission.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {agents.map((agent) => (
          <Link key={agent.name} href={agent.href}>
            <div className={`bg-gradient-to-br ${agent.color} p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform`}>
              <div className="text-4xl mb-4">{agent.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2">
                {agent.name}
              </h2>
              <p className="text-white/80 text-sm mb-4">
                {agent.description}
              </p>
              <div className="bg-white/20 rounded-lg px-3 py-1 inline-block">
                <span className="text-white text-xs font-medium">
                  {agent.stat}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-3 gap-4">
          {["RegulaBot", "ContractSense", "GrantRadar"].map((agent) => (
            <div key={agent} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"/>
              <div>
                <p className="text-white text-sm font-medium">{agent}</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}