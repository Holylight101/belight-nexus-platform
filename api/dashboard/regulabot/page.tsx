"use client";
import { useState } from "react";

export default function RegulaBot() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!businessName || !industry) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/regulabot/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: businessName, industry }),
      });
      const data = await res.json();
      const parsed = typeof data.summary === "string"
        ? JSON.parse(data.summary)
        : data.summary;
      setResult(parsed);
    } catch (e) {
      setError("Failed to connect to RegulaBot. Make sure your API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          ⚖️ RegulaBot
        </h1>
        <p className="text-gray-400 mt-2">
          Get your compliance checklist instantly
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="BeLight Nexus AI"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Industry
            </label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Technology / SaaS"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={analyze}
          disabled={loading || !businessName || !industry}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "RegulaBot is analyzing..." : "Generate Compliance Checklist"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Analysis</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.impact_level === "HIGH"
                  ? "bg-red-900/50 text-red-400"
                  : result.impact_level === "MEDIUM"
                  ? "bg-yellow-900/50 text-yellow-400"
                  : "bg-green-900/50 text-green-400"
              }`}>
                {result.impact_level} IMPACT
              </span>
            </div>
            <p className="text-gray-300">{result.summary}</p>
          </div>

          {/* Action Items */}
          {result.action_items && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">
                Action Items
              </h2>
              <div className="space-y-3">
                {result.action_items.map((item: any, i: number) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.priority === "HIGH"
                          ? "bg-red-900/50 text-red-400"
                          : item.priority === "MEDIUM"
                          ? "bg-yellow-900/50 text-yellow-400"
                          : "bg-green-900/50 text-green-400"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    {item.deadline && (
                      <p className="text-blue-400 text-xs mt-2">
                        📅 {item.deadline}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaway */}
          {result.key_takeaway && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-6">
              <p className="text-blue-300 font-medium">
                💡 {result.key_takeaway}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}