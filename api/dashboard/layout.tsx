"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "RegulaBot",
    href: "/dashboard/regulabot",
    icon: "⚖️",
    description: "Compliance Monitor"
  },
  {
    name: "ContractSense",
    href: "/dashboard/contractsense",
    icon: "📄",
    description: "Contract Analyzer"
  },
  {
    name: "GrantRadar",
    href: "/dashboard/grantradar",
    icon: "💰",
    description: "Grant Discovery"
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">BeLight Nexus</h1>
          <p className="text-xs text-gray-400 mt-1">AI Platform v1.0</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs opacity-70">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-xs text-gray-400">All agents online</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}