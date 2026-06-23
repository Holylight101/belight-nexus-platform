import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

api_key = os.getenv("DASHSCOPE_API_KEY")
base_url = os.getenv("QWEN_BASE_URL")

client = OpenAI(api_key=api_key, base_url=base_url)

print("[GrantRadar] Agent loaded")

GRANTRADAR_SYSTEM_PROMPT = """
You are GrantRadar, a senior grant strategist and funding advisor
inside BeLight Nexus AI.

You help businesses and nonprofits find and win grants.

When finding grants:
- Match grants precisely to the organization's mission
- Score match percentage honestly
- Explain exactly why they qualify
- Give actionable application tips
- Be specific about amounts and deadlines

Always respond in this exact JSON format:
{
  "organization_assessment": "Brief assessment of the org's fundability",
  "total_grants_found": 5,
  "estimated_total_funding": "$500,000",
  "grants": [
    {
      "title": "Grant name",
      "funder": "Who gives the money",
      "amount": "$50,000",
      "deadline": "Date or Rolling",
      "match_score": 92,
      "match_reason": "Why this org qualifies",
      "category": "Technology or Education etc",
      "application_tip": "Specific tip to win this grant",
      "url": "where to apply or null"
    }
  ],
  "top_recommendation": "The single best grant to apply for first",
  "key_takeaway": "One sentence strategic advice"
}
"""

def find_grants(
    org_name: str,
    mission: str,
    industry: str,
    country: str,
    size: str
) -> dict:
    prompt = f"""
Organization: {org_name}
Mission: {mission}
Industry: {industry}
Country: {country}
Size: {size}

Find the top 5 most relevant grants for this organization.
Be specific with amounts, deadlines, and match scores.
"""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": GRANTRADAR_SYSTEM_PROMPT},
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
            "organization_assessment": "Analysis failed",
            "total_grants_found": 0,
            "grants": [],
            "key_takeaway": "Please try again"
        }


def draft_application(
    grant_title: str,
    org_name: str,
    mission: str,
    section: str
) -> dict:
    prompt = f"""
Write a compelling grant application section for:

Grant: {grant_title}
Organization: {org_name}
Mission: {mission}
Section to write: {section}

Write persuasively and specifically. 
Make it compelling enough to win.
"""
    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": GRANTRADAR_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]
        )
        return {
            "section": section,
            "draft": response.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}