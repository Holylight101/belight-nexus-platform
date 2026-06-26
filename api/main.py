from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import regulabot_router, contractsense_router, grantradar_router, autopilot_router
import os

load_dotenv()

app = FastAPI(
    title="BeLight Nexus AI",
    description="RegulaBot · ContractSense · GrantRadar · Autopilot",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://47.236.160.30:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regulabot_router.router)
app.include_router(contractsense_router.router)
app.include_router(grantradar_router.router)
app.include_router(autopilot_router.router)

@app.get("/")
def root():
    return {
        "platform": "BeLight Nexus AI",
        "status": "running",
        "agents": ["RegulaBot", "ContractSense", "GrantRadar", "Autopilot"],
        "version": "2.0.0"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
