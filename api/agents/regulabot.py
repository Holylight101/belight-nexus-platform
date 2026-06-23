import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

api_key = os.getenv("DASHSCOPE_API_KEY")
base_url = os.getenv("QWEN_BASE_URL")

print(f"[RegulaBot] API Key loaded: {api_key[:15] if api_key else 'NOT FOUND'}")
print(f"[RegulaBot] Base URL: {base_url}")

client = OpenAI(
    api_key=api_key,
    base_url=base_url
)

REGULABOT_SYSTEM_PROMPT = """
You are RegulaBot, a senior compliance advisor inside BeLight Nexus AI.
You help small businesses understand regulations that affect them.

When analyzing regulations:
- Explain in plain English, no legal jargon
- Score impact as HIGH, MEDIUM, or LOW
- Give 3-5 specific action steps the business must take
- Include deadlines where relevant
- Be direct and practical

Always respond in this JSON format:
{
  "summary": "Plain English summary of the regulation",
  "impact_level": "HIGH or MEDIUM or LOW",
  "affects_business": true or false,
  "action_items": [
    {
      "title": "Action title",
      "description": "What exactly to do",
      "priority": "HIGH or MEDIUM or LOW",
      "deadline": "Date or timeframe or null"
    }
  ],
  "key_takeaway": "One sentence the business owner must remember"
}
"""

def analyze_regulation(regulation_text: str, business_context: str) -> dict:
    prompt = f"""
Business Context:
{business_context}

Regulation to analyze:
{regulation_text}

Analyze how this regulation affects this specific business.
"""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": REGULABOT_SYSTEM_PROMPT},
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
            "summary": "Analysis failed",
            "impact_level": "UNKNOWN",
            "affects_business": False,
            "action_items": [],
            "key_takeaway": "Please try again"
        }


def get_compliance_summary(business_name: str, industry: str) -> str:
    prompt = f"""
A business called "{business_name}" in the {industry} industry
wants to know the top 5 compliance areas they should monitor right now.
Give them a practical starting checklist.
"""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": REGULABOT_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"