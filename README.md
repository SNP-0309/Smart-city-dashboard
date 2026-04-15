# 🏙️ MetroCity — Unified Smart City Dashboard

A full-stack urban monitoring and management platform with real-time data, AI features, and a premium glassmorphism UI.

## 🚀 Quick Start

### Frontend (Next.js 14)
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

### Backend (FastAPI)
```bash
cd backend
source venv/bin/activate   # macOS/Linux
uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

## 🧩 Features
| Module | Status | Description |
|--------|--------|-------------|
| Traffic | ✅ | Real-time congestion, speed, predictions |
| Air Quality | ✅ | AQI zones, pollutant breakdown, forecasting |
| Waste Management | ✅ | Smart bin monitoring, truck dispatch |
| Water Monitoring | ✅ | Pressure, quality, flow metrics |
| Complaints | ✅ | AI image classification, citizen reporting |
| Alerts | ✅ | Live alerts, admin broadcast system |
| Analytics | ✅ | Weekly KPIs, multi-system charts |
| Admin Panel | ✅ | User management, system health, settings |

## 🎨 Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: FastAPI, Python 3.13, Uvicorn, scikit-learn
- **Database**: Supabase (PostgreSQL + Realtime + Auth + Storage)
- **AI**: Image classification API, AQI & traffic prediction models

## 📡 API Endpoints
| Route | Description |
|-------|-------------|
| `GET /traffic/live` | Real-time traffic data |
| `GET /traffic/predict` | Traffic predictions |
| `GET /aqi/current` | Current AQI by zone |
| `GET /aqi/history` | 24h AQI history |
| `GET /aqi/predict` | AQI forecast |
| `GET /waste/status` | Bin fill levels |
| `GET /water/status` | Water zone status |
| `POST /complaints/create` | Submit complaint |
| `GET /complaints/list` | List complaints |
| `PUT /complaints/{id}/update-status` | Update status |
| `POST /ai/classify-image` | AI image classification |
| `GET /ai/suggestions` | Smart city suggestions |
| `POST /alerts/send` | Broadcast alert |
| `WS /ws/live` | Real-time WebSocket |

## 👤 Roles
- **Citizen**: View dashboard, report complaints, track status, receive alerts
- **Admin**: All citizen features + update complaints, send broadcasts, view analytics, manage users

## 🗄️ Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Create `.env.local` in `/frontend`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 🚀 Deployment
- **Frontend** → Vercel: `vercel deploy`
- **Backend** → Render / Railway (set `uvicorn main:app --host 0.0.0.0 --port $PORT`)
- **Database** → Supabase (managed)
