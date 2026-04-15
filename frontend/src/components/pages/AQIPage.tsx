'use client';

import { aqiZones, aqiHistory, getAQIColor, getAQIStatus } from '@/lib/mockData';
import { Wind, Thermometer, Eye, Activity, Leaf } from 'lucide-react';
import { downloadText, toCSV } from '@/lib/exporters';
import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(13, 22, 41, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: AQI {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function AQIGauge({ value, size = 120 }: { value: number; size?: number }) {
  const maxAqi = 300;
  const pct = Math.min(value / maxAqi, 1);
  const color = getAQIColor(value);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - pct * 0.75);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeDasharray={`${circumference * 0.75} ${circumference}`} strokeDashoffset={circumference * 0.125} strokeLinecap="round" transform="rotate(135, 60, 60)" />
      <circle cx="60" cy="60" r="45" fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${circumference * 0.75} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(135, 60, 60)" style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 0.5s ease' }} />
      <text x="60" y="54" textAnchor="middle" fill={color} fontSize="22" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">{value}</text>
      <text x="60" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">AQI</text>
    </svg>
  );
}

const radarData = [
  { subject: 'PM2.5', A: 78, fullMark: 100 },
  { subject: 'PM10', A: 65, fullMark: 100 },
  { subject: 'CO', A: 42, fullMark: 100 },
  { subject: 'NO2', A: 88, fullMark: 100 },
  { subject: 'SO2', A: 35, fullMark: 100 },
  { subject: 'O3', A: 55, fullMark: 100 },
];

export default function AQIPage() {
  const cityAvg = Math.round(aqiZones.reduce((s, z) => s + z.aqi, 0) / aqiZones.length);
  const worstZone = aqiZones.reduce((max, z) => z.aqi > max.aqi ? z : max);
  const bestZone = aqiZones.reduce((min, z) => z.aqi < min.aqi ? z : min);

  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'City Average AQI', value: cityAvg, color: getAQIColor(cityAvg), sub: getAQIStatus(cityAvg), icon: Wind },
          { label: 'Worst Zone', value: worstZone.aqi, color: getAQIColor(worstZone.aqi), sub: worstZone.name, icon: Activity },
          { label: 'Best Zone', value: bestZone.aqi, color: getAQIColor(bestZone.aqi), sub: bestZone.name, icon: Leaf },
          { label: 'Zones > 150', value: aqiZones.filter(z => z.aqi > 150).length, color: '#ef4444', sub: 'requires action', icon: Eye },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Zone Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {aqiZones.map((zone) => {
          const color = getAQIColor(zone.aqi);
          const status = getAQIStatus(zone.aqi);
          return (
            <div key={zone.id} className="glass-card glass-card-hover" style={{ padding: 20, textAlign: 'center' }}>
              <AQIGauge value={zone.aqi} size={110} />
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: 15, color: '#f0f6ff' }}>{zone.name}</div>
              <span className={`badge ${zone.aqi <= 50 ? 'badge-green' : zone.aqi <= 100 ? 'badge-orange' : zone.aqi <= 150 ? 'badge-orange' : 'badge-red'}`} style={{ marginTop: 8, display: 'inline-block' }}>
                {status}
              </span>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, textAlign: 'left' }}>
                <div style={{ color: '#475569' }}>PM2.5 <span style={{ color: '#f0f6ff', fontWeight: 600 }}>{zone.pm25}</span></div>
                <div style={{ color: '#475569' }}>PM10 <span style={{ color: '#f0f6ff', fontWeight: 600 }}>{zone.pm10}</span></div>
                <div style={{ color: '#475569' }}>CO <span style={{ color: '#f0f6ff', fontWeight: 600 }}>{zone.co}</span></div>
                <div style={{ color: '#475569' }}>NO₂ <span style={{ color: '#f0f6ff', fontWeight: 600 }}>{zone.no2}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>24-Hour AQI Trends by Zone</div>
            <button
              className="btn-secondary"
              style={{ height: 36, fontSize: 12 }}
              onClick={() => {
                const csv = toCSV(aqiHistory as any[]);
                downloadText('aqi-history.csv', csv, 'text/csv;charset=utf-8');
              }}
            >
              Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={aqiHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                {['downtown', 'industrial', 'residential', 'greenPark'].map((zone, i) => {
                  const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];
                  return (
                    <linearGradient key={zone} id={`grad-${zone}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[i]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} interval={3} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="industrial" name="Industrial" stroke="#f97316" fill="url(#grad-industrial)" strokeWidth={2} />
              <Area type="monotone" dataKey="downtown" name="Downtown" stroke="#ef4444" fill="url(#grad-downtown)" strokeWidth={2} />
              <Area type="monotone" dataKey="residential" name="Residential" stroke="#f59e0b" fill="url(#grad-residential)" strokeWidth={2} />
              <Area type="monotone" dataKey="greenPark" name="Green Park" stroke="#10b981" fill="url(#grad-greenPark)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Pollutant Radar</div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Pollution" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: 12, color: '#f0f6ff', textAlign: 'center', marginTop: 8 }}>
            ⚠️ NO₂ levels critical in Industrial zone
          </div>
        </div>
      </div>
    </div>
  );
}
