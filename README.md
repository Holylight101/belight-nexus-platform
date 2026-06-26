# BeLight Nexus AI

> **One Platform. Four Agents. Infinite Business Intelligence.**

[![Live Demo](https://img.shields.io/badge/LIVE-47.236.160.30:3000-amber?style=for-the-badge)](http://47.236.160.30:3000)
[![API](https://img.shields.io/badge/API-47.236.160.30:8000-blue?style=for-the-badge)](http://47.236.160.30:8000)
[![Track](https://img.shields.io/badge/Hackathon-Track%204%20Autopilot%20Agent-purple?style=for-the-badge)]()

---

## What Is This?

BeLight Nexus AI is the world's first multi-agent business intelligence platform. Instead of one generic AI chatbot, we built **four specialized AI agents** that work together through an **Autopilot orchestrator**:

| Agent | What It Does | Emoji |
|-------|---------------|-------|
| **Autopilot** | Orchestrates all agents, classifies intent, delivers unified strategy | 🤖 |
| **RegulaBot** | Compliance monitoring & action checklists | ⚖️ |
| **ContractSense** | Contract risk analysis & negotiation tips | 📄 |
| **GrantRadar** | Grant discovery & application drafting | 💰 |

**The magic:** Tell Autopilot your situation in plain English. It figures out which agents you need, calls them in parallel, and synthesizes everything into one actionable briefing.

---

## Live Demo

- **Frontend:** http://47.236.160.30:3000
- **API Docs:** http://47.236.160.30:8000/docs
- **Health Check:** http://47.236.160.30:8000/health

---

## Quick Start

### Backend (FastAPI)
```bash
cd api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (Next.js 14)
```bash
cd web
npm install
npm run dev
```

### Docker (Everything)
```bash
docker-compose up --build
```

---

## Architecture

```
User → Next.js Frontend → FastAPI Backend → Qwen (DashScope) LLM
                              ↓
                    ┌────────┼────────┐
                    ↓        ↓        ↓
                RegulaBot  ContractSense  GrantRadar
                    └────────┬────────┘
                             ↓
                       Autopilot Synthesis
                             ↓
                    Unified Strategic Briefing
```

**Tech Stack:**
- **Backend:** Python 3.11, FastAPI, Uvicorn
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **AI:** Qwen (Alibaba DashScope) via OpenAI-compatible SDK
- **Database:** Supabase (PostgreSQL + Auth)
- **Hosting:** Alibaba Cloud ECS (Singapore)
- **Deployment:** Docker + Docker Compose

---

## API Endpoints

### Autopilot (Track 4 Feature)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/autopilot/run` | Run Autopilot on a single request |
| POST | `/autopilot/chat` | Chat with conversation tracking |
| GET | `/autopilot/health` | Health check |

### RegulaBot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/regulabot/analyze` | Analyze specific regulation |
| POST | `/regulabot/summary` | Get compliance checklist |
| GET | `/regulabot/health` | Health check |

### ContractSense
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contractsense/analyze` | Full contract analysis |
| POST | `/contractsense/quick-review` | 30-second contract review |
| GET | `/contractsense/health` | Health check |

### GrantRadar
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/grantradar/find` | Find matching grants |
| POST | `/grantradar/draft` | Draft application section |
| GET | `/grantradar/health` | Health check |

---

## The Autopilot Agent (Track 4)

Autopilot is the crown jewel. Here's how it works:

1. **Intent Classification:** Qwen analyzes the user's message to determine which agents are needed
2. **Parallel Execution:** Relevant agents are called simultaneously via `asyncio.gather()`
3. **Synthesis:** Qwen Max combines all outputs into a unified strategic briefing
4. **Output:** Executive summary, agent findings, action plan with owners/deadlines, risks, and strategic takeaway

**Example:**
```json
POST /autopilot/run
{
  "message": "I started a fintech in Singapore. What regulations do I need and are there grants?",
  "business_context": {
    "business_name": "FinFlow",
    "industry": "Fintech",
    "country": "Singapore"
  }
}

// Response: Unified briefing with compliance checklist + grant matches
```

---

## Business Model

See [BUSINESS-MODEL.md](BUSINESS-MODEL.md) for the full monetization plan.

**TL;DR:** Freemium SaaS with 4 tiers — Free ($0), Professional ($49/mo), Business ($199/mo), Enterprise ($999+/mo). Target: $2M ARR by Month 12.

---

## Hackathon Pitch

See [PITCH-DECK.md](PITCH-DECK.md) for the full pitch deck and demo script.

---

## Deployment

See [DEPLOY.md](DEPLOY.md) for server deployment instructions.

---

## License

MIT — BeLight Nexus AI, 2026

---

**Built with 💡 by BeLight Nexus | Hackathon Track 4 — Autopilot Agent**
