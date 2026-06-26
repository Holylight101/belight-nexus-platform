"use client";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ContractSensePage() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contractText, setContractText] = useState("");
  const [mode, setMode] = useState<"full" | "quick">("full");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!contractText) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const endpoint = mode === "full" ? "analyze" : "quick-review";
      const body = mode === "full"
        ? JSON.stringify({ contract_text: contractText, business_name: businessName, industry })
        : JSON.stringify({ contract_text: contractText });

      const res = await fetch(`${API_URL}/contractsense/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to connect to ContractSense. Make sure your API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">📄 ContractSense</h1>
        <p className="text-gray-400 mt-2">AI-powered contract risk analysis and negotiation intelligence</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Business Name</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="BeLight Nexus AI" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Industry</label>
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology / SaaS" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Contract Text</label>
          <textarea value={contractText} onChange={(e) => setContractText(e.target.value)} rows={8} placeholder="Paste your contract text here..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
        </div>
        <div className="flex gap-3 mb-4">
          <button onClick={() => setMode("full")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "full" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>Full Analysis</button>
          <button onClick={() => setMode("quick")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "quick" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>Quick Review</button>
        </div>
        <button onClick={analyze} disabled={loading || !contractText} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
          {loading ? "ContractSense is analyzing..." : mode === "full" ? "Analyze Contract" : "Quick Review"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && mode === "quick" && result.quick_review && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Quick Review</h2>
          <div className="text-gray-300 whitespace-pre-wrap">{result.quick_review}</div>
        </div>
      )}

      {result && mode === "full" && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">{result.contract_type || "Contract Analysis"}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.overall_risk === "HIGH" ? "bg-red-900/50 text-red-400" : result.overall_risk === "MEDIUM" ? "bg-yellow-900/50 text-yellow-400" : "bg-green-900/50 text-green-400"}`}>
                {result.overall_risk} RISK
              </span>
            </div>
            <p className="text-gray-300 mb-4">{result.summary}</p>
            {result.parties && (
              <div className="flex flex-wrap gap-2">
                {result.parties.map((p: string, i: number) => (
                  <span key={i} className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300">{p}</span>
                ))}
              </div>
            )}
          </div>

          {result.key_clauses && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Key Clauses</h2>
              <div className="space-y-3">
                {result.key_clauses.map((clause: any, i: number) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{clause.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${clause.risk_level === "HIGH" ? "bg-red-900/50 text-red-400" : clause.risk_level === "MEDIUM" ? "bg-yellow-900/50 text-yellow-400" : "bg-green-900/50 text-green-400"}`}>
                        {clause.risk_level} RISK
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{clause.content}</p>
                    <p className="text-red-400 text-sm">⚠️ {clause.risk_explanation}</p>
                    <p className="text-purple-400 text-sm mt-2">💡 {clause.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.red_flags && result.red_flags.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Red Flags</h2>
              <div className="space-y-3">
                {result.red_flags.map((flag: any, i: number) => (
                  <div key={i} className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{flag.flag}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${flag.severity === "CRITICAL" ? "bg-red-900/50 text-red-400" : "bg-yellow-900/50 text-yellow-400"}`}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{flag.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.negotiation_tips && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Negotiation Tips</h2>
              <ul className="list-disc list-inside space-y-2">
                {result.negotiation_tips.map((tip: string, i: number) => (
                  <li key={i} className="text-gray-300 text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {result.key_takeaway && (
            <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-6">
              <p className="text-purple-300 font-medium">💡 {result.key_takeaway}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
