'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { BadgeCheck, Camera, CheckCircle2, ClipboardList, MapPin, ShieldAlert, UserRound, Wrench } from 'lucide-react';
import type { MapMarker } from '@/components/CityMap';
import { assignIssue, fetchAdminIssues, fetchAdminMetrics, fetchWorkers, type CivicIssue, type IssueStatus, type Worker, updateIssueStatus, uploadRepairEvidence } from '@/lib/issueApi';

const CityMap = dynamic(() => import('@/components/CityMap'), { ssr: false, loading: () => <div className="glass-card skeleton" style={{ height: 420 }} /> });

const statusTone = (status: string) => status === 'Closed' ? 'good' : status === 'Critical' || status === 'Reopened' ? 'critical' : status === 'Awaiting citizen confirmation' || status === 'Submitted' ? 'warning' : 'info';

function Badge({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'good' | 'warning' | 'critical' | 'info' }) {
  const palette = { good: ['#10b981', 'rgba(16,185,129,.12)'], warning: ['#f59e0b', 'rgba(245,158,11,.12)'], critical: ['#ef4444', 'rgba(239,68,68,.12)'], info: ['#00d4ff', 'rgba(0,212,255,.12)'] }[tone];
  return <span style={{ color: palette[0], background: palette[1], border: `1px solid ${palette[0]}44`, borderRadius: 999, padding: '4px 8px', fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>{children}</span>;
}

export default function AdminOperationsPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [loadedIssues, loadedWorkers, loadedMetrics] = await Promise.all([fetchAdminIssues(), fetchWorkers(), fetchAdminMetrics()]);
      setIssues(loadedIssues);
      setWorkers(loadedWorkers);
      setMetrics(loadedMetrics);
      setSelectedId((current) => current ?? loadedIssues[0]?.id ?? null);
    } catch {
      toast.error('Admin API unavailable. Start FastAPI and reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const selected = issues.find((item) => item.id === selectedId) ?? issues[0];
  const markers = useMemo<MapMarker[]>(() => issues.filter((item) => item.latitude !== null && item.longitude !== null).map((item) => ({
    id: item.id,
    kind: 'complaint',
    title: `${item.category} · ${item.id}`,
    subtitle: `${item.location} · ${item.status}`,
    severity: item.priority === 'Critical' ? 'critical' : item.priority === 'High' ? 'warning' : 'good',
    lat: item.latitude as number,
    lng: item.longitude as number,
    meta: { Priority: item.priority, Reports: item.grouped_reports, Status: item.status },
  })), [issues]);

  const mutate = async (action: () => Promise<unknown>, message: string) => {
    try { await action(); toast.success(message); await refresh(); } catch { toast.error('Action failed. Check the backend connection.'); }
  };

  if (loading) return <div className="page-enter" style={{ padding: 28, color: '#94a3b8' }}>Loading protected admin operations…</div>;

  return <div className="page-enter" style={{ padding: 'clamp(14px, 3vw, 26px)', maxWidth: 1700, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 20 }}>
      <div><div className="live-indicator">Protected municipal workspace · Admin only</div><h2 className="page-title" style={{ marginTop: 8, marginBottom: 6 }}>Issue Operations Center</h2><p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 680 }}>Verify reports, group duplicates, assign workers, upload repair evidence, and wait for citizen confirmation before closure.</p></div>
      <button className="btn-secondary" onClick={refresh}><ClipboardList size={15} /> Refresh live queue</button>
    </div>

    <div className="grid-4" style={{ marginBottom: 18 }}>
      {[['Open issues', metrics?.open ?? issues.length, ShieldAlert, '#f59e0b'], ['Grouped reports', metrics?.grouped_reports ?? 0, MapPin, '#00d4ff'], ['Awaiting citizen', metrics?.awaiting_confirmation ?? 0, CheckCircle2, '#a78bfa'], ['Audit events', metrics?.audit_events ?? 0, BadgeCheck, '#10b981']].map(([label, value, Icon, color]) => <div className="metric-card" key={String(label)} style={{ padding: 18 }}><Icon size={18} color={String(color)} /><div style={{ color: String(color), fontSize: 28, fontWeight: 800, marginTop: 12 }}>{String(value)}</div><div style={{ color: '#f0f6ff', fontSize: 12, fontWeight: 700 }}>{label}</div></div>)}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(340px, .8fr)', gap: 16, marginBottom: 18 }}>
      <div className="glass-card" style={{ padding: 12 }}><div style={{ padding: '8px 10px 13px', display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><div><div className="section-title">Live issue map</div><div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>Tap a marker to open the accountability workflow.</div></div><Badge tone="info">{markers.length} GEO-TAGGED</Badge></div><CityMap markers={markers} center={[19.418, 72.818]} zoom={13} height={420} /></div>
      <div className="glass-card" style={{ padding: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}><div><div className="section-title">Priority queue</div><div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>AI suggestion · admin decides</div></div><Wrench size={18} color="#a78bfa" /></div>{issues.slice().sort((a, b) => b.priority_score - a.priority_score).map((issue) => <button key={issue.id} onClick={() => setSelectedId(issue.id)} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', color: '#f0f6ff', background: selected?.id === issue.id ? 'rgba(139,92,246,.12)' : 'rgba(255,255,255,.03)', border: `1px solid ${selected?.id === issue.id ? 'rgba(139,92,246,.4)' : 'rgba(255,255,255,.06)'}`, borderRadius: 10, padding: 11, marginBottom: 8 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{issue.title}</span><span style={{ color: issue.priority === 'Critical' ? '#ef4444' : '#f59e0b', fontSize: 15, fontWeight: 800 }}>{issue.priority_score}</span></div><div style={{ display: 'flex', gap: 7, alignItems: 'center', marginTop: 7 }}><Badge tone={statusTone(issue.status) as 'good' | 'warning' | 'critical' | 'info'}>{issue.status}</Badge><span style={{ color: '#64748b', fontSize: 10 }}>{issue.grouped_reports} grouped reports</span></div></button>)}</div>
    </div>

    {selected && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, .75fr)', gap: 16 }}>
      <div className="glass-card" style={{ padding: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}><div><div className="section-title">{selected.title}</div><div style={{ color: '#64748b', fontSize: 11, marginTop: 5 }}>{selected.id} · {selected.location}</div></div><Badge tone={statusTone(selected.status) as 'good' | 'warning' | 'critical' | 'info'}>{selected.status}</Badge></div><p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.55 }}>{selected.description}</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '16px 0' }}>{[['Category', selected.category], ['Priority', `${selected.priority_score}/100`], ['Reports', selected.grouped_reports], ['Cluster', selected.duplicate_cluster_id]].map(([label, value]) => <div key={String(label)} style={{ background: 'rgba(255,255,255,.035)', borderRadius: 9, padding: 10 }}><div style={{ color: '#64748b', fontSize: 9 }}>{label}</div><div style={{ color: '#f0f6ff', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{value}</div></div>)}</div><div style={{ padding: 12, borderRadius: 10, background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.2)', marginBottom: 16 }}><div style={{ color: '#c4b5fd', fontSize: 11, fontWeight: 800 }}>Why this issue is prioritized</div>{(selected.priority_explanation?.factors ?? []).map((factor) => <div key={factor.factor} style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 10, marginTop: 8 }}><span>{factor.factor}</span><strong style={{ color: '#a78bfa' }}>+{factor.contribution}</strong></div>)}</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{selected.status === 'Submitted' && <button className="btn-primary" onClick={() => mutate(() => updateIssueStatus(selected.id, 'Verified', 'Location and report reviewed by admin'), 'Issue verified')}><BadgeCheck size={15} /> Verify report</button>}{selected.status === 'Verified' && workers[0] && <button className="btn-primary" onClick={() => mutate(() => assignIssue(selected.id, workers[0]), 'Issue assigned to worker')}><UserRound size={15} /> Assign nearest worker</button>}{selected.status === 'Assigned' && <button className="btn-secondary" onClick={() => mutate(() => updateIssueStatus(selected.id, 'Work in progress', 'Worker started field work'), 'Work started')}><Wrench size={15} /> Start work</button>}{(selected.status === 'Work in progress' || selected.status === 'Assigned') && <button className="btn-secondary" onClick={() => { const note = window.prompt('Evidence note', 'Before/after repair evidence reviewed') || ''; return mutate(() => uploadRepairEvidence(selected.id, note), 'Evidence uploaded; citizen confirmation requested'); }}><Camera size={15} /> Upload repair evidence</button>}</div></div>
      <div className="glass-card" style={{ padding: 20 }}><div className="section-title" style={{ marginBottom: 13 }}>Accountability details</div><div style={{ color: '#64748b', fontSize: 10, marginBottom: 5 }}>ASSIGNED WORKER</div><div style={{ color: '#f0f6ff', fontSize: 13, fontWeight: 700 }}>{selected.assigned_to?.worker_name ?? 'Not assigned'}</div><div style={{ color: '#64748b', fontSize: 11, marginTop: 3 }}>{selected.assigned_to?.department ?? 'Select a department'} {selected.assigned_to?.eta ? `· ETA ${selected.assigned_to.eta}` : ''}</div><div style={{ borderTop: '1px solid rgba(255,255,255,.07)', margin: '16px 0' }} /><div style={{ color: '#64748b', fontSize: 10, marginBottom: 7 }}>REPAIR EVIDENCE</div>{selected.evidence.length ? selected.evidence.map((evidence) => <div key={evidence.id} style={{ padding: 10, borderRadius: 9, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', marginBottom: 8 }}><div style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700 }}>{evidence.evidence_type.toUpperCase()} · {evidence.id}</div><div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4 }}>{evidence.note || 'Evidence uploaded'}</div></div>) : <div style={{ color: '#64748b', fontSize: 11 }}>No repair evidence uploaded yet.</div>}<div style={{ borderTop: '1px solid rgba(255,255,255,.07)', margin: '16px 0' }} /><div style={{ color: '#64748b', fontSize: 10, marginBottom: 7 }}>CITIZEN CONFIRMATION</div><div style={{ color: selected.citizen_confirmation?.confirmed ? '#10b981' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>{selected.citizen_confirmation?.confirmed ? 'Confirmed fixed' : selected.status === 'Awaiting citizen confirmation' ? 'Waiting for citizen response' : 'Not requested yet'}</div></div>
    </div>}
  </div>;
}
