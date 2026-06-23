from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.contractsense import analyze_contract, quick_review

router = APIRouter(prefix="/contractsense", tags=["ContractSense"])

class ContractRequest(BaseModel):
    contract_text: str
    business_name: str
    industry: str

class QuickReviewRequest(BaseModel):
    contract_text: str

@router.post("/analyze")
def analyze(request: ContractRequest):
    business_context = f"""
    Business: {request.business_name}
    Industry: {request.industry}
    """
    result = analyze_contract(request.contract_text, business_context)
    return result

@router.post("/quick-review")
def quick(request: QuickReviewRequest):
    return quick_review(request.contract_text)

@router.get("/health")
def health():
    return {"agent": "ContractSense", "status": "online"}