'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MapMarker } from '@/components/CityMap';
import { complaints, trafficZones, waterZones, wasteBins } from '@/lib/mockData';
import { Map, Layers, MessageSquare, Car, Droplets, Trash2 } from 'lucide-react';

type LayerKey = 'complaints' | 'traffic' | 'water' | 'waste';

const CityMap = dynamic(() => import('@/components/CityMap'), {
  ssr: false,
  loading: () => <div className="glass-card skeleton" style={{ height: 560 }} />,
});

export default function MapPage() {
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    complaints: true,
    traffic: true,
    water: true,
    waste: true,
  });

  const markers = useMemo<MapMarker[]>(() => {
    const out: MapMarker[] = [];

    if (layers.complaints) {
      complaints.forEach((c) => {
        if (typeof (c as any).lat !== 'number' || typeof (c as any).lng !== 'number') return;
        out.push({
          id: c.id,
          kind: 'complaint',
          title: `${c.type} • ${c.id}`,
          subtitle: `${c.area} — ${c.location}`,
          severity: c.priority === 'Critical' ? 'critical' : c.priority === 'High' ? 'warning' : 'good',
          lat: (c as any).lat,
          lng: (c as any).lng,
          meta: { Status: c.status, Priority: c.priority, Reported: c.reportedBy },
        });
      });
    }

    if (layers.traffic) {
      trafficZones.forEach((z: any) => {
        if (typeof z.lat !== 'number' || typeof z.lng !== 'number') return;
        out.push({
          id: `TRF-${z.id}`,
          kind: 'traffic',
          title: z.road,
          subtitle: `Status: ${z.status}`,
          severity: z.congestion >= 85 ? 'critical' : z.congestion >= 65 ? 'warning' : 'good',
          lat: z.lat,
          lng: z.lng,
          meta: { Congestion: `${z.congestion}%`, Speed: `${z.speed} km/h`, Vehicles: z.vehicles },
        });
      });
    }

    if (layers.water) {
      waterZones.forEach((w: any) => {
        if (typeof w.lat !== 'number' || typeof w.lng !== 'number') return;
        out.push({
          id: `WTR-${w.id}`,
          kind: 'water',
          title: w.zone,
          subtitle: `Pressure: ${w.pressure} PSI • Quality: ${w.quality}%`,
          severity: w.status === 'Critical' ? 'critical' : w.status === 'Warning' ? 'warning' : 'good',
          lat: w.lat,
          lng: w.lng,
          meta: { Status: w.status, Flow: w.flow, TempC: w.tempC },
        });
      });
    }

    if (layers.waste) {
      wasteBins.forEach((b: any) => {
        if (typeof b.lat !== 'number' || typeof b.lng !== 'number') return;
        out.push({
          id: `WST-${b.id}`,
          kind: 'waste',
          title: `Bin #${b.id} • ${b.location}`,
          subtitle: `Fill: ${b.fill}% • ${b.type}`,
          severity: b.status === 'Critical' ? 'critical' : b.status === 'Warning' ? 'warning' : 'good',
          lat: b.lat,
          lng: b.lng,
          meta: { Status: b.status, LastPickup: b.lastPickup },
        });
      });
    }

    return out;
  }, [layers]);

  return (
    <div className="page-enter" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={18} color="#00d4ff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 900, color: '#f0f6ff' }}>Live City Map</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Complaints, traffic, water, and waste markers</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 10, borderRadius: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12, fontWeight: 800 }}>
            <Layers size={16} /> Layers
          </div>

          {([
            { key: 'complaints', label: 'Complaints', icon: MessageSquare, color: '#00d4ff' },
            { key: 'traffic', label: 'Traffic', icon: Car, color: '#f97316' },
            { key: 'water', label: 'Water', icon: Droplets, color: '#3b82f6' },
            { key: 'waste', label: 'Waste', icon: Trash2, color: '#10b981' },
          ] as const).map((l) => {
            const Icon = l.icon;
            const on = layers[l.key];
            return (
              <button
                key={l.key}
                onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                className={on ? 'btn-primary' : 'btn-secondary'}
                style={{
                  padding: '8px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  background: on ? `${l.color}22` : undefined,
                  border: on ? `1px solid ${l.color}35` : undefined,
                  color: on ? l.color : undefined,
                }}
              >
                <Icon size={14} />
                {l.label}
              </button>
            );
          })}

          <span style={{ marginLeft: 4, fontSize: 12, color: '#475569', fontWeight: 700 }}>{markers.length} markers</span>
        </div>
      </div>

      <CityMap markers={markers} />
    </div>
  );
}

