🚀 MetroCity Smart City Dashboard
📌 Overview
MetroCity Smart City Dashboard is a full-stack web application designed to simulate a centralized urban control system. It integrates multiple city management modules into a single, unified dashboard for monitoring, analytics, and administration.
The system provides real-time insights, actionable workflows, and a scalable architecture that reflects modern smart city solutions.
🎯 Objectives
Provide a single interface to monitor multiple urban systems
Enable efficient administrative workflows (complaints, alerts, system control)
Demonstrate real-time data handling and predictive insights
Simulate a smart city command center environment
🛠️ Tech Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Recharts (data visualization)
Lucide Icons
Zustand-style global state (custom)
Backend
FastAPI
Uvicorn
Pydantic v2
Data & Storage
Mock data (frontend)
LocalStorage (temporary persistence)
🧩 Features
🏙️ City Systems
Traffic Monitoring
Live metrics & congestion charts
Road status table
CCTV demo feed
Air Quality (AQI)
Current AQI levels
Historical trends
Prediction module
Waste Management
Bin status tracking
Waste reporting
Water Management
Water levels & alerts
Infrastructure
Government projects
Service notices
Building data
📢 Complaint Management
Submit complaints
Track complaint status
Admin review and resolution system
⚠️ Alerts System
Real-time alerts feed
Emergency notifications
⚙️ Admin Panel
User management
Complaint resolution workflow
System health monitoring
Settings (persisted locally)
Feedback management
💬 Feedback System
User feedback submission (modal)
Admin dashboard for review & clearing
🔌 Backend API
Core Endpoints
GET / → Service info
GET /health → Health check
Traffic
GET /traffic/live
GET /traffic/predict
AQI
GET /aqi/current
GET /aqi/history
GET /aqi/predict
Waste
GET /waste/status
POST /waste/report
Water
GET /water/status
GET /water/alerts
Complaints
Create, list, update status
Alerts
Send and retrieve alerts
WebSocket
WS /ws/live → Real-time updates
Overview
GET /overview/stats
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/metrocity-dashboard.git
cd metrocity-dashboard
2️⃣ Backend Setup
cd backend
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows

pip install -r requirements.txt
uvicorn backend.main:app --host 127.0.0.1 --port 8010
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev -- --port 3000
🧪 Current Limitations
Uses mock data for most modules
Admin data stored in localStorage (not persistent across devices)
CCTV is a demo video, not live streaming
No authentication or role-based access control
No map-based visualization
🚀 Future Enhancements
Integrate database (PostgreSQL / Supabase)
Add authentication & role-based access (JWT)
Implement real-time IoT data integration
Add map visualization (Leaflet / Mapbox)
Enable report export (PDF/CSV)
Improve AI prediction models
📈 Project Highlights
Full-stack architecture
Modular smart city system design
Real-time update capability (WebSocket)
Clean and scalable UI/UX
🧠 Learning Outcomes
Full-stack development using modern frameworks
REST API design with FastAPI
State management and UI structuring
System design for real-world applications
📜 License
This project is developed for educational purposes.
🙌 Acknowledgements
Inspired by modern smart city initiatives and urban monitoring systems.
📬 Contact
For queries or collaboration, feel free to reach out.