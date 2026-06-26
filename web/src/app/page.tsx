"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-sm font-bold">B</div>
              <span className="text-xl font-bold">BeLight Nexus AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
              <Link href="/dashboard/autopilot" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Try Autopilot</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700 rounded-full px-4 py-1.5 text-sm text-amber-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Track 4 Hackathon — Autopilot Agent
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            One AI Platform.
            <br />
            <span className="text-amber-400">Infinite Business Intelligence.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Autopilot orchestrates Compliance, Contracts, and Grants — so you focus on growing your business, not drowning in paperwork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/autopilot" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors w-full sm:w-auto text-center">
              🚀 Launch Autopilot
            </Link>
            <Link href="/dashboard" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors w-full sm:w-auto text-center">
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Four Agents. One Mission.</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Each agent is a world-class specialist. Autopilot combines them into a unified strategic advisor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🤖", name: "Autopilot", desc: "Orchestrates all agents. Classifies intent, routes tasks, synthesizes strategy.", color: "from-amber-600 to-amber-800" },
              { icon: "⚖️", name: "RegulaBot", desc: "Compliance monitoring. Detects regulatory changes and generates action checklists.", color: "from-blue-600 to-blue-800" },
              { icon: "📄", name: "ContractSense", desc: "Contract risk analysis. Finds red flags, scores risk, suggests negotiation moves.", color: "from-purple-600 to-purple-800" },
              { icon: "💰", name: "GrantRadar", desc: "Grant discovery + drafting. Matches your mission to funding opportunities.", color: "from-green-600 to-green-800" },
            ].map((agent) => (
              <div key={agent.name} className={`bg-gradient-to-br ${agent.color} p-6 rounded-2xl hover:scale-105 transition-transform`}>
                <div className="text-4xl mb-4">{agent.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-white/80 text-sm">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Autopilot Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Describe Your Situation", desc: "Tell Autopilot what you're working on. A sentence or two is all it needs." },
              { step: "02", title: "Agents Orchestrate", desc: "Autopilot classifies your intent and calls the right specialists in parallel." },
              { step: "03", title: "Get Strategic Advice", desc: "Receive a unified briefing with findings, action plan, and risk flags." },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="text-4xl font-bold text-amber-500 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work Smarter?</h2>
          <p className="text-gray-400 mb-8">Join the businesses using BeLight Nexus AI to automate compliance, analyze contracts, and discover grants.</p>
          <Link href="/dashboard/autopilot" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors inline-block">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-xs font-bold">B</div>
            <span className="text-sm font-semibold">BeLight Nexus AI</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 BeLight Nexus. Built for the world.</p>
        </div>
      </footer>
    </div>
  );
}
