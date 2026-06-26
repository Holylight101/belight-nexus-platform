"use client";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function GrantRadarPage() {
  const [orgName, setOrgName] = useState("");
  const [mission, setMission] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const [draftGrant, setDraftGrant] = useState("");
  const [draftSection, setDraftSection] = useState("Executive Summary");
  const [draftResult, setDraftResult] = useState<any>(null);
  const [draftLoading, setDraftLoading] = useState(false);

  const findGrants = async () => {
    if (!orgName || !mission || !industry || !country || !size) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/grantradar/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_name: orgName, mission, industry, country, size }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to connect to GrantRadar. Make sure your API is running.");
    } finally {
      setLoading(false);
    }
  };

  const draftSectionFn = async () => {
    if (!draftGrant || !orgName || !mission) return;
    setDraftLoading(true);
    setDraftResult(null);

    try {
      const res = await fetch(`${API_URL}/grantradar/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant_title: draftGrant, org_name: orgName, mission, section: draftSection }),
      });
      const data = await res.json();
      setDraftResult(data);
    } catch (e) {
      setError("Failed to draft section. Make sure your API is running.");
    } finally {
      setDraftLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">💰 GrantRadar</h1>
        <p className="text-gray-400 mt-2">Discover and win grants matched to your mission</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Organization Name</label>
            <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="BeLight Nexus Foundation" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Mission</label>
            <input value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Empower small businesses with AI tools" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Industry</label>
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology / Education" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Country</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Singapore" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
          </div>
          <div className="col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">Organization Size</label>
            <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="1-10 employees, 11-50, 51-200, 200+" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <button onClick={findGrants} disabled={loading || !orgName || !mission || !industry || !country || !size} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
          {loading ? "GrantRadar is scanning..." : "Find Matching Grants"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Organization Assessment</h2>
              <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm font-medium">{result.total_grants_found} Grants Found</span>
            </div>
            <p className="text-gray-300 mb-4">{result.organization_assessment}</p>
            <p className="text-green-400 text-sm font-medium">Estimated Total Funding: {result.estimated_total_funding}</p>
          </div>

          {result.grants && (
            <div className="space-y-4">
              {result.grants.map((grant: any, i: number) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{grant.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${grant.match_score >= 80 ? "bg-green-900/50 text-green-400" : grant.match_score >= 60 ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}>
                      {grant.match_score}% Match
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Funder: {grant.funder}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300">Amount: {grant.amount}</span>
                    <span className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300">Deadline: {grant.deadline}</span>
                    <span className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300">Category: {grant.category}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{grant.match_reason}</p>
                  <p className="text-green-400 text-sm">💡 {grant.application_tip}</p>
                  {grant.url && (
                    <a href={grant.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm underline mt-2 inline-block">Apply here</a>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.top_recommendation && (
            <div className="bg-green-900/30 border border-green-700 rounded-2xl p-6">
              <p className="text-green-300 font-medium">🏆 Top Recommendation: {result.top_recommendation}</p>
            </div>
          )}

          {result.key_takeaway && (
            <div className="bg-green-900/30 border border-green-700 rounded-2xl p-6">
              <p className="text-green-300 font-medium">💡 {result.key_takeaway}</p>
            </div>
          )}

          {/* Draft Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Draft Application Section</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Grant Title</label>
                <input value={draftGrant} onChange={(e) => setDraftGrant(e.target.value)} placeholder="Select a grant from above" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Section</label>
                <select value={draftSection} onChange={(e) => setDraftSection(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500">
                  <option>Executive Summary</option>
                  <option>Project Description</option>
                  <option>Budget Justification</option>
                  <option>Organization Background</option>
                  <option>Impact Statement</option>
                </select>
              </div>
            </div>
            <button onClick={draftSectionFn} disabled={draftLoading || !draftGrant} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
              {draftLoading ? "Drafting..." : `Draft ${draftSection}`}
            </button>
          </div>

          {draftResult && draftResult.draft && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Draft: {draftResult.section}</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{draftResult.draft}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
