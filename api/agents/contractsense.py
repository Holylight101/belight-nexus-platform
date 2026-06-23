import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

api_key = os.getenv("DASHSCOPE_API_KEY")
base_url = os.getenv("QWEN_BASE_URL")

client = OpenAI(api_key=api_key, base_url=base_url)

print("[ContractSense] Agent loaded")

CONTRACTSENSE_SYSTEM_PROMPT = """
You are ContractSense, a senior contract lawyer and risk analyst 
inside BeLight Nexus AI.

You analyze contracts and legal documents for businesses.

When analyzing contracts:
- Identify risky clauses clearly
- Explain risks in plain English
- Score overall contract risk
- Give specific negotiation recommendations
- Flag anything unusual or dangerous

Always respond in this exact JSON format:
{
  "contract_type": "Type of contract",
  "overall_risk": "HIGH or MEDIUM or LOW",
  "summary": "Plain English summary of the contract",
  "parties": ["Party 1", "Party 2"],
  "key_clauses": [
    {
      "title": "Clause name",
      "content": "What it says",
      "risk_level": "HIGH or MEDIUM or LOW or NONE",
      "risk_explanation": "Why this is risky",
      "recommendation": "What to do about it"
    }
  ],
  "red_flags": [
    {
      "flag": "What the red flag is",
      "severity": "CRITICAL or WARNING or INFO",
      "explanation": "Why this matters"
    }
  ],
  "negotiation_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "key_takeaway": "One sentence summary for the business owner"
}
"""

def analyze_contract(contract_text: str, business_context: str) -> dict:
    prompt = f"""
Business Context:
{business_context}

Contract to analyze:
{contract_text}

Analyze this contract thoroughly for risks and opportunities.
"""
    try:
        response = client.chat.completions.create(
            model="qwen-max",
            messages=[
                {"role": "system", "content": CONTRACTSENSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content
        clean = content.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        clean = clean.strip()
        return json.loads(clean)

    except Exception as e:
        return {
            "error": str(e),
            "overall_risk": "UNKNOWN",
            "summary": "Analysis failed — please try again",
            "key_takeaway": "Error occurred during analysis"
        }


def quick_review(contract_text: str) -> dict:
    prompt = f"""
Do a quick 30-second review of this contract.
Identify the top 3 risks immediately.

Contract:
{contract_text[:2000]}
"""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": CONTRACTSENSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]
        )
        return {"quick_review": response.choices[0].message.content}

    except Exception as e:
        return {"error": str(e)}