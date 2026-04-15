'use client';

import { waterZones, waterHistory } from '@/lib/mockData';
import { Droplets, ThermometerSun, Gauge, AlertTriangle, Shield } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, ComposedChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area
} from 'recharts';

function WaterQualityRing({ quality }: { quality: number }) {
  const color = quality >= 95 ? '#10b981' : quality >= 85 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 34;
  const pct = quality / 100;
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="44" cy="44" r="34" fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90, 44, 44)"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x="44" y="48" textAnchor="middle" fill={color} fontSize="14" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">{quality}%</text>
    </svg>
  );
}

export default function WaterPage() {
  const avgPressure = Math.round(waterZones.reduce((s, z) => s + z.pressure, 0) / waterZones.length);
  const avgQuality = (waterZones.reduce((s, z) => s + z.quality, 0) / waterZones.length).toFixed(1);
  const criticalZones = waterZones.filter(z => z.status === 'Critical').length;
  const totalFlow = waterZones.reduce((s, z) => s + z.flow, 0);

  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avg Pressure', value: `${avgPressure} PSI`, icon: Gauge, color: '#3b82f6', sub: 'City average' },
          { label: 'Water Quality', value: `${avgQuality}%`, icon: Shield, color: '#10b981', sub: 'Potability index' },
          { label: 'Critical Zones', value: criticalZones, icon: AlertTriangle, color: '#ef4444', sub: 'Require attention' },
          { label: 'Total Flow', value: `${totalFlow.toLocaleString()} L/h`, icon: Droplets, color: '#00d4ff', sub: 'Combined output' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Zone Cards */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-title">Zone Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {waterZones.map((zone) => (
            <div key={zone.id} style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${zone.status === 'Critical' ? 'rgba(239,68,68,0.3)' : zone.status === 'Warning' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.15)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', lineHeight: 1.3 }}>{zone.zone}</div>
                <span className={`badge ${zone.status === 'Critical' ? 'badge-red' : zone.status === 'Warning' ? 'badge-orange' : 'badge-green'}`}>
                  {zone.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <WaterQualityRing quality={Math.round(zone.quality)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                <div style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(59, 130, 246, 0.08)' }}>
                  <div style={{ color: '#475569' }}>Pressure</div>
                  <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 13 }}>{zone.pressure} PSI</div>
                </div>
                <div style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(0, 212, 255, 0.08)' }}>
                  <div style={{ color: '#475569' }}>Flow</div>
                  <div style={{ color: '#00d4ff', fontWeight: 700, fontSize: 13 }}>{zone.flow} L/h</div>
                </div>
                <div style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.08)', gridColumn: '1/-1' }}>
                  <div style={{ color: '#475569' }}>Temperature</div>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>{zone.tempC}°C</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Weekly Consumption (Liters)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={waterHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="consumption" name="Consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Pressure Trend (PSI)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={waterHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="pressure" name="Pressure" stroke="#00d4ff" strokeWidth={2.5} dot={{ fill: '#00d4ff', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
