// Mock Data for Unified Smart City Dashboard

export const CITY_NAME = "MetroCity";

// AQI Data
export const aqiZones = [
  { id: 1, name: "Downtown", aqi: 142, status: "Unhealthy", lat: 40.7128, lng: -74.006, pm25: 45.2, pm10: 72.1, co: 0.8, no2: 38 },
  { id: 2, name: "Industrial", aqi: 218, status: "Very Unhealthy", lat: 40.728, lng: -73.98, pm25: 88.1, pm10: 134.5, co: 2.1, no2: 89 },
  { id: 3, name: "Residential", aqi: 67, status: "Moderate", lat: 40.705, lng: -74.025, pm25: 18.3, pm10: 31.4, co: 0.4, no2: 21 },
  { id: 4, name: "Green Park", aqi: 35, status: "Good", lat: 40.719, lng: -73.995, pm25: 8.1, pm10: 15.2, co: 0.2, no2: 12 },
  { id: 5, name: "Harbor", aqi: 98, status: "Moderate", lat: 40.7, lng: -74.015, pm25: 28.9, pm10: 48.7, co: 0.6, no2: 31 },
];

export const aqiHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  downtown: Math.round(100 + Math.sin(i * 0.5) * 40 + Math.random() * 20),
  industrial: Math.round(180 + Math.sin(i * 0.4) * 50 + Math.random() * 30),
  residential: Math.round(55 + Math.sin(i * 0.6) * 20 + Math.random() * 15),
  greenPark: Math.round(35 + Math.sin(i * 0.3) * 10 + Math.random() * 8),
}));

// Traffic Data
export const trafficZones = [
  { id: 1, road: "Main Boulevard", congestion: 87, speed: 12, vehicles: 2340, status: "Severe", lat: 40.7131, lng: -74.0058 },
  { id: 2, road: "Harbor Express", congestion: 62, speed: 28, vehicles: 1820, status: "Moderate", lat: 40.7012, lng: -74.0138 },
  { id: 3, road: "North Ring Road", congestion: 34, speed: 54, vehicles: 980, status: "Light", lat: 40.7232, lng: -73.9975 },
  { id: 4, road: "Airport Corridor", congestion: 78, speed: 18, vehicles: 1650, status: "Heavy", lat: 40.7095, lng: -73.9908 },
  { id: 5, road: "Central Ave", congestion: 55, speed: 35, vehicles: 1320, status: "Moderate", lat: 40.7128, lng: -74.0106 },
  { id: 6, road: "Industrial Bypass", congestion: 91, speed: 8, vehicles: 2100, status: "Severe", lat: 40.7284, lng: -73.9812 },
];

export const trafficHistory = Array.from({ length: 12 }, (_, i) => ({
  hour: `${(7 + i)}:00`,
  mainBoulevard: Math.round(40 + Math.sin(i * 0.8) * 35 + Math.random() * 15),
  harborExpress: Math.round(30 + Math.sin(i * 0.7) * 28 + Math.random() * 12),
  northRing: Math.round(20 + Math.sin(i * 0.5) * 20 + Math.random() * 10),
}));

// Waste Data
export const wasteBins = [
  { id: 1, location: "City Square", fill: 94, status: "Critical", lastPickup: "2h ago", type: "General", lat: 40.7129, lng: -74.0079 },
  { id: 2, location: "Harbor Park", fill: 67, status: "Warning", lastPickup: "4h ago", type: "Recyclable", lat: 40.7007, lng: -74.0160 },
  { id: 3, location: "North Market", fill: 23, status: "Good", lastPickup: "1h ago", type: "Organic", lat: 40.7222, lng: -73.9990 },
  { id: 4, location: "Tech District", fill: 81, status: "Warning", lastPickup: "3h ago", type: "General", lat: 40.7176, lng: -73.9958 },
  { id: 5, location: "Station Area", fill: 45, status: "Good", lastPickup: "30m ago", type: "General", lat: 40.7112, lng: -74.0122 },
  { id: 6, location: "Industrial Zone", fill: 99, status: "Critical", lastPickup: "8h ago", type: "Hazardous", lat: 40.7280, lng: -73.9794 },
  { id: 7, location: "Riverside", fill: 12, status: "Good", lastPickup: "2h ago", type: "Recyclable", lat: 40.7036, lng: -74.0201 },
  { id: 8, location: "Mall Entrance", fill: 58, status: "Warning", lastPickup: "5h ago", type: "General", lat: 40.7158, lng: -74.0031 },
];

export const wasteCollectionByArea = [
  { area: "Downtown", collected: 4200, target: 5000 },
  { area: "Industrial", collected: 8900, target: 9000 },
  { area: "Residential", collected: 3100, target: 4500 },
  { area: "Commercial", collected: 5600, target: 6000 },
  { area: "Harbor", collected: 2100, target: 2500 },
];

// Water Data
export const waterZones = [
  { id: 1, zone: "Zone A - Central", pressure: 72, quality: 98.5, flow: 1250, status: "Normal", tempC: 18.2, lat: 40.7134, lng: -74.0081 },
  { id: 2, zone: "Zone B - North", pressure: 68, quality: 97.1, flow: 980, status: "Normal", tempC: 17.8, lat: 40.7248, lng: -73.9972 },
  { id: 3, zone: "Zone C - Industrial", pressure: 45, quality: 89.3, flow: 620, status: "Warning", tempC: 21.4, lat: 40.7288, lng: -73.9820 },
  { id: 4, zone: "Zone D - Harbor", pressure: 58, quality: 95.7, flow: 840, status: "Normal", tempC: 19.1, lat: 40.7009, lng: -74.0152 },
  { id: 5, zone: "Zone E - South", pressure: 31, quality: 82.1, flow: 380, status: "Critical", tempC: 22.6, lat: 40.7046, lng: -74.0208 },
];

export const waterHistory = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  consumption: Math.round(12000 + Math.random() * 4000),
  pressure: Math.round(55 + Math.random() * 25),
}));

// Complaints Data
export const complaints = [
  { id: "CMP-001", type: "Pothole", status: "In Progress", location: "Main Blvd & 5th St", priority: "High", reportedBy: "John D.", timestamp: "2026-04-05T08:30:00Z", description: "Large pothole causing traffic hazard", area: "Downtown", lat: 40.7131, lng: -74.0058 },
  { id: "CMP-002", type: "Garbage", status: "Open", location: "Harbor Park Lane", priority: "Medium", reportedBy: "Sarah M.", timestamp: "2026-04-05T09:15:00Z", description: "Overflowing garbage bins near park entrance", area: "Harbor", lat: 40.7007, lng: -74.0160 },
  { id: "CMP-003", type: "Streetlight", status: "Resolved", location: "North Ring Rd km 4", priority: "Low", reportedBy: "Mike T.", timestamp: "2026-04-04T22:10:00Z", description: "Streetlight has been off for 3 days", area: "North", lat: 40.7236, lng: -73.9968 },
  { id: "CMP-004", type: "Smoke", status: "Open", location: "Industrial Zone Block C", priority: "Critical", reportedBy: "Lisa K.", timestamp: "2026-04-05T10:00:00Z", description: "Black smoke emanating from factory chimney", area: "Industrial", lat: 40.7284, lng: -73.9812 },
  { id: "CMP-005", type: "Water Leak", status: "In Progress", location: "Central Ave 72", priority: "High", reportedBy: "Tom W.", timestamp: "2026-04-05T07:45:00Z", description: "Major water pipe leak flooding sidewalk", area: "Central", lat: 40.7128, lng: -74.0106 },
  { id: "CMP-006", type: "Pothole", status: "Open", location: "Airport Corridor exit 3", priority: "Medium", reportedBy: "Anna P.", timestamp: "2026-04-05T11:20:00Z", description: "Multiple potholes after recent rain", area: "Airport", lat: 40.7095, lng: -73.9908 },
  { id: "CMP-007", type: "Garbage", status: "Resolved", location: "Residential Block D", priority: "Low", reportedBy: "Chen L.", timestamp: "2026-04-03T14:00:00Z", description: "Garbage not collected for 2 days", area: "Residential", lat: 40.7056, lng: -74.0236 },
  { id: "CMP-008", type: "Noise", status: "Open", location: "Station Square", priority: "Medium", reportedBy: "Raj S.", timestamp: "2026-04-05T06:30:00Z", description: "Excessive noise from construction at night", area: "Station", lat: 40.7112, lng: -74.0122 },
];

export const complaintsByType = [
  { name: "Pothole", value: 34, color: "#f59e0b" },
  { name: "Garbage", value: 28, color: "#10b981" },
  { name: "Streetlight", value: 18, color: "#3b82f6" },
  { name: "Water Leak", value: 12, color: "#00d4ff" },
  { name: "Smoke", value: 5, color: "#ef4444" },
  { name: "Noise", value: 3, color: "#8b5cf6" },
];

export const complaintsByArea = [
  { area: "Downtown", count: 45 },
  { area: "Industrial", count: 32 },
  { area: "Residential", count: 28 },
  { area: "Harbor", count: 19 },
  { area: "North", count: 15 },
  { area: "Airport", count: 12 },
];

// Alerts
export const alerts = [
  { id: 1, type: "critical", message: "Severe air quality detected in Industrial Zone - AQI 218", time: "5m ago", icon: "AirQuality" },
  { id: 2, type: "warning", message: "Traffic congestion on Main Boulevard exceeding 85%", time: "12m ago", icon: "Traffic" },
  { id: 3, type: "critical", message: "Waste bin capacity critical at Industrial Zone", time: "18m ago", icon: "Waste" },
  { id: 4, type: "info", message: "Water pressure restored in Zone A after maintenance", time: "25m ago", icon: "Water" },
  { id: 5, type: "warning", message: "Heavy rain forecast — flood risk in Harbor area tomorrow", time: "1h ago", icon: "Weather" },
  { id: 6, type: "critical", message: "Water pressure critically low in Zone E - South", time: "2h ago", icon: "Water" },
];

// Overview Stats
export const overviewStats = {
  totalComplaints: { value: 247, change: +12, changeType: "increase" },
  activeAlerts: { value: 18, change: -3, changeType: "decrease" },
  aqiAverage: { value: 112, change: +8, changeType: "increase" },
  trafficCongestion: { value: 68, change: +5, changeType: "increase" },
  resolvedComplaints: { value: 189, change: +22, changeType: "increase" },
  waterQuality: { value: 94.5, change: -1.2, changeType: "decrease" },
};

// ── Infrastructure (Buildings, Projects, Notices) ───────────────────────────

export type InfrastructureProjectStatus = "planned" | "in_progress" | "delayed" | "completed";
export type ServiceNoticeSeverity = "info" | "warning" | "critical";

export type InfraLocation = {
  id: string;
  name: string;
  category: "Building" | "Project" | "Service";
  area: string;
  address: string;
  lat: number;
  lng: number;
};

export type InfrastructureProject = {
  id: string;
  title: string;
  owner: "Government" | "PPP" | "Private";
  program: "Roads" | "Transit" | "Energy" | "Water" | "Housing" | "Public Safety" | "Parks";
  status: InfrastructureProjectStatus;
  startDate: string; // YYYY-MM-DD
  eta: string; // e.g. "Q3 2026"
  budgetCr: number; // Crores
  summary: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
};

export type ServiceNotice = {
  id: string;
  title: string;
  severity: ServiceNoticeSeverity;
  window: string; // e.g. "Apr 16, 10:00–14:00"
  details: string;
  affectedArea: string;
  address: string;
  lat: number;
  lng: number;
};

export const buildingStats = {
  totalBuildings: 128_420,
  smartBuildings: 18_750,
  publicBuildings: 1_140,
  criticalFacilities: 132, // hospitals, fire stations, etc.
};

export const upcomingInfrastructure: InfrastructureProject[] = [
  {
    id: "INF-PRJ-001",
    title: "Main Boulevard Flyover Expansion",
    owner: "Government",
    program: "Roads",
    status: "in_progress",
    startDate: "2026-02-10",
    eta: "Q4 2026",
    budgetCr: 220,
    summary: "Add 2 lanes + smart signals to reduce peak congestion near Airport Connector.",
    area: "Downtown",
    address: "Main Boulevard, Airport Connector Interchange",
    lat: 40.7122,
    lng: -74.0052,
  },
  {
    id: "INF-PRJ-002",
    title: "Harbor Drainage Upgrade Phase II",
    owner: "Government",
    program: "Water",
    status: "planned",
    startDate: "2026-05-01",
    eta: "Q1 2027",
    budgetCr: 95,
    summary: "Increase drainage capacity + install flood sensors in low-lying harbor basin.",
    area: "Harbor",
    address: "Harbor Basin, Riverside Junction",
    lat: 40.7006,
    lng: -74.0142,
  },
  {
    id: "INF-PRJ-003",
    title: "North Sector LED Streetlight Retrofit",
    owner: "PPP",
    program: "Energy",
    status: "in_progress",
    startDate: "2026-03-15",
    eta: "Q3 2026",
    budgetCr: 38,
    summary: "Replace 5,000 lamps with smart LEDs; predictive maintenance for faults.",
    area: "North",
    address: "North Ring Rd, Residential Blocks A–D",
    lat: 40.7232,
    lng: -73.9975,
  },
];

export const governmentProjects: InfrastructureProject[] = [
  {
    id: "GOV-PRJ-101",
    title: "MetroCity Rapid Bus Corridor (Phase I)",
    owner: "Government",
    program: "Transit",
    status: "planned",
    startDate: "2026-07-01",
    eta: "Q2 2027",
    budgetCr: 410,
    summary: "Dedicated bus lanes + smart stops on Main Blvd ↔ Harbor Express.",
    area: "Central",
    address: "Main Blvd to Harbor Express Corridor",
    lat: 40.7098,
    lng: -74.0092,
  },
  {
    id: "GOV-PRJ-102",
    title: "Affordable Housing Cluster — South District",
    owner: "Government",
    program: "Housing",
    status: "in_progress",
    startDate: "2026-01-22",
    eta: "Q1 2027",
    budgetCr: 560,
    summary: "3,200 units with water/energy optimization and public amenities.",
    area: "South",
    address: "Zone E South District, Sector 4",
    lat: 40.7046,
    lng: -74.0208,
  },
];

export const serviceNotices: ServiceNotice[] = [
  {
    id: "SVC-001",
    title: "Planned Water Shutdown (Pipe Maintenance)",
    severity: "warning",
    window: "Apr 16, 10:00–14:00",
    details: "Temporary water supply interruption while replacing valve assembly.",
    affectedArea: "Zone C - Industrial",
    address: "Industrial Zone Block C — Valve A43",
    lat: 40.7284,
    lng: -73.9812,
  },
  {
    id: "SVC-002",
    title: "Lane Closures — Main Boulevard (Night Work)",
    severity: "info",
    window: "Apr 17, 22:00–05:00",
    details: "Two lanes closed for resurfacing; expect delays and follow diversion signs.",
    affectedArea: "Downtown",
    address: "Main Boulevard & 5th Street",
    lat: 40.7131,
    lng: -74.0058,
  },
  {
    id: "SVC-003",
    title: "Power Reliability Alert — North Sector Grid Node 7",
    severity: "critical",
    window: "Apr 15, 20:00–23:00",
    details: "High fault probability; crews on standby. Possible partial outage.",
    affectedArea: "North",
    address: "North Sector Substation — Node 7",
    lat: 40.724,
    lng: -73.9948,
  },
];

export const infrastructureLocations: InfraLocation[] = [
  { id: "LOC-BLD-001", name: "City Hall", category: "Building", area: "Central", address: "1 Civic Plaza", lat: 40.7126, lng: -74.0064 },
  { id: "LOC-BLD-002", name: "MetroCity General Hospital", category: "Building", area: "Downtown", address: "88 Health Ave", lat: 40.7142, lng: -74.0042 },
  { id: "LOC-BLD-003", name: "Harbor Fire Station", category: "Building", area: "Harbor", address: "12 Pier Road", lat: 40.7002, lng: -74.0162 },
  { id: "LOC-PRJ-001", name: "Flyover Expansion Site", category: "Project", area: "Downtown", address: "Main Blvd Interchange", lat: 40.7122, lng: -74.0052 },
  { id: "LOC-PRJ-002", name: "Drainage Upgrade Zone", category: "Project", area: "Harbor", address: "Harbor Basin", lat: 40.7006, lng: -74.0142 },
  { id: "LOC-SVC-001", name: "Pipe Maintenance Point", category: "Service", area: "Industrial", address: "Valve A43", lat: 40.7284, lng: -73.9812 },
];

// ── AI FUTURE PROBLEM PREDICTIONS ──────────────────────────────────────────

export type RiskLevel = "critical" | "high" | "medium" | "low";
export type PredictionSystem = "traffic" | "aqi" | "waste" | "water" | "infrastructure" | "flood";

export interface AIPrediction {
  id: string;
  system: PredictionSystem;
  title: string;
  description: string;
  risk: RiskLevel;
  confidence: number;          // 0–100
  eta: string;                 // e.g. "2h", "Tomorrow 3PM"
  etaMs: number;               // ms from now for sorting
  affectedArea: string;
  impact: string;
  recommendation: string;
  trend: "worsening" | "stable" | "improving";
  probability: number;         // 0–100
  modelVersion: string;
}

export const aiPredictions: AIPrediction[] = [
  {
    id: "PRED-001",
    system: "aqi",
    title: "Industrial Zone AQI Will Hit Hazardous",
    description: "PM2.5 concentration rising at 4.2 µg/m³/hr. If current emission rate continues, AQI will breach 250 in approximately 2 hours — reaching Hazardous category.",
    risk: "critical",
    confidence: 92,
    eta: "~2 hours",
    etaMs: 7_200_000,
    affectedArea: "Industrial Zone + Downtown",
    impact: "~45,000 residents at health risk, schools should close",
    recommendation: "Issue health advisory immediately, mandate factory emission checks",
    trend: "worsening",
    probability: 89,
    modelVersion: "AQI-LSTM-v3.1",
  },
  {
    id: "PRED-002",
    system: "traffic",
    title: "Main Boulevard Gridlock — Rush Hour",
    description: "Historical patterns + current congestion (87%) indicate full gridlock between 17:30–19:00. Estimated backlog of 4.2 km will form at Airport Connector interchange.",
    risk: "high",
    confidence: 87,
    eta: "Today 5:30 PM",
    etaMs: 3_600_000,
    affectedArea: "Main Boulevard, Airport Corridor",
    impact: "~15,000 commuters delayed by avg. 42 minutes",
    recommendation: "Activate traffic diversion via North Ring Road, deploy 6 officers",
    trend: "worsening",
    probability: 83,
    modelVersion: "TRAFFIC-XGB-v2.4",
  },
  {
    id: "PRED-003",
    system: "water",
    title: "Pipe Burst Risk — Zone E South",
    description: "Pressure sensor pattern shows micro-fluctuations consistent with pre-burst signatures. Zone E pipe section A43 shows 93% statistical match to 3 prior burst events.",
    risk: "critical",
    confidence: 78,
    eta: "24–48 hours",
    etaMs: 86_400_000,
    affectedArea: "Zone E - South District",
    impact: "~8,200 households without water, road flooding risk",
    recommendation: "Dispatch maintenance team immediately for proactive repair",
    trend: "worsening",
    probability: 74,
    modelVersion: "PIPE-ANOMALY-v1.8",
  },
  {
    id: "PRED-004",
    system: "flood",
    title: "Flash Flood Risk — Harbor Basin",
    description: "Meteorological data combined with drainage capacity models project 73mm rainfall over 3 hours. Three drainage channels at 88% capacity will overflow within 6 hours.",
    risk: "high",
    confidence: 81,
    eta: "Tomorrow 2:00 AM",
    etaMs: 21_600_000,
    affectedArea: "Harbor Area, Riverside",
    impact: "Potential property damage, road closures, emergency evacuations",
    recommendation: "Pre-position pumping units, send flood advisory to Harbor residents",
    trend: "stable",
    probability: 76,
    modelVersion: "FLOOD-HYDRO-v2.0",
  },
  {
    id: "PRED-005",
    system: "waste",
    title: "City Square Bin Overflow Imminent",
    description: "Fill rate model shows City Square bin (94%) will overflow in 40–70 minutes. Weekend foot traffic is 2.3× weekday average.",
    risk: "medium",
    confidence: 95,
    eta: "~1 hour",
    etaMs: 3_600_000,
    affectedArea: "City Square, Downtown",
    impact: "Public health hazard, illegally dumped waste spillover",
    recommendation: "Dispatch waste truck immediately — ETA should be < 30 min",
    trend: "worsening",
    probability: 93,
    modelVersion: "WASTE-FILL-v1.5",
  },
  {
    id: "PRED-006",
    system: "infrastructure",
    title: "Streetlight Grid Fault — North Sector",
    description: "Power consumption anomaly detected in North Sector grid node 7. Pattern matches pre-failure signature with 71% confidence. Potential blackout affecting 340 lights.",
    risk: "medium",
    confidence: 71,
    eta: "Tonight 11 PM",
    etaMs: 18_000_000,
    affectedArea: "North Ring Rd, Residential Block A–D",
    impact: "Safety risk for ~12,000 residents, increased crime risk",
    recommendation: "Send electrical inspection team to grid node 7 for preventive check",
    trend: "stable",
    probability: 68,
    modelVersion: "INFRA-FAULT-v1.2",
  },
  {
    id: "PRED-007",
    system: "aqi",
    title: "Smog Buildup — Downtown Morning Peak",
    description: "Wind speed forecast <2 km/h tomorrow morning combined with rush hour emissions will trap pollutants. AQI predicted to hit 165 between 7–10 AM.",
    risk: "high",
    confidence: 84,
    eta: "Tomorrow 7:00 AM",
    etaMs: 43_200_000,
    affectedArea: "Downtown, Central Ave",
    impact: "Vulnerable groups (elderly, children) at respiratory risk",
    recommendation: "Issue preventive air quality alert by midnight tonight",
    trend: "worsening",
    probability: 79,
    modelVersion: "AQI-LSTM-v3.1",
  },
  {
    id: "PRED-008",
    system: "traffic",
    title: "Airport Corridor Capacity Breach",
    description: "Two international flights arriving within 30 minutes of each other (18:15 & 18:45) will push Airport Corridor past 95% capacity. No shuttle diversions scheduled.",
    risk: "medium",
    confidence: 88,
    eta: "Today 6:15 PM",
    etaMs: 7_200_000,
    affectedArea: "Airport Corridor, Exit 3–5",
    impact: "~3,500 travelers delayed, taxi/rideshare congestion",
    recommendation: "Activate overflow parking routes, extend shuttle service schedule",
    trend: "stable",
    probability: 86,
    modelVersion: "TRAFFIC-XGB-v2.4",
  },
];

// AI Model Accuracy metrics
export const aiModelMetrics = [
  { model: "AQI Predictor", accuracy: 91.3, lastTrained: "2 days ago", predictions: 1248, correct: 1139, system: "aqi" },
  { model: "Traffic Forecaster", accuracy: 86.7, lastTrained: "1 day ago", predictions: 2890, correct: 2506, system: "traffic" },
  { model: "Pipe Burst Detector", accuracy: 78.4, lastTrained: "5 days ago", predictions: 342, correct: 268, system: "water" },
  { model: "Flood Risk Engine", accuracy: 82.1, lastTrained: "3 days ago", predictions: 189, correct: 155, system: "flood" },
  { model: "Waste Fill Forecast", accuracy: 94.8, lastTrained: "12 hours ago", predictions: 4120, correct: 3906, system: "waste" },
  { model: "Infra Fault Detector", accuracy: 71.2, lastTrained: "7 days ago", predictions: 156, correct: 111, system: "infrastructure" },
];

// Risk timeline for next 72 hours
export const riskTimeline = [
  { time: "Now", traffic: 87, aqi: 142, waste: 78, water: 45, infra: 30 },
  { time: "+2h", traffic: 92, aqi: 185, waste: 96, water: 52, infra: 32 },
  { time: "+4h", traffic: 85, aqi: 210, waste: 70, water: 58, infra: 35 },
  { time: "+6h", traffic: 70, aqi: 195, waste: 65, water: 60, infra: 38 },
  { time: "+12h", traffic: 45, aqi: 160, waste: 55, water: 68, infra: 42 },
  { time: "+24h", traffic: 55, aqi: 135, waste: 48, water: 75, infra: 45 },
  { time: "+48h", traffic: 60, aqi: 120, waste: 52, water: 80, infra: 50 },
  { time: "+72h", traffic: 65, aqi: 110, waste: 58, water: 85, infra: 55 },
];

export type AQIStatus = "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#10b981";
  if (aqi <= 100) return "#f59e0b";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  return "#dc2626";
}

export function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy";
  if (aqi <= 200) return "Very Unhealthy";
  return "Hazardous";
}

export function getCongestionColor(pct: number): string {
  if (pct <= 30) return "#10b981";
  if (pct <= 60) return "#f59e0b";
  if (pct <= 80) return "#f97316";
  return "#ef4444";
}

export function getBinColor(fill: number): string {
  if (fill <= 50) return "#10b981";
  if (fill <= 75) return "#f59e0b";
  if (fill <= 90) return "#f97316";
  return "#ef4444";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Critical": return "#ef4444";
    case "High": return "#f97316";
    case "Medium": return "#f59e0b";
    case "Low": return "#10b981";
    default: return "#94a3b8";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Open": return "#ef4444";
    case "In Progress": return "#f59e0b";
    case "Resolved": return "#10b981";
    default: return "#94a3b8";
  }
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#f59e0b";
    case "low": return "#10b981";
  }
}

export function getRiskBg(risk: RiskLevel): string {
  switch (risk) {
    case "critical": return "rgba(239, 68, 68, 0.1)";
    case "high": return "rgba(249, 115, 22, 0.1)";
    case "medium": return "rgba(245, 158, 11, 0.08)";
    case "low": return "rgba(16, 185, 129, 0.08)";
  }
}

export function getSystemIcon(system: PredictionSystem): string {
  switch (system) {
    case "traffic": return "🚦";
    case "aqi": return "🌫️";
    case "waste": return "🗑️";
    case "water": return "💧";
    case "infrastructure": return "⚡";
    case "flood": return "🌊";
  }
}

export function getSystemColor(system: PredictionSystem): string {
  switch (system) {
    case "traffic": return "#f59e0b";
    case "aqi": return "#ef4444";
    case "waste": return "#10b981";
    case "water": return "#3b82f6";
    case "infrastructure": return "#8b5cf6";
    case "flood": return "#00d4ff";
  }
}
