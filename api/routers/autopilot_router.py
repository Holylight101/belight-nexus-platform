from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict
from agents.autopilot import run_autopilot

router = APIRouter(prefix="/autopilot", tags=["Autopilot"])


class AutopilotRequest(BaseModel):
    message: str
    business_context: Optional[Dict] = None


class AutopilotChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    business_context: Optional[Dict] = None


@router.post("/run")
async def run(request: AutopilotRequest):
    """Run the Autopilot Agent on a single request."""
    result = await run_autopilot(request.message, request.business_context)
    return result


@router.post("/chat")
async def chat(request: AutopilotChatRequest):
    """Chat with Autopilot Agent with conversation tracking."""
    result = await run_autopilot(request.message, request.business_context)
    return {
        "thread_id": request.thread_id or "new-thread",
        "message": request.message,
        **result
    }


@router.get("/health")
def health():
    return {"agent": "Autopilot", "status": "online"}
