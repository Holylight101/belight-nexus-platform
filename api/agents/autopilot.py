import os
import json
import asyncio
from typing import List, Dict, Literal, Optional
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

api_key = os.getenv("DASHSCOPE_API_KEY")
base_url = os.getenv("QWEN_BASE_URL")

client = OpenAI(api_key=api_key, base_url=base_url)

print("[AutopilotAgent] Engine loaded")

# --- Intent Classification System ---

AUTOPILOT_SYSTEM_PROMPT = """
You are Autopilot, the Lead AI Strategist inside BeLight Nexus AI.
You are the world's most intelligent business advisor for small and medium enterprises.

Your job is to understand a user's business situation, route to specialized sub-agents when needed,
combine their outputs, and deliver a strategic, actionable response.

You have access to three specialized agents:
1. RegulaBot — Compliance advisor. Knows regulations, compliance requirements, legal obligations.
2. ContractSense — Contract lawyer. Analyzes legal documents, finds risks, suggests negotiation moves.
3. GrantRadar — Grant strategist. Finds funding opportunities, scores matches, drafts applications.

When you receive a user message:
- Step 1: Classify the intent to determine which agents to call
- Step 2: Call the relevant agents (in parallel if multiple are needed)
- Step 3: Synthesize all agent outputs into a single strategic briefing
- Step 4: Prioritize actionable next steps with deadlines and owners

Your output must be structured, direct, and immediately useful. No filler. No generic advice.
"""

INTENT_CLASSIFICATION_PROMPT = """
Analyze the following user message and determine which of the available agents should be invoked.

Available agents:
- "regulabot" — for compliance, regulations, legal requirements, GDPR, data privacy, industry standards, licenses, permits
- "contractsense" — for contract review, legal document analysis, risk assessment, negotiation, terms and conditions, NDAs, vendor agreements
- "grantradar" — for grants, funding, grants discovery, fundraising, application drafting, nonprofit funding, government funding, venture funding, pitch decks
- "business" — for general business strategy, operations, marketing, growth, pricing, team building, product strategy

Respond ONLY with a JSON object in this exact format:
{
  "agents": ["agent_name"], // one or more from the list above
  "primary_intent": "short description of the main intent",
  "confidence": 0.0-1.0,
  "reason": "why these agents were selected"
}

User message: """

SYNTHESIS_PROMPT = """
You are Autopilot, the Lead AI Strategist at BeLight Nexus AI.

A user has asked: {user_message}

Based on the specialized agent outputs below, synthesize a world-class strategic response.

Rules:
1. Start with a 2-sentence executive summary
2. Include findings from each agent in a clear, labeled section
3. Prioritize 3-5 SPECIFIC, actionable next steps with realistic deadlines
4. Assign each action to a role (e.g., Founder, CTO, Legal Counsel, CFO)
5. Flag any risks or deadlines that require immediate attention
6. End with a one-sentence strategic takeaway

Agent Outputs:
{agent_outputs}

Respond ONLY in this JSON format:
{
  "executive_summary": "2-sentence summary of the situation",
  "agent_findings": [
    {"agent": "AgentName", "findings": "Key findings from this agent", "priority": "HIGH/MEDIUM/LOW"}
  ],
  "next_steps": [
    {"action": "What to do", "owner": "Role", "deadline": "When", "priority": "HIGH/MEDIUM/LOW"}
  ],
  "risks": ["Immediate risk 1", "Immediate risk 2"],
  "strategic_takeaway": "One sentence that summarizes the path forward",
  "metadata": {
    "agents_called": ["AgentName"],
    "confidence": 0.0-1.0
  }
}
"""


async def classify_intent(user_message: str) -> Dict:
    """Classify user intent to determine which agents to call."""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": "You are an intent classification engine. Respond only in JSON."},
                {"role": "user", "content": INTENT_CLASSIFICATION_PROMPT + user_message}
            ]
        )
        content = response.choices[0].message.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        return json.loads(content)
    except Exception as e:
        return {
            "agents": ["business"],
            "primary_intent": "general business inquiry",
            "confidence": 0.5,
            "reason": f"Classification failed: {str(e)}. Defaulting to general business advice."
        }


async def call_regulabot(business_context: str) -> Dict:
    """Call RegulaBot via internal logic."""
    from agents.regulabot import get_compliance_summary
    try:
        result = get_compliance_summary(business_context.get("business_name", ""), business_context.get("industry", ""))
        return {"agent": "RegulaBot", "output": result, "status": "success"}
    except Exception as e:
        return {"agent": "RegulaBot", "output": str(e), "status": "error"}


async def call_contractsense(contract_text: str, business_context: str) -> Dict:
    """Call ContractSense via internal logic."""
    from agents.contractsense import quick_review
    try:
        result = quick_review(contract_text)
        return {"agent": "ContractSense", "output": result, "status": "success"}
    except Exception as e:
        return {"agent": "ContractSense", "output": str(e), "status": "error"}


async def call_grantradar(business_context: Dict) -> Dict:
    """Call GrantRadar via internal logic."""
    from agents.grantradar import find_grants
    try:
        result = find_grants(
            business_context.get("org_name", ""),
            business_context.get("mission", ""),
            business_context.get("industry", ""),
            business_context.get("country", ""),
            business_context.get("size", "")
        )
        return {"agent": "GrantRadar", "output": result, "status": "success"}
    except Exception as e:
        return {"agent": "GrantRadar", "output": str(e), "status": "error"}


async def generate_business_response(user_message: str) -> Dict:
    """Generate a general business response when no specialized agents are needed."""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": AUTOPILOT_SYSTEM_PROMPT},
                {"role": "user", "content": f"Provide strategic business advice for: {user_message}"}
            ]
        )
        return {"agent": "Business", "output": response.choices[0].message.content, "status": "success"}
    except Exception as e:
        return {"agent": "Business", "output": str(e), "status": "error"}


async def synthesize(user_message: str, agent_results: List[Dict]) -> Dict:
    """Synthesize multiple agent outputs into a unified strategic response."""
    
    agent_outputs_text = "\n\n".join([
        f"=== {r['agent']} ===\nStatus: {r['status']}\nOutput: {json.dumps(r['output'], ensure_ascii=False) if isinstance(r['output'], dict) else str(r['output'])}"
        for r in agent_results
    ])
    
    try:
        response = client.chat.completions.create(
            model="qwen-max",
            messages=[
                {"role": "system", "content": "You are a world-class business strategist. Respond only in JSON."},
                {"role": "user", "content": SYNTHESIS_PROMPT.format(
                    user_message=user_message,
                    agent_outputs=agent_outputs_text
                )}
            ]
        )
        content = response.choices[0].message.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        return json.loads(content)
    except Exception as e:
        # Fallback: return a simple synthesis if JSON parsing fails
        return {
            "executive_summary": f"Analysis of: {user_message}",
            "agent_findings": [{"agent": r["agent"], "findings": str(r["output"])[:500], "priority": "MEDIUM"} for r in agent_results],
            "next_steps": [{"action": "Review agent outputs", "owner": "Founder", "deadline": "Today", "priority": "HIGH"}],
            "risks": ["Analysis was incomplete due to processing error"],
            "strategic_takeaway": "Please review the individual agent outputs for details.",
            "metadata": {
                "agents_called": [r["agent"] for r in agent_results],
                "confidence": 0.6,
                "error": str(e)
            }
        }


async def run_autopilot(
    user_message: str,
    business_context: Optional[Dict] = None
) -> Dict:
    """
    Main entry point for the Autopilot Agent.
    
    1. Classifies intent
    2. Calls relevant agents in parallel
    3. Synthesizes results
    4. Returns unified strategic briefing
    """
    
    business_context = business_context or {}
    
    # Step 1: Classify intent
    intent = await classify_intent(user_message)
    agents_to_call = intent.get("agents", ["business"])
    
    # Step 2: Call agents in parallel
    tasks = []
    
    if "regulabot" in agents_to_call:
        tasks.append(call_regulabot(business_context))
    if "contractsense" in agents_to_call:
        tasks.append(call_contractsense(user_message, business_context))
    if "grantradar" in agents_to_call:
        tasks.append(call_grantradar(business_context))
    if "business" in agents_to_call or not tasks:
        tasks.append(generate_business_response(user_message))
    
    agent_results = await asyncio.gather(*tasks)
    
    # Step 3: Synthesize
    synthesis = await synthesize(user_message, list(agent_results))
    
    # Step 4: Build response
    return {
        "autopilot_response": {
            "intent_detected": intent.get("primary_intent", "general"),
            "agents_called": intent.get("agents", []),
            "confidence": intent.get("confidence", 0.5),
            "reason": intent.get("reason", ""),
            **synthesis
        },
        "raw_agents": {
            r["agent"]: {"output": r["output"], "status": r["status"]}
            for r in agent_results
        }
    }
