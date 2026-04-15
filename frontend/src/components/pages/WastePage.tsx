'use client';

import { wasteBins, wasteCollectionByArea, getBinColor } from '@/lib/mockData';
import { Trash2, Truck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';

function FilledBin({ fill }: { fill: number }) {
  const color = getBinColor(fill);
  return (
    <div style={{ position: 'relative', width: 44, height: 52 }}>
      {/* Bin icon */}
      <svg viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 52 }}>
        <rect x="4" y="12" width="36" height="38" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <rect x="4" y={12 + (38 * (1 - fill / 100))} width="36" height={38 * fill / 100} rx="2" fill={color} opacity="0.7" />
        <rect x="2" y="6" width="40" height="8" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <line x1="16" y1="6" x2="16" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="6" x2="28" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="2" x2="30" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function WastePage() {
  const criticalBins = wasteBins.filter(b => b.fill >= 90).length;
  const warningBins = wasteBins.filter(b => b.fill >= 75 && b.fill < 90).length;
  const goodBins = wasteBins.filter(b => b.fill < 75).length;
  const avgFill = Math.round(wasteBins.reduce((s, b) => s + b.fill, 0) / wasteBins.length);

  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Critical Bins', value: criticalBins, icon: AlertTriangle, color: '#ef4444', sub: 'Need immediate pickup' },
          { label: 'Warning Bins', value: warningBins, icon: Clock, color: '#f59e0b', sub: 'Schedule pickup' },
          { label: 'Good Bins', value: goodBins, icon: CheckCircle, color: '#10b981', sub: 'Normal operation' },
          { label: 'Avg Fill Level', value: `${avgFill}%`, icon: Trash2, color: '#3b82f6', sub: 'City-wide' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Bin Grid */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Smart Bin Status</div>
          <button className="btn-primary" style={{ fontSize: 12 }}>
            <Truck size={14} /> Dispatch Trucks
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {wasteBins.map((bin) => {
            const color = getBinColor(bin.fill);
            return (
              <div key={bin.id} className="glass-card-hover" style={{
                padding: 16,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${bin.fill >= 90 ? 'rgba(239, 68, 68, 0.25)' : bin.fill >= 75 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)'}`,
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <FilledBin fill={bin.fill} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>{bin.location}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>{bin.fill}%</div>
                <span className={`badge ${bin.status === 'Critical' ? 'badge-red' : bin.status === 'Warning' ? 'badge-orange' : 'badge-green'}`} style={{ display: 'inline-block', marginBottom: 8 }}>
                  {bin.status}
                </span>
                <div style={{ fontSize: 11, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{bin.type}</span>
                  <span>{bin.lastPickup}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collection Bar Chart */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-title">Waste Collection by Area (kg)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={wasteCollectionByArea} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="area" tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.06)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
