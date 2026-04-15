"""
MetroCity Smart City Dashboard - FastAPI Backend
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
import random
import math
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional, List
import numpy as np
import uvicorn

app = FastAPI(
    title="MetroCity Smart Dashboard API",
    description="Unified Smart City Monitoring and Management API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────
# Models
# ─────────────────────────────────

class Complaint(BaseModel):
    type: str
    description: str
    location: str
    priority: str = "Medium"
    reported_by: str = "Anonymous"
    area: str = "Unknown"

class ComplaintUpdate(BaseModel):
    status: str  # Open | In Progress | Resolved

class Alert(BaseModel):
    message: str
    type: str  # critical | warning | info
    location: str = "City-wide"
    channels: List[str] = ["App Notification"]

# ─────────────────────────────────
# In-memory data stores
# ─────────────────────────────────

complaints_db = [
    {"id": "CMP-001", "type": "Pothole", "status": "In Progress", "location": "Main Blvd & 5th St", "priority": "High", "reported_by": "John D.", "timestamp": "2026-04-05T08:30:00Z", "description": "Large pothole causing traffic hazard", "area": "Downtown"},
    {"id": "CMP-002", "type": "Garbage", "status": "Open", "location": "Harbor Park Lane", "priority": "Medium", "reported_by": "Sarah M.", "timestamp": "2026-04-05T09:15:00Z", "description": "Overflowing garbage bins", "area": "Harbor"},
    {"id": "CMP-003", "type": "Streetlight", "status": "Resolved", "location": "North Ring Rd km 4", "priority": "Low", "reported_by": "Mike T.", "timestamp": "2026-04-04T22:10:00Z", "description": "Streetlight off for 3 days", "area": "North"},
]

alerts_db = []
websocket_clients = set()

# ─────────────────────────────────
# Helper functions
# ─────────────────────────────────

def generate_aqi(base: int, hour: int) -> int:
    return int(base + math.sin(hour * 0.4) * 25 + random.uniform(-10, 10))

def generate_congestion(base: int, hour: int) -> int:
    return max(5, min(98, int(base + math.sin(hour * 0.6) * 20 + random.uniform(-10, 10))))

def simple_aqi_prediction(current_aqi: int, hour: int) -> dict:
    """Simple linear + sine wave prediction for AQI"""
    predictions = []
    for i in range(1, 7):
        pred_hour = (hour + i) % 24
        pred = generate_aqi(current_aqi, pred_hour)
        predictions.append({"hour": f"{pred_hour:02d}:00", "aqi": pred})
    return predictions

def simple_traffic_prediction(current: int) -> dict:
    """Simple traffic prediction"""
    trend = "improving" if current > 60 else "stable"
    predicted = max(5, current - random.randint(5, 15))
    return {
        "current": current,
        "predicted_30m": predicted,
        "trend": trend,
        "confidence": round(random.uniform(0.72, 0.94), 2)
    }

# ─────────────────────────────────
# ROOT
# ─────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "MetroCity Smart Dashboard API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ─────────────────────────────────
# TRAFFIC ROUTES
# ─────────────────────────────────

@app.get("/traffic/live")
def traffic_live():
    hour = datetime.utcnow().hour
    zones = [
        {"id": 1, "road": "Main Boulevard", "congestion": generate_congestion(87, hour), "speed": random.randint(8, 20), "vehicles": random.randint(2000, 2600), "status": "Heavy"},
        {"id": 2, "road": "Harbor Express", "congestion": generate_congestion(62, hour), "speed": random.randint(22, 38), "vehicles": random.randint(1600, 2000), "status": "Moderate"},
        {"id": 3, "road": "North Ring Road", "congestion": generate_congestion(34, hour), "speed": random.randint(48, 65), "vehicles": random.randint(800, 1200), "status": "Light"},
        {"id": 4, "road": "Airport Corridor", "congestion": generate_congestion(78, hour), "speed": random.randint(14, 24), "vehicles": random.randint(1400, 1800), "status": "Heavy"},
        {"id": 5, "road": "Central Ave", "congestion": generate_congestion(55, hour), "speed": random.randint(30, 45), "vehicles": random.randint(1100, 1500), "status": "Moderate"},
        {"id": 6, "road": "Industrial Bypass", "congestion": generate_congestion(91, hour), "speed": random.randint(5, 14), "vehicles": random.randint(1800, 2300), "status": "Severe"},
    ]
    for z in zones:
        c = z["congestion"]
        z["status"] = "Severe" if c > 85 else "Heavy" if c > 70 else "Moderate" if c > 45 else "Light"
    return {"data": zones, "timestamp": datetime.utcnow().isoformat(), "total_vehicles": sum(z["vehicles"] for z in zones)}

@app.get("/traffic/predict")
def traffic_predict():
    zones = [
        {"road": "Main Blvd", "current_congestion": random.randint(75, 95)},
        {"road": "Harbor Exp", "current_congestion": random.randint(50, 70)},
        {"road": "North Ring", "current_congestion": random.randint(25, 45)},
    ]
    predictions = [{"road": z["road"], **simple_traffic_prediction(z["current_congestion"])} for z in zones]
    return {"predictions": predictions, "timestamp": datetime.utcnow().isoformat()}

# ─────────────────────────────────
# AQI ROUTES
# ─────────────────────────────────

@app.get("/aqi/current")
def aqi_current():
    hour = datetime.utcnow().hour
    zones = [
        {"id": 1, "name": "Downtown", "aqi": generate_aqi(142, hour), "lat": 40.7128, "lng": -74.006, "pm25": round(random.uniform(40, 55), 1), "pm10": round(random.uniform(65, 85), 1), "co": round(random.uniform(0.6, 1.1), 1), "no2": random.randint(30, 50)},
        {"id": 2, "name": "Industrial", "aqi": generate_aqi(218, hour), "lat": 40.728, "lng": -73.98, "pm25": round(random.uniform(75, 100), 1), "pm10": round(random.uniform(120, 150), 1), "co": round(random.uniform(1.8, 2.5), 1), "no2": random.randint(75, 100)},
        {"id": 3, "name": "Residential", "aqi": generate_aqi(67, hour), "lat": 40.705, "lng": -74.025, "pm25": round(random.uniform(15, 25), 1), "pm10": round(random.uniform(28, 40), 1), "co": round(random.uniform(0.3, 0.6), 1), "no2": random.randint(18, 28)},
        {"id": 4, "name": "Green Park", "aqi": generate_aqi(35, hour), "lat": 40.719, "lng": -73.995, "pm25": round(random.uniform(6, 12), 1), "pm10": round(random.uniform(12, 20), 1), "co": round(random.uniform(0.1, 0.3), 1), "no2": random.randint(8, 16)},
        {"id": 5, "name": "Harbor", "aqi": generate_aqi(98, hour), "lat": 40.7, "lng": -74.015, "pm25": round(random.uniform(25, 35), 1), "pm10": round(random.uniform(42, 58), 1), "co": round(random.uniform(0.5, 0.8), 1), "no2": random.randint(26, 38)},
    ]
    for z in zones:
        aqi = z["aqi"]
        z["status"] = "Good" if aqi <= 50 else "Moderate" if aqi <= 100 else "Unhealthy" if aqi <= 150 else "Very Unhealthy" if aqi <= 200 else "Hazardous"
    city_avg = int(sum(z["aqi"] for z in zones) / len(zones))
    return {"zones": zones, "city_average": city_avg, "timestamp": datetime.utcnow().isoformat()}

@app.get("/aqi/history")
def aqi_history():
    base_hour = datetime.utcnow().hour
    history = []
    for i in range(24):
        hr = (base_hour - 23 + i) % 24
        history.append({
            "time": f"{hr:02d}:00",
            "downtown": generate_aqi(142, hr),
            "industrial": generate_aqi(218, hr),
            "residential": generate_aqi(67, hr),
            "greenPark": generate_aqi(35, hr),
        })
    return {"history": history, "timestamp": datetime.utcnow().isoformat()}

@app.get("/aqi/predict")
def aqi_predict():
    hour = datetime.utcnow().hour
    return {
        "predictions": {
            "downtown": simple_aqi_prediction(142, hour),
            "industrial": simple_aqi_prediction(218, hour),
            "greenPark": simple_aqi_prediction(35, hour),
        },
        "model": "linear_regression_v1",
        "accuracy": 0.87,
        "timestamp": datetime.utcnow().isoformat()
    }

# ─────────────────────────────────
# WASTE ROUTES
# ─────────────────────────────────

@app.get("/waste/status")
def waste_status():
    bins = [
        {"id": i+1, "location": loc, "fill": random.randint(fill_base-5, min(fill_base+10, 99)), "type": tp, "last_pickup": pickup}
        for i, (loc, fill_base, tp, pickup) in enumerate([
            ("City Square", 94, "General", "2h ago"),
            ("Harbor Park", 67, "Recyclable", "4h ago"),
            ("North Market", 23, "Organic", "1h ago"),
            ("Tech District", 81, "General", "3h ago"),
            ("Station Area", 45, "General", "30m ago"),
            ("Industrial Zone", 99, "Hazardous", "8h ago"),
            ("Riverside", 12, "Recyclable", "2h ago"),
            ("Mall Entrance", 58, "General", "5h ago"),
        ])
    ]
    for b in bins:
        f = b["fill"]
        b["status"] = "Critical" if f >= 90 else "Warning" if f >= 75 else "Good"
    return {"bins": bins, "critical_count": sum(1 for b in bins if b["status"] == "Critical"), "timestamp": datetime.utcnow().isoformat()}

@app.post("/waste/report")
def waste_report(bin_id: int, fill_level: int):
    return {"success": True, "bin_id": bin_id, "fill_level": fill_level, "message": "Bin status updated", "timestamp": datetime.utcnow().isoformat()}

# ─────────────────────────────────
# WATER ROUTES
# ─────────────────────────────────

@app.get("/water/status")
def water_status():
    zones = [
        {"id": 1, "zone": "Zone A - Central", "pressure": random.randint(68, 78), "quality": round(random.uniform(97, 99.5), 1), "flow": random.randint(1200, 1300), "tempC": round(random.uniform(17, 19), 1)},
        {"id": 2, "zone": "Zone B - North", "pressure": random.randint(63, 73), "quality": round(random.uniform(96, 98), 1), "flow": random.randint(950, 1020), "tempC": round(random.uniform(17, 18.5), 1)},
        {"id": 3, "zone": "Zone C - Industrial", "pressure": random.randint(40, 52), "quality": round(random.uniform(87, 92), 1), "flow": random.randint(580, 660), "tempC": round(random.uniform(20, 23), 1)},
        {"id": 4, "zone": "Zone D - Harbor", "pressure": random.randint(53, 64), "quality": round(random.uniform(94, 97), 1), "flow": random.randint(800, 880), "tempC": round(random.uniform(18, 20), 1)},
        {"id": 5, "zone": "Zone E - South", "pressure": random.randint(25, 38), "quality": round(random.uniform(80, 85), 1), "flow": random.randint(340, 420), "tempC": round(random.uniform(21, 24), 1)},
    ]
    for z in zones:
        p = z["pressure"]
        z["status"] = "Critical" if p < 35 else "Warning" if p < 55 else "Normal"
    return {"zones": zones, "timestamp": datetime.utcnow().isoformat()}

@app.get("/water/alerts")
def water_alerts():
    return {
        "alerts": [
            {"zone": "Zone E - South", "type": "Low Pressure", "value": 31, "threshold": 35, "severity": "critical"},
            {"zone": "Zone C - Industrial", "type": "Quality Warning", "value": 89.3, "threshold": 90, "severity": "warning"},
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

# ─────────────────────────────────
# COMPLAINTS ROUTES
# ─────────────────────────────────

@app.post("/complaints/create")
def create_complaint(complaint: Complaint):
    new_id = f"CMP-{len(complaints_db) + 1:03d}"
    new = {
        "id": new_id,
        "type": complaint.type,
        "description": complaint.description,
        "location": complaint.location,
        "priority": complaint.priority,
        "reported_by": complaint.reported_by,
        "area": complaint.area,
        "status": "Open",
        "timestamp": datetime.utcnow().isoformat(),
    }
    complaints_db.append(new)
    return {"success": True, "complaint": new}

@app.get("/complaints/list")
def list_complaints(status: Optional[str] = None, area: Optional[str] = None):
    result = complaints_db
    if status:
        result = [c for c in result if c["status"] == status]
    if area:
        result = [c for c in result if c["area"].lower() == area.lower()]
    return {"complaints": result, "total": len(result), "timestamp": datetime.utcnow().isoformat()}

@app.put("/complaints/{complaint_id}/update-status")
def update_complaint_status(complaint_id: str, update: ComplaintUpdate):
    for c in complaints_db:
        if c["id"] == complaint_id:
            c["status"] = update.status
            c["updated_at"] = datetime.utcnow().isoformat()
            return {"success": True, "complaint": c}
    raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")

# ─────────────────────────────────
# AI ROUTES
# ─────────────────────────────────

@app.post("/ai/classify-image")
async def classify_image(file: UploadFile = File(...)):
    """Simulate AI image classification for complaint type detection"""
    await asyncio.sleep(0.5)  # Simulate processing time
    types = ["Pothole", "Garbage Overflow", "Black Smoke", "Water Leak", "Broken Streetlight"]
    confidences = [round(random.uniform(0.78, 0.97), 2) for _ in types]
    top_confidence = max(confidences)
    top_type = types[confidences.index(top_confidence)]
    return {
        "detected_type": top_type,
        "confidence": top_confidence,
        "all_predictions": [{"type": t, "confidence": c} for t, c in zip(types, confidences)],
        "model": "smartcity-classifier-v2",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/ai/suggestions")
def ai_suggestions():
    aqi_val = generate_aqi(142, datetime.utcnow().hour)
    suggestions = []
    if aqi_val > 150:
        suggestions.append({"type": "health", "icon": "🏭", "message": "Issue health advisory for Industrial Zone residents", "priority": "high"})
    suggestions.extend([
        {"type": "traffic", "icon": "🚦", "message": "Divert traffic from Main Blvd via North Ring Rd — saves avg 18 min", "priority": "medium"},
        {"type": "waste", "icon": "🚛", "message": "Deploy 3 additional waste trucks to critical zones (City Square, Industrial)", "priority": "high"},
        {"type": "water", "icon": "💧", "message": "Increase water pressure in Zone E — current 31 PSI below threshold", "priority": "critical"},
    ])
    return {"suggestions": suggestions, "generated_at": datetime.utcnow().isoformat()}

# ─────────────────────────────────
# ALERTS ROUTES
# ─────────────────────────────────

@app.post("/alerts/send")
async def send_alert(alert: Alert):
    new_alert = {
        "id": len(alerts_db) + 1,
        "message": alert.message,
        "type": alert.type,
        "location": alert.location,
        "channels": alert.channels,
        "timestamp": datetime.utcnow().isoformat(),
        "sent_by": "admin"
    }
    alerts_db.append(new_alert)
    # Broadcast to WebSocket clients
    for ws in websocket_clients.copy():
        try:
            await ws.send_text(json.dumps({"event": "new_alert", "data": new_alert}))
        except:
            websocket_clients.discard(ws)
    return {"success": True, "alert": new_alert, "recipients": len(websocket_clients)}

@app.get("/alerts/user")
def user_alerts(limit: int = 10):
    sample_alerts = [
        {"id": 1, "type": "critical", "message": "Severe air quality in Industrial Zone - AQI 218", "time": "5m ago"},
        {"id": 2, "type": "warning", "message": "Traffic congestion on Main Boulevard > 85%", "time": "12m ago"},
        {"id": 3, "type": "info", "message": "Water pressure restored in Zone A", "time": "25m ago"},
        {"id": 4, "type": "critical", "message": "Waste overflow at Industrial Zone — immediate pickup needed", "time": "31m ago"},
        {"id": 5, "type": "warning", "message": "Heavy rain forecast — flood risk in Harbor area", "time": "1h ago"},
    ]
    return {"alerts": sample_alerts[:limit], "count": len(sample_alerts), "timestamp": datetime.utcnow().isoformat()}

# ─────────────────────────────────
# WEBSOCKET
# ─────────────────────────────────

@app.websocket("/ws/live")
async def websocket_live(ws: WebSocket):
    await ws.accept()
    websocket_clients.add(ws)
    try:
        while True:
            hour = datetime.utcnow().hour
            data = {
                "event": "live_update",
                "aqi_city_avg": generate_aqi(112, hour),
                "traffic_congestion_avg": generate_congestion(68, hour),
                "active_complaints": len([c for c in complaints_db if c["status"] != "Resolved"]),
                "timestamp": datetime.utcnow().isoformat()
            }
            await ws.send_text(json.dumps(data))
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        websocket_clients.discard(ws)

# ─────────────────────────────────
# OVERVIEW
# ─────────────────────────────────

@app.get("/overview/stats")
def overview_stats():
    hour = datetime.utcnow().hour
    return {
        "total_complaints": len(complaints_db),
        "open_complaints": len([c for c in complaints_db if c["status"] == "Open"]),
        "resolved_today": len([c for c in complaints_db if c["status"] == "Resolved"]),
        "active_alerts": 18,
        "aqi_city_avg": generate_aqi(112, hour),
        "traffic_avg_congestion": generate_congestion(68, hour),
        "water_quality_avg": round(random.uniform(92, 96), 1),
        "waste_critical_bins": 2,
        "timestamp": datetime.utcnow().isoformat()
    }

# ─────────────────────────────────
# RUN
# ─────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
