'use client';

import { overviewStats, getAQIStatus, getAQIColor, alerts, trafficZones, aqiZones, complaints } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import { 
  MessageSquare, Wind, Car, Bell, CheckCircle, Droplets,
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { aqiHistory, complaintsByType, trafficHistory } from '@/lib/mockData';

const metricCards = [
  {
    key: 'totalComplaints',
    label: 'Total Complaints',
    value: '247',
    change: '+12 today',
    changePositive: false,
    icon: MessageSquare,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  {
    key: 'aqiAverage',
    label: 'City-wide AQI',
    value: '112',
    change: '↑ Unhealthy',
    changePositive: false,
    icon: Wind,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.2)',
  },
  {
    key: 'trafficCongestion',
    label: 'Avg Congestion',
    value: '68%',
    change: '+5% from yesterday',
    changePositive: false,
    icon: Car,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
  },
  {
    key: 'activeAlerts',
    label: 'Active Alerts',
    value: '18',
    change: '3 resolved today',
    changePositive: true,
    icon: Bell,
    color: '#00d4ff',
    bg: 'rgba(0, 212, 255, 0.1)',
    border: 'rgba(0, 212, 255, 0.2)',
  },
  {
    key: 'resolvedComplaints',
    label: 'Resolved Today',
    value: '189',
    change: '+22 this week',
    changePositive: true,
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
  },
  {
    key: 'waterQuality',
    label: 'Water Quality',
    value: '94.5%',
    change: '1 zone critical',
    changePositive: false,
    icon: Droplets,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
  },
];

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#00d4ff', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13, 22, 41, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 12,
      }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OverviewPage() {
  const { live } = useAppStore();
  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  const severeCongestion = trafficZones.filter(z => z.congestion > 75);
  const criticalAqi = aqiZones.filter(z => z.aqi > 150);

  const liveAqi = typeof live.aqi_city_avg === 'number' ? live.aqi_city_avg : overviewStats.aqiAverage.value;
  const liveTraffic = typeof live.traffic_congestion_avg === 'number' ? live.traffic_congestion_avg : overviewStats.trafficCongestion.value;
  const liveComplaints = typeof live.active_complaints === 'number' ? live.active_complaints : complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div className="page-enter" style={{ padding: '24px' }}>
      
      {/* Hero Banner */}
      <div style={{
        borderRadius: 20,
        padding: '24px 32px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Activity size={20} color="#00d4ff" />
            <span className="live-indicator">System Online</span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: '#f0f6ff', marginBottom: 6 }}>
            MetroCity Control Center
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>Real-time urban monitoring across all city systems</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{criticalAlerts.length}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Critical Alerts</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f97316' }}>{severeCongestion.length}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Roads Jammed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#8b5cf6' }}>{complaints.filter(c => c.status === 'Open').length}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Open Issues</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="metric-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color={card.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: card.changePositive ? '#10b981' : '#ef4444' }}>
                  {card.changePositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: card.color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>
                {card.key === 'aqiAverage'
                  ? String(liveAqi)
                  : card.key === 'trafficCongestion'
                    ? `${liveTraffic}%`
                    : card.key === 'totalComplaints'
                      ? String(liveComplaints)
                      : card.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: card.changePositive ? '#10b981' : '#ef4444' }}>{card.change}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        
        {/* AQI Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>AQI Trend — Last 24 Hours</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={aqiHistory.slice(0, 12)} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="aqiDowntown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aqiIndustrial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aqiGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="industrial" name="Industrial" stroke="#f97316" fill="url(#aqiIndustrial)" strokeWidth={2} />
              <Area type="monotone" dataKey="downtown" name="Downtown" stroke="#ef4444" fill="url(#aqiDowntown)" strokeWidth={2} />
              <Area type="monotone" dataKey="greenPark" name="Green Park" stroke="#10b981" fill="url(#aqiGreen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Types */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Complaints by Type</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={complaintsByType} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {complaintsByType.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {complaintsByType.slice(0, 4).map((entry) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
                {entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic + Alerts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        {/* Traffic Congestion Bar Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>Traffic Congestion by Road</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trafficZones.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis dataKey="road" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Congestion']} />
              <Bar dataKey="congestion" name="Congestion" radius={[0, 4, 4, 0]}>
                {trafficZones.slice(0, 5).map((entry, index) => (
                  <Cell key={index} fill={entry.congestion > 75 ? '#ef4444' : entry.congestion > 50 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Alerts */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Live Alerts</div>
            <span className="live-indicator">Real-time</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                background: alert.type === 'critical'
                  ? 'rgba(239, 68, 68, 0.08)'
                  : alert.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.08)'
                  : 'rgba(59, 130, 246, 0.08)',
                border: `1px solid ${alert.type === 'critical' ? 'rgba(239, 68, 68, 0.2)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
              }}>
                <AlertTriangle size={14} color={alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6'} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#f0f6ff', lineHeight: 1.4 }}>{alert.message}</p>
                  <span style={{ fontSize: 11, color: '#475569', marginTop: 2, display: 'block' }}>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ width: '100%', marginTop: 16, justifyContent: 'center', fontSize: 13 }}>
            View All Alerts <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
