"use client";
import { useState } from "react";
import { API_URL } from "@/lib/api";

interface AgentStep {
  name: string;
  status: "waiting" | "running" | "done" | "error";
  output?: string;
}

export default function AutopilotPage() {
  const [message, setMessage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<AgentStep[]>([]);

  const runAutopilot = async () => {
    if (!message) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/autopilot/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          business_context: {
            business_name: businessName,
            industry,
            country,
          },
        }),
      });
      const data = await res.json();

      if (data.autopilot_response) {
        setResult(data.autopilot_response);
        const called = data.autopilot_response.agents_called || [];
        setSteps(
          called.map((agent: string) => ({
            name: agent,
            status: "done" as const,
            output: data.raw_agents?.[agent]?.status === "success" ? "Success" : "Error",
          }))
        );
      } else {
        setError("Unexpected response format from Autopilot.");
      }
    } catch (e) {
      setError("Failed to connect to Autopilot. Make sure your API is running.");
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "I just started a fintech in Singapore. What regulations do I need to comply with and are there any grants I can apply for?",
    "Review this contract and check if our business needs any new compliance measures.",
    "My nonprofit focuses on education tech in Nigeria. Find grants and draft an executive summary.",
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          🤖 Autopilot Agent
        </h1>
        <p className="text-gray-400 mt-2">
          Your intelligent business strategist. Autopilot orchestrates RegulaBot, ContractSense, and GrantRadar to deliver unified strategic advice.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Business Name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="BeLight Nexus AI"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Industry</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Technology / SaaS"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Country</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Singapore"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            What do you need help with?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your business situation, challenge, or question..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setMessage(prompt)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-2 rounded-lg transition-colors"
            >
              {prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt}
            </button>
          ))}
        </div>

        <button
          onClick={runAutopilot}
          disabled={loading || !message}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Autopilot is strategizing..." : "🚀 Run Autopilot Analysis"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Agent Orchestration</h2>
          <div className="space-y-3">
            {steps.length === 0 ? (
              <p className="text-gray-400 text-sm">Classifying intent...</p>
            ) : (
              steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      step.status === "done"
                        ? "bg-green-400"
                        : step.status === "error"
                        ? "bg-red-400"
                        : "bg-amber-400 animate-pulse"
                    }`}
                  />
                  <span className="text-white text-sm font-medium">
                    {step.name}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {step.status === "done" ? "✅" : step.status === "error" ? "❌" : "⏳"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">
                Executive Summary
              </h2>
              <span className="bg-amber-900/50 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                Confidence: {Math.round(result.metadata?.confidence * 100)}%
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {result.executive_summary}
            </p>
          </div>

          {result.agent_findings && result.agent_findings.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">
                Agent Findings
              </h2>
              <div className="space-y-3">
                {result.agent_findings.map((finding: any, i: number) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{finding.agent}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          finding.priority === "HIGH"
                            ? "bg-red-900/50 text-red-400"
                            : finding.priority === "MEDIUM"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-green-900/50 text-green-400"
                        }`}
                      >
                        {finding.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{finding.findings}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.next_steps && result.next_steps.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">
                Action Plan
              </h2>
              <div className="space-y-3">
                {result.next_steps.map((step: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-800 rounded-xl p-4 border-l-4 border-amber-500"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{step.action}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          step.priority === "HIGH"
                            ? "bg-red-900/50 text-red-400"
                            : step.priority === "MEDIUM"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-green-900/50 text-green-400"
                        }`}
                      >
                        {step.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-gray-700 rounded-lg px-2 py-1 text-gray-300">
                        Owner: {step.owner}
                      </span>
                      <span className="bg-gray-700 rounded-lg px-2 py-1 text-gray-300">
                        Deadline: {step.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.risks && result.risks.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">⚠️ Risks</h2>
              <div className="space-y-2">
                {result.risks.map((risk: string, i: number) => (
                  <div key={i} className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.strategic_takeaway && (
            <div className="bg-amber-900/30 border border-amber-700 rounded-2xl p-6">
              <p className="text-amber-300 font-medium">
                💡 {result.strategic_takeaway}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
