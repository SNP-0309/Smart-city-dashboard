'use client';

import { useMemo, useState } from 'react';
import {
  buildingStats,
  upcomingInfrastructure,
  governmentProjects,
  serviceNotices,
  infrastructureLocations,
  type InfrastructureProject,
  type ServiceNotice,
  type InfraLocation,
} from '@/lib/mockData';
import { Building2, Landmark, MapPin, Megaphone, Calendar, BadgeInfo, X } from 'lucide-react';

function statusBadge(status: InfrastructureProject['status']) {
  if (status === 'completed') return { cls: 'badge-green', label: 'Completed' };
  if (status === 'in_progress') return { cls: 'badge-orange', label: 'In progress' };
  if (status === 'delayed') return { cls: 'badge-red', label: 'Delayed' };
  return { cls: 'badge-cyan', label: 'Planned' };
}

function severityBadge(sev: ServiceNotice['severity']) {
  if (sev === 'critical') return { cls: 'badge-red', label: 'Critical' };
  if (sev === 'warning') return { cls: 'badge-orange', label: 'Warning' };
  return { cls: 'badge-cyan', label: 'Info' };
}

export default function InfrastructurePage() {
  const [selected, setSelected] = useState<InfraLocation | null>(null);

  const allProjects = useMemo(() => [...upcomingInfrastructure, ...governmentProjects], []);
  const selectedProject = useMemo(
    () => (selected ? allProjects.find((p) => p.lat === selected.lat && p.lng === selected.lng) ?? null : null),
    [allProjects, selected],
  );
  const selectedNotice = useMemo(
    () => (selected ? serviceNotices.find((n) => n.lat === selected.lat && n.lng === selected.lng) ?? null : null),
    [selected],
  );

  return (
    <div className="page-enter" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Buildings', value: buildingStats.totalBuildings.toLocaleString(), icon: Building2, color: '#3b82f6', sub: 'registered structures' },
          { label: 'Smart Buildings', value: buildingStats.smartBuildings.toLocaleString(), icon: BadgeInfo, color: '#00d4ff', sub: 'IoT-enabled facilities' },
          { label: 'Public Buildings', value: buildingStats.publicBuildings.toLocaleString(), icon: Landmark, color: '#8b5cf6', sub: 'schools, offices, etc.' },
          { label: 'Critical Facilities', value: buildingStats.criticalFacilities.toLocaleString(), icon: Megaphone, color: '#ef4444', sub: 'hospitals, fire, etc.' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{stat.label}</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Projects + Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Upcoming Infrastructure & Government Projects</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allProjects.map((p) => {
              const b = statusBadge(p.status);
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    setSelected({
                      id: p.id,
                      name: p.title,
                      category: 'Project',
                      area: p.area,
                      address: p.address,
                      lat: p.lat,
                      lng: p.lng,
                    })
                  }
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge ${b.cls}`}>{b.label}</span>
                      <span className="badge badge-purple">{p.program}</span>
                      <span className="badge badge-cyan">{p.owner}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#475569' }}>{p.id}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 14, color: '#f0f6ff', fontWeight: 800 }}>{p.title}</div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} /> {p.area}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} /> ETA {p.eta}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Budget ₹{p.budgetCr} Cr</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#475569', lineHeight: 1.45 }}>{p.summary}</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>{p.address}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Service Notices</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {serviceNotices.map((n) => {
              const b = severityBadge(n.severity);
              return (
                <button
                  key={n.id}
                  onClick={() =>
                    setSelected({
                      id: n.id,
                      name: n.title,
                      category: 'Service',
                      area: n.affectedArea,
                      address: n.address,
                      lat: n.lat,
                      lng: n.lng,
                    })
                  }
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: 14,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <span className={`badge ${b.cls}`}>{b.label}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{n.id}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, color: '#f0f6ff', fontWeight: 800 }}>{n.title}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>{n.window}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#475569', lineHeight: 1.45 }}>{n.details}</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>{n.affectedArea} • {n.address}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Locations (All)</div>
          <span style={{ fontSize: 12, color: '#475569' }}>{infrastructureLocations.length} locations</span>
        </div>

        <div className="responsive-table">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Type', 'Name', 'Area', 'Address', 'Coordinates'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {infrastructureLocations.map((loc) => (
                <tr
                  key={loc.id}
                  className="table-row"
                  onClick={() => setSelected(loc)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view"
                >
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${loc.category === 'Building' ? 'badge-blue' : loc.category === 'Project' ? 'badge-purple' : 'badge-cyan'}`}>
                      {loc.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: '#f0f6ff', fontWeight: 800 }}>{loc.name}</td>
                  <td style={{ padding: '14px', color: '#94a3b8' }}>{loc.area}</td>
                  <td style={{ padding: '14px', color: '#94a3b8' }}>{loc.address}</td>
                  <td style={{ padding: '14px', color: '#475569', fontSize: 12 }}>
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location popup */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Infrastructure details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div className="glass-card" style={{ width: 'min(720px, 100%)', padding: 20, borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 900, color: '#f0f6ff' }}>
                  {selected.name}
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`badge ${selected.category === 'Building' ? 'badge-blue' : selected.category === 'Project' ? 'badge-purple' : 'badge-cyan'}`}>
                    {selected.category}
                  </span>
                  <span className="badge badge-orange">{selected.area}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{selected.address}</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Close"
              >
                <X size={16} color="#94a3b8" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                { k: 'Location', v: selected.area },
                { k: 'Address', v: selected.address },
                { k: 'Latitude', v: selected.lat.toFixed(5) },
                { k: 'Longitude', v: selected.lng.toFixed(5) },
              ].map((row) => (
                <div key={row.k} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>{row.k}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#f0f6ff', fontWeight: 800 }}>{row.v}</div>
                </div>
              ))}
            </div>

            {selectedProject && (
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Project</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{selectedProject.owner}</span>
                  <span className="badge badge-purple">{selectedProject.program}</span>
                  <span className={`badge ${statusBadge(selectedProject.status).cls}`}>{statusBadge(selectedProject.status).label}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>
                  Start: {selectedProject.startDate} • ETA: {selectedProject.eta} • Budget: ₹{selectedProject.budgetCr} Cr
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: '#f0f6ff', lineHeight: 1.5 }}>{selectedProject.summary}</div>
              </div>
            )}

            {selectedNotice && (
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Service Notice</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`badge ${severityBadge(selectedNotice.severity).cls}`}>{severityBadge(selectedNotice.severity).label}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{selectedNotice.window}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: '#f0f6ff', lineHeight: 1.5 }}>{selectedNotice.details}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

