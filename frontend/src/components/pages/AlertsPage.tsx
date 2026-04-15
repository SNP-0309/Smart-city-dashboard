'use client';

import { alerts } from '@/lib/mockData';
import { AlertTriangle, Bell, CheckCircle, Info, Megaphone, Send } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

export default function AlertsPage() {
  const { role } = useAppStore();
  const [broadcast, setBroadcast] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (broadcast.trim()) {
      setSent(true);
      setTimeout(() => { setSent(false); setBroadcast(''); }, 2000);
    }
  };

  const allAlerts = [
    ...alerts,
    { id: 7, type: 'info', message: 'Scheduled maintenance on Zone B water pipes tonight 11PM-2AM', time: '2h ago', icon: 'Info' },
    { id: 8, type: 'warning', message: 'Traffic diversion active near Airport Corridor exit 3', time: '3h ago', icon: 'Traffic' },
    { id: 9, type: 'critical', message: 'Pothole reported causing vehicle accidents on Main Blvd', time: '4h ago', icon: 'Road' },
  ];

  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Critical', count: allAlerts.filter(a => a.type === 'critical').length, color: '#ef4444', icon: AlertTriangle },
          { label: 'Warnings', count: allAlerts.filter(a => a.type === 'warning').length, color: '#f59e0b', icon: Bell },
          { label: 'Info', count: allAlerts.filter(a => a.type === 'info').length, color: '#3b82f6', icon: Info },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.count}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{s.label} Alerts</div>
                </div>
                <Icon size={36} color={s.color} opacity={0.25} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: role === 'admin' ? '1fr 380px' : '1fr', gap: 16 }}>
        {/* Alerts List */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>All Alerts</div>
            <span className="live-indicator">Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allAlerts.map((alert) => {
              const isC = alert.type === 'critical';
              const isW = alert.type === 'warning';
              const color = isC ? '#ef4444' : isW ? '#f59e0b' : '#3b82f6';
              return (
                <div key={alert.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: `${color}0d`,
                  border: `1px solid ${color}28`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}1a`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangle size={16} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <p style={{ fontSize: 14, color: '#f0f6ff', lineHeight: 1.5, fontWeight: 500 }}>{alert.message}</p>
                      <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap', flexShrink: 0 }}>{alert.time}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <span className={`badge ${isC ? 'badge-red' : isW ? 'badge-orange' : 'badge-cyan'}`}>
                        {alert.type}
                      </span>
                      {role === 'admin' && (
                        <button style={{ fontSize: 11, color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={12} /> Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Broadcast */}
        {role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={18} color="#00d4ff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#f0f6ff' }}>City Broadcast</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>Send alert to all citizens</div>
                </div>
              </div>

              <textarea
                className="input-field"
                rows={4}
                placeholder="Type emergency message to broadcast..."
                value={broadcast}
                onChange={(e) => setBroadcast(e.target.value)}
                style={{ resize: 'none', marginBottom: 12 }}
              />

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {['SMS', 'App Notification', 'Email'].map(c => (
                  <div key={c} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)', fontSize: 12, color: '#00d4ff', fontWeight: 500, cursor: 'pointer' }}>
                    {c}
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: 44, background: sent ? 'linear-gradient(135deg, #10b981, #059669)' : undefined }}
                onClick={handleSend}
              >
                {sent ? <><CheckCircle size={16} /> Sent!</> : <><Send size={16} /> Send Broadcast</>}
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>AI Suggestions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '🚦', text: 'Divert traffic from Main Blvd via North Ring Rd', type: 'Traffic' },
                  { icon: '🏭', text: 'Issue health advisory for Industrial Zone residents', type: 'AQI' },
                  { icon: '🚛', text: 'Deploy 3 additional waste trucks to critical zones', type: 'Waste' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, color: '#f0f6ff', marginBottom: 4 }}>{s.text}</div>
                      <span className="badge badge-purple" style={{ fontSize: 10 }}>{s.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
