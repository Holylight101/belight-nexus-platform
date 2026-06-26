# BeLight Nexus AI — Deployment Guide

## Quick Deploy (ECS / VPS)

```bash
# 1. Clone
git clone https://github.com/Holylight101/belight-nexus-platform.git
cd belight-nexus-platform

# 2. Backend
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
# Or use PM2: pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2" --name belight-api

# 3. Frontend (new terminal)
cd ../web
npm install
npm run build
npm start
# Or use PM2: pm2 start "npm start" --name belight-web
```

## Docker Deploy

```bash
docker-compose up --build -d
```

## Environment Variables

### API (`api/.env`)
```
FRONTEND_URL=http://47.236.160.30:3000
API_URL=http://47.236.160.30:8000
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_key
SUPABASE_SECRET_KEY=your_secret
DASHSCOPE_API_KEY=your_qwen_key
```

### Web (`web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://47.236.160.30:8000
```

## Health Check URLs

- API Root: `http://47.236.160.30:8000/`
- API Health: `http://47.236.160.30:8000/health`
- Frontend: `http://47.236.160.30:3000`

## Agent Endpoints

| Agent | Health | Run |
|-------|--------|-----|
| RegulaBot | `GET /regulabot/health` | `POST /regulabot/analyze` |
| ContractSense | `GET /contractsense/health` | `POST /contractsense/analyze` |
| GrantRadar | `GET /grantradar/health` | `POST /grantradar/find` |
| Autopilot | `GET /autopilot/health` | `POST /autopilot/run` |
