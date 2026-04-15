'use client';

import { aqiHistory, trafficHistory, complaintsByArea, wasteCollectionByArea } from '@/lib/mockData';
import { TrendingUp, TrendingDown, BarChart2, Activity, Zap } from 'lucide-react';
import {
  ComposedChart, Bar, Line, Area, AreaChart, BarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  complaints: Math.round(30 + Math.random() * 20),
  resolved: Math.round(20 + Math.random() * 15),
  airQuality: Math.round(80 + Math.sin(i) * 30 + Math.random() * 20),
  traffic: Math.round(50 + Math.sin(i * 0.8) * 25 + Math.random() * 15),
}));

export default function AnalyticsPage() {
  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'City Health Score', value: '72', unit: '/100', trend: '+4', positive: true, color: '#10b981', desc: 'Combined all factors' },
          { label: 'Response Efficiency', value: '84', unit: '%', trend: '+7%', positive: true, color: '#3b82f6', desc: 'Complaints resolved' },
          { label: 'Pollution Index', value: '63', unit: '/100', trend: '-5', positive: true, color: '#f59e0b', desc: 'Lower is better' },
          { label: 'Infrastructure Load', value: '78', unit: '%', positive: false, trend: '+2%', color: '#ef4444', desc: 'System capacity' },
        ].map((kpi) => (
          <div key={kpi.label} className="metric-card">
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: kpi.color, fontFamily: "'Space Grotesk', sans-serif" }}>{kpi.value}</span>
              <span style={{ fontSize: 14, color: '#475569' }}>{kpi.unit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {kpi.positive ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
              <span style={{ fontSize: 12, color: kpi.positive ? '#10b981' : '#ef4444', fontWeight: 600 }}>{kpi.trend}</span>
              <span style={{ fontSize: 11, color: '#475569' }}>vs last week</span>
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Weekly Overview */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-title">Weekly City Overview</div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Bar yAxisId="left" dataKey="complaints" name="Complaints" fill="rgba(239, 68, 68, 0.6)" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="left" dataKey="resolved" name="Resolved" fill="rgba(16, 185, 129, 0.6)" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="traffic" name="Traffic %" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="airQuality" name="AQI" stroke="#ef4444" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Complaints by Area</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={complaintsByArea} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="area" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Complaints" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Waste Collection vs Target</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wasteCollectionByArea} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="area" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
