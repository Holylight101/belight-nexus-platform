from fastapi import APIRouter
from pydantic import BaseModel
from agents.grantradar import find_grants, draft_application

router = APIRouter(prefix="/grantradar", tags=["GrantRadar"])

class GrantSearchRequest(BaseModel):
    org_name: str
    mission: str
    industry: str
    country: str
    size: str

class DraftRequest(BaseModel):
    grant_title: str
    org_name: str
    mission: str
    section: str

@router.post("/find")
def find(request: GrantSearchRequest):
    return find_grants(
        request.org_name,
        request.mission,
        request.industry,
        request.country,
        request.size
    )

@router.post("/draft")
def draft(request: DraftRequest):
    return draft_application(
        request.grant_title,
        request.org_name,
        request.mission,
        request.section
    )

@router.get("/health")
def health():
    return {"agent": "GrantRadar", "status": "online"}