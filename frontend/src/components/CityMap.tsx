'use client';

import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export type MapMarker = {
  id: string;
  kind: 'complaint' | 'traffic' | 'water' | 'waste';
  title: string;
  subtitle?: string;
  severity?: 'good' | 'warning' | 'critical';
  lat: number;
  lng: number;
  meta?: Record<string, string | number>;
};

function iconFor(kind: MapMarker['kind'], severity?: MapMarker['severity']) {
  const color =
    severity === 'critical' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : kind === 'water' ? '#3b82f6' : kind === 'waste' ? '#10b981' : kind === 'traffic' ? '#f97316' : '#00d4ff';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 14px; height: 14px; border-radius: 999px;
        background: ${color};
        box-shadow: 0 0 0 4px rgba(255,255,255,0.12), 0 0 22px ${color}55;
        border: 2px solid rgba(6, 11, 24, 0.9);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

export default function CityMap({
  markers,
  center = [40.7128, -74.006] as [number, number],
  zoom = 12,
  height = 520,
}: {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: number;
}) {
  // Fix Leaflet default icon URLs for Next bundling (even though we use divIcon,
  // keeping this avoids surprises if any marker uses default icon).
  useEffect(() => {
    (L.Icon.Default.prototype as any)._getIconUrl = undefined;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
      iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
      shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
    });
  }, []);

  const bounds = useMemo(() => {
    if (!markers.length) return null;
    const latLngs = markers.map((m) => L.latLng(m.lat, m.lng));
    return L.latLngBounds(latLngs);
  }, [markers]);

  return (
    <div className="glass-card" style={{ padding: 12 }}>
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height, width: '100%' }}
          scrollWheelZoom
          ref={(map) => {
            if (!map || !bounds) return;
            // Fit once when map instance becomes available
            map.fitBounds(bounds.pad(0.25));
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={iconFor(m.kind, m.severity)}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{m.title}</div>
                  {m.subtitle && <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>{m.subtitle}</div>}
                  {m.meta && (
                    <div style={{ display: 'grid', gap: 4 }}>
                      {Object.entries(m.meta).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
                          <span style={{ opacity: 0.7 }}>{k}</span>
                          <span style={{ fontWeight: 700 }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

