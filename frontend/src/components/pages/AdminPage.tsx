'use client';

import { complaints, wasteBins, aqiZones, trafficZones, alerts } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import { Users, Settings, Shield, AlertTriangle, CheckCircle, RefreshCw, Database, Cpu, Activity, MessageSquare, Trash2, Zap, X, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getFeedbackStorageKey, type FeedbackEntry } from '@/components/FeedbackModal';

const mockUsers = [
  { id: 1, name: 'John D.', role: 'citizen', complaints: 3, location: 'Downtown', joined: '2025-01-15', status: 'Active' },
  { id: 2, name: 'Sarah M.', role: 'citizen', complaints: 7, location: 'Harbor', joined: '2025-02-20', status: 'Active' },
  { id: 3, name: 'Tom W.', role: 'admin', complaints: 0, location: 'City Hall', joined: '2024-11-10', status: 'Active' },
  { id: 4, name: 'Lisa K.', role: 'citizen', complaints: 2, location: 'Industrial', joined: '2025-03-05', status: 'Inactive' },
  { id: 5, name: 'Mike T.', role: 'citizen', complaints: 5, location: 'North', joined: '2025-01-30', status: 'Active' },
];

const systemHealth = [
  { name: 'API Server', status: 'Operational', latency: '12ms', uptime: '99.97%', icon: Cpu },
  { name: 'Database', status: 'Operational', latency: '3ms', uptime: '100%', icon: Database },
  { name: 'WebSocket', status: 'Operational', latency: '8ms', uptime: '99.85%', icon: Activity },
  { name: 'AI Engine', status: 'Degraded', latency: '248ms', uptime: '96.2%', icon: Settings },
  { name: 'Notification Service', status: 'Operational', latency: '45ms', uptime: '99.91%', icon: AlertTriangle },
];

export default function AdminPage() {
  const { role, logs, addLog } = useAppStore();
  const [activeTab, setActiveTab] = useState<'users' | 'complaints' | 'system' | 'settings' | 'feedback' | 'logs'>('users');

  const SETTINGS_KEY = 'metrocity_admin_settings_v1';
  const defaultSettings = useMemo(
    () => ({
      maintenanceMode: false,
      demoMode: true,
      enableAI: true,
      enableNotifications: true,
      refreshIntervalSec: 30,
      aqiCritical: 150,
      trafficAlertPct: 80,
      binFillCriticalPct: 90,
      maxOpenComplaints: 500,
      cityName: 'MetroCity',
    }),
    [],
  );
  const [settings, setSettings] = useState(defaultSettings);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const COMPLAINTS_KEY = 'metrocity_admin_complaints_v1';
  const [complaintsState, setComplaintsState] = useState(complaints);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const selectedComplaint = useMemo(
    () => complaintsState.find((c) => c.id === selectedComplaintId) ?? null,
    [complaintsState, selectedComplaintId],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...defaultSettings, ...(JSON.parse(raw) || {}) });
    } catch {
      // ignore
    }
  }, [defaultSettings]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COMPLAINTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setComplaintsState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaintsState));
    } catch {
      // ignore
    }
  }, [complaintsState]);

  useEffect(() => {
    if (activeTab !== 'feedback') return;
    try {
      const raw = window.localStorage.getItem(getFeedbackStorageKey());
      const parsed = raw ? JSON.parse(raw) : [];
      setFeedback(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFeedback([]);
    }
  }, [activeTab]);

  const saveSettings = () => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast.success('Admin settings saved.');
    } catch {
      toast.error('Could not save settings.');
    }
  };

  if (role !== 'admin') {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <Shield size={64} color="#ef4444" opacity={0.3} />
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: '#f0f6ff' }}>Access Restricted</h2>
        <p style={{ fontSize: 14, color: '#475569' }}>This section is only accessible to Administrators</p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
      {/* Admin Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: mockUsers.length, icon: Users, color: '#3b82f6' },
          { label: 'Active Complaints', value: complaintsState.filter(c => c.status !== 'Resolved').length, icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Resolved Today', value: complaintsState.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: '#10b981' },
          { label: 'Critical Alerts', value: alerts.filter(a => a.type === 'critical').length, icon: Shield, color: '#ef4444' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                </div>
                <Icon size={32} color={s.color} opacity={0.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { key: 'users', label: 'User Management' },
          { key: 'complaints', label: 'Complaints' },
          { key: 'system', label: 'System Health' },
          { key: 'settings', label: 'Settings' },
          { key: 'feedback', label: 'Feedback' },
          { key: 'logs', label: 'System Logs' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '8px 18px',
              borderRadius: 7,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === tab.key ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
              color: activeTab === tab.key ? '#00d4ff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Registered Users</div>
            <button className="btn-primary" style={{ fontSize: 12 }}>+ Add User</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['#', 'Name', 'Role', 'Location', 'Complaints', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td style={{ padding: '14px', color: '#475569', fontSize: 12 }}>#{user.id}</td>
                  <td style={{ padding: '14px', color: '#f0f6ff', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${user.id * 60}, 60%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-purple' : 'badge-cyan'}`}>{user.role}</span>
                  </td>
                  <td style={{ padding: '14px', color: '#94a3b8' }}>{user.location}</td>
                  <td style={{ padding: '14px', color: '#f59e0b', fontWeight: 700 }}>{user.complaints}</td>
                  <td style={{ padding: '14px', color: '#475569', fontSize: 12 }}>{user.joined}</td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{user.status}</span>
                  </td>
                  <td style={{ padding: '14px', display: 'flex', gap: 8 }}>
                    <button style={{ fontSize: 11, color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                    <button style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div>
              <div className="section-title" style={{ marginBottom: 0 }}>Complaints</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                Click a complaint to view details and mark as solved.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-orange">{complaintsState.filter(c => c.status !== 'Resolved').length} open</span>
              <span className="badge badge-green">{complaintsState.filter(c => c.status === 'Resolved').length} solved</span>
            </div>
          </div>

          <div className="responsive-table">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['ID', 'Type', 'Status', 'Priority', 'Area', 'Location', 'Reported By', 'Time'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaintsState.map((c) => (
                  <tr
                    key={c.id}
                    className="table-row"
                    onClick={() => setSelectedComplaintId(c.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view"
                  >
                    <td style={{ padding: '14px', color: '#94a3b8', fontSize: 12 }}>{c.id}</td>
                    <td style={{ padding: '14px', color: '#f0f6ff', fontWeight: 700 }}>{c.type}</td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${c.status === 'Resolved' ? 'badge-green' : c.status === 'In Progress' ? 'badge-orange' : 'badge-red'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${c.priority === 'Critical' ? 'badge-red' : c.priority === 'High' ? 'badge-orange' : c.priority === 'Medium' ? 'badge-cyan' : 'badge-green'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>{c.area}</td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>{c.location}</td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>{c.reportedBy}</td>
                    <td style={{ padding: '14px', color: '#475569', fontSize: 12 }}>
                      {new Date(c.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'system' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {systemHealth.map((s) => {
            const Icon = s.icon;
            const isOp = s.status === 'Operational';
            return (
              <div key={s.name} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isOp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${isOp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={isOp ? '#10b981' : '#f59e0b'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f0f6ff' }}>{s.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isOp ? '#10b981' : '#f59e0b' }} />
                        <span style={{ fontSize: 12, color: isOp ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{s.status}</span>
                      </div>
                    </div>
                  </div>
                  <RefreshCw size={14} color="#475569" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Latency</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6ff', fontFamily: "'Space Grotesk', sans-serif" }}>{s.latency}</div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Uptime</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: isOp ? '#10b981' : '#f59e0b', fontFamily: "'Space Grotesk', sans-serif" }}>{s.uptime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-title" style={{ marginBottom: 18 }}>Platform Controls</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'maintenanceMode', label: 'Maintenance mode', desc: 'Disable user-facing interactions (demo toggle only).' },
                { key: 'demoMode', label: 'Demo mode', desc: 'Show demo data & simulated panels (recommended for presentations).' },
                { key: 'enableAI', label: 'AI predictions enabled', desc: 'Enable / disable AI alerts and predictions.' },
                { key: 'enableNotifications', label: 'Notifications enabled', desc: 'Enable in-app alerts and notification badges.' },
              ].map((row) => {
                const value = (settings as any)[row.key] as boolean;
                return (
                  <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f0f6ff', fontSize: 13 }}>{row.label}</div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{row.desc}</div>
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 12px', borderRadius: 12, minWidth: 92, justifyContent: 'center' }}
                      onClick={() => setSettings((s) => ({ ...s, [row.key]: !value }))}
                    >
                      {value ? 'On' : 'Off'}
                    </button>
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="btn-primary" onClick={saveSettings}>
                  <Settings size={16} />
                  Save settings
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSettings(defaultSettings);
                    toast.success('Reset to defaults.');
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div className="section-title" style={{ marginBottom: 18 }}>Thresholds & Limits</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'refreshIntervalSec', label: 'Data refresh interval (sec)', min: 5, max: 120, step: 1 },
                { key: 'trafficAlertPct', label: 'Traffic congestion alert (%)', min: 40, max: 95, step: 1 },
                { key: 'aqiCritical', label: 'AQI critical level', min: 80, max: 300, step: 1 },
                { key: 'binFillCriticalPct', label: 'Bin fill critical (%)', min: 60, max: 99, step: 1 },
                { key: 'maxOpenComplaints', label: 'Max open complaints', min: 50, max: 2000, step: 10 },
              ].map((row) => (
                <div key={row.key} style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{row.label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#f0f6ff' }}>
                      {(settings as any)[row.key]}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={row.min}
                    max={row.max}
                    step={row.step}
                    value={(settings as any)[row.key]}
                    onChange={(e) => setSettings((s) => ({ ...s, [row.key]: Number(e.target.value) }))}
                    style={{ width: '100%', marginTop: 10 }}
                  />
                </div>
              ))}

              <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 6 }}>City name</label>
                <input className="input-field" value={settings.cityName} onChange={(e) => setSettings((s) => ({ ...s, cityName: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  onClick={() => toast('Simulated: refresh triggered', { icon: '🔄' as any })}
                >
                  <RefreshCw size={16} />
                  Force refresh
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => toast('Simulated: incident drill started', { icon: '⚡' as any })}
                >
                  <Zap size={16} />
                  Start incident drill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} color="#00d4ff" />
              </div>
              <div>
                <div className="section-title" style={{ marginBottom: 0 }}>User Feedback</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{feedback.length} submissions (stored locally in this browser)</div>
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                try {
                  window.localStorage.removeItem(getFeedbackStorageKey());
                  setFeedback([]);
                  toast.success('Feedback cleared.');
                } catch {
                  toast.error('Could not clear feedback.');
                }
              }}
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>

          {feedback.length === 0 ? (
            <div style={{ padding: 18, borderRadius: 14, border: '1px dashed rgba(255,255,255,0.16)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              No feedback yet. Use the Feedback button in the top bar to submit one.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {feedback.slice(0, 50).map((f) => (
                <div key={f.id} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="badge badge-cyan">{f.category}</span>
                      <span className="badge badge-orange">{f.rating}/5</span>
                      {f.page && <span style={{ fontSize: 11, color: '#475569' }}>{f.page}</span>}
                    </div>
                    <span style={{ fontSize: 11, color: '#475569' }}>{new Date(f.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: 8, color: '#f0f6ff', fontSize: 13, lineHeight: 1.45 }}>{f.message}</div>
                  {f.email && <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>Reply: {f.email}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Complaint modal */}
      {selectedComplaint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Complaint details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedComplaintId(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 250,
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
                  {selectedComplaint.type} <span style={{ color: '#475569', fontWeight: 800 }}>({selectedComplaint.id})</span>
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`badge ${selectedComplaint.status === 'Resolved' ? 'badge-green' : selectedComplaint.status === 'In Progress' ? 'badge-orange' : 'badge-red'}`}>
                    {selectedComplaint.status}
                  </span>
                  <span className={`badge ${selectedComplaint.priority === 'Critical' ? 'badge-red' : selectedComplaint.priority === 'High' ? 'badge-orange' : selectedComplaint.priority === 'Medium' ? 'badge-cyan' : 'badge-green'}`}>
                    {selectedComplaint.priority}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{selectedComplaint.area}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedComplaintId(null)}
                style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Close"
              >
                <X size={16} color="#94a3b8" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                { k: 'Location', v: selectedComplaint.location },
                { k: 'Reported by', v: selectedComplaint.reportedBy },
                { k: 'Timestamp', v: new Date(selectedComplaint.timestamp).toLocaleString() },
                { k: 'Status', v: selectedComplaint.status },
              ].map((row) => (
                <div key={row.k} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>{row.k}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#f0f6ff', fontWeight: 700 }}>{row.v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Description</div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#f0f6ff', lineHeight: 1.5 }}>{selectedComplaint.description}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={() => setSelectedComplaintId(null)}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (selectedComplaint.status === 'Resolved') {
                    toast('Already solved', { icon: '✅' as any });
                    return;
                  }
                  setComplaintsState((prev) =>
                    prev.map((c) => (c.id === selectedComplaint.id ? { ...c, status: 'Resolved' } : c)),
                  );
                  toast.success('Marked as solved.');
                  setSelectedComplaintId(null);
                }}
                style={{ opacity: selectedComplaint.status === 'Resolved' ? 0.75 : 1 }}
              >
                <CheckCircle2 size={16} />
                Mark solved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div>
              <div className="section-title" style={{ marginBottom: 0 }}>System Logs</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Recent events (in-memory)</div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                addLog({ level: 'info', message: 'Logs cleared (demo)', meta: {} });
                toast('Logs are demo-only in this version', { icon: 'ℹ️' as any });
              }}
            >
              Clear
            </button>
          </div>

          {logs.length === 0 ? (
            <div style={{ padding: 18, borderRadius: 14, border: '1px dashed rgba(255,255,255,0.16)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              No logs yet. WebSocket connect/disconnect and Emergency mode will generate logs.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {logs.slice(0, 60).map((l) => (
                <div key={l.id} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className={`badge ${l.level === 'critical' ? 'badge-red' : l.level === 'warning' ? 'badge-orange' : 'badge-cyan'}`}>{l.level}</span>
                      <span style={{ fontSize: 13, color: '#f0f6ff', fontWeight: 800 }}>{l.message}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#475569' }}>{new Date(l.ts).toLocaleString()}</span>
                  </div>
                  {l.meta && Object.keys(l.meta).length > 0 && (
                    <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>
                      {Object.entries(l.meta).map(([k, v]) => (
                        <span key={k} style={{ marginRight: 10 }}>
                          <span style={{ color: '#475569', fontWeight: 800 }}>{k}:</span> {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
