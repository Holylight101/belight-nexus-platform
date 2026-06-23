from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.regulabot import analyze_regulation, get_compliance_summary

router = APIRouter(prefix="/regulabot", tags=["RegulaBot"])

class RegulationRequest(BaseModel):
    regulation_text: str
    business_name: str
    industry: str
    country: str

class ComplianceSummaryRequest(BaseModel):
    business_name: str
    industry: str

@router.post("/analyze")
def analyze(request: RegulationRequest):
    business_context = f"""
    Business: {request.business_name}
    Industry: {request.industry}
    Country: {request.country}
    """
    result = analyze_regulation(request.regulation_text, business_context)
    return result

@router.post("/summary")
def compliance_summary(request: ComplianceSummaryRequest):
    result = get_compliance_summary(request.business_name, request.industry)
    return {"summary": result}

@router.get("/health")
def health():
    return {"agent": "RegulaBot", "status": "online"}