'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import type { MapMarker } from '@/components/CityMap';
import {
  AlertTriangle, ArrowRight, Camera, CheckCircle2, ClipboardCheck,
  FileText, Gauge, MapPin, Plus, Route, Search, ShieldCheck,
  Sparkles, UserRound, Waves, X,
} from 'lucide-react';
import {
  dailyWorkReports,
  roadPriorityRecommendations,
  roadProjects,
  roadSegments as demoRoadSegments,
  type RoadConditionStatus,
} from '@/lib/mockData';
import { governmentLocations as demoGovernmentLocations, type GovernmentLocation, type GovernmentSource } from '@/lib/governmentData';
import { fetchGovernmentLocations, fetchRoadSegments, submitRoadIssue } from '@/lib/roadApi';

const CityMap = dynamic(() => import('@/components/CityMap'), {
  ssr: false,
  loading: () => <div className="glass-card skeleton" style={{ height: 500 }} />,
});

type Filter = 'all' | 'attention' | 'critical' | 'verified';

const toneFor = (status: RoadConditionStatus | string) => {
  if (status === 'Critical') return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' };
  if (status === 'Poor' || status === 'Needs review' || status === 'Needs review') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' };
  if (status === 'Verified' || status === 'Completed') return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' };
  return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' };
};

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'good' | 'warning' | 'critical' | 'info' | 'neutral' }) {
  const colors = {
    good: ['#10b981', 'rgba(16,185,129,0.12)'],
    warning: ['#f59e0b', 'rgba(245,158,11,0.12)'],
    critical: ['#ef4444', 'rgba(239,68,68,0.12)'],
    info: ['#00d4ff', 'rgba(0,212,255,0.12)'],
    neutral: ['#94a3b8', 'rgba(148,163,184,0.1)'],
  }[tone];
  return <span style={{ color: colors[0], background: colors[1], border: `1px solid ${colors[0]}35`, borderRadius: 999, padding: '4px 9px', fontSize: 10, fontWeight: 800, letterSpacing: '.35px', whiteSpace: 'nowrap' }}>{children}</span>;
}

export default function RoadIntelligencePage() {
  const [roads, setRoads] = useState(demoRoadSegments);
  const [apiConnected, setApiConnected] = useState(false);
  const [governmentList, setGovernmentList] = useState<GovernmentLocation[]>(demoGovernmentLocations);
  const [governmentSources, setGovernmentSources] = useState<GovernmentSource[]>([]);
  const [governmentApiConnected, setGovernmentApiConnected] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selectedRoadId, setSelectedRoadId] = useState(demoRoadSegments[0].id);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState({ issueType: 'Pothole', location: '', description: '', reporter: '' });

  useEffect(() => {
    Promise.all([fetchRoadSegments(), fetchGovernmentLocations()]).then(([roadResult, governmentResult]) => {
      if (roadResult.connected && roadResult.roads.length) {
        setRoads(roadResult.roads);
        setSelectedRoadId(roadResult.roads[0].id);
      }
      setApiConnected(roadResult.connected);
      setGovernmentList(governmentResult.locations);
      setGovernmentSources(governmentResult.sources);
      setGovernmentApiConnected(governmentResult.connected);
    });
  }, []);

  const filteredRoads = useMemo(() => roads.filter((road) => {
    const matchesSearch = `${road.name} ${road.area}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all'
      || (filter === 'attention' && road.priorityScore >= 60)
      || (filter === 'critical' && road.conditionStatus === 'Critical')
      || (filter === 'verified' && road.verificationStatus === 'Verified');
    return matchesSearch && matchesFilter;
  }), [filter, roads, search]);

  const selectedRoad = roads.find((road) => road.id === selectedRoadId) ?? roads[0];
  const markers = useMemo<MapMarker[]>(() => filteredRoads.map((road) => ({
    id: road.id,
    kind: 'road',
    title: `${road.name} · ${road.id}`,
    subtitle: `${road.area} · Priority ${road.priorityScore}/100`,
    severity: road.conditionStatus === 'Critical' ? 'critical' : road.priorityScore >= 60 ? 'warning' : 'good',
    lat: road.lat,
    lng: road.lng,
    meta: { Condition: road.conditionStatus, 'Open complaints': road.openComplaints, Verification: road.verificationStatus },
  })), [filteredRoads]);

  const submitReport = async (event: FormEvent) => {
    event.preventDefault();
    if (!report.location || !report.description) {
      toast.error('Add a location and short description first.');
      return;
    }
    try {
      await submitRoadIssue({ roadId: selectedRoad.id, issueType: report.issueType, description: report.description, location: report.location, reporterName: report.reporter });
      toast.success('Report received · pending municipal review');
    } catch {
      toast.error('The road API is unavailable. Start FastAPI and try again.');
      return;
    }
    setReport({ issueType: 'Pothole', location: '', description: '', reporter: '' });
    setShowReport(false);
  };

  return (
    <div className="page-enter" style={{ padding: 'clamp(14px, 3vw, 26px)', maxWidth: 1700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <span className="live-indicator">Pilot workspace · Nalasopara, Maharashtra</span>
            <Badge tone={apiConnected ? 'good' : 'warning'}>{apiConnected ? 'API CONNECTED' : 'DEMO FALLBACK'}</Badge>
          </div>
          <h2 className="page-title" style={{ marginBottom: 7 }}>Road Intelligence & Maintenance</h2>
          <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 700 }}>A GIS-backed view of road condition, citizen evidence, explainable AI recommendations, and accountable repair workflows.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowReport(true)}><Plus size={16} /> Report road issue</button>
      </div>

      <div className="grid-4" style={{ marginBottom: 18 }}>
        {[
          { label: 'Road segments', value: '07', detail: 'pilot inventory', icon: Route, color: '#00d4ff' },
          { label: 'Need attention', value: '04', detail: 'priority ≥ 60', icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Open complaints', value: '28', detail: 'across pilot roads', icon: FileText, color: '#ef4444' },
          { label: 'Verified records', value: '71%', detail: 'source-backed entries', icon: ShieldCheck, color: '#10b981' },
        ].map((metric) => {
          const Icon = metric.icon;
          return <div className="metric-card" key={metric.label} style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><Icon size={19} color={metric.color} /><span style={{ color: '#475569', fontSize: 10, fontWeight: 700 }}>LIVE</span></div>
            <div style={{ color: metric.color, fontSize: 29, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", marginTop: 13 }}>{metric.value}</div>
            <div style={{ color: '#f0f6ff', fontSize: 12, fontWeight: 700 }}>{metric.label}</div>
            <div style={{ color: '#64748b', fontSize: 11, marginTop: 3 }}>{metric.detail}</div>
          </div>;
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, .75fr)', gap: 16, marginBottom: 18 }}>
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ padding: '8px 10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div><div className="section-title" style={{ marginBottom: 3 }}>Nalasopara road network</div><div style={{ color: '#64748b', fontSize: 11 }}>Markers represent road segments, not confirmed defects.</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#64748b', fontSize: 11 }}><MapPin size={13} color="#a78bfa" /> Tap a marker for evidence</div>
          </div>
          <CityMap markers={markers} center={[19.418, 72.818]} zoom={13} height={465} />
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
            <div><div className="section-title" style={{ marginBottom: 4 }}>AI priority queue</div><div style={{ color: '#64748b', fontSize: 11 }}>Recommendation · human review required</div></div>
            <Sparkles size={18} color="#a78bfa" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roads.slice(0, 5).map((road, index) => {
              const tone = toneFor(road.conditionStatus);
              return <button key={road.id} onClick={() => setSelectedRoadId(road.id)} style={{ textAlign: 'left', background: selectedRoad.id === road.id ? 'rgba(139,92,246,0.11)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedRoad.id === road.id ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 11, padding: '11px 12px', color: '#f0f6ff', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 800 }}>0{index + 1}</span><span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{road.name}</span><span style={{ color: tone.color, fontSize: 15, fontWeight: 800 }}>{road.priorityScore}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}><div className="progress-bar" style={{ flex: 1, height: 5 }}><div className="progress-fill" style={{ width: `${road.priorityScore}%`, background: tone.color }} /></div><span style={{ color: '#64748b', fontSize: 10 }}>{road.conditionStatus}</span></div>
              </button>;
            })}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 15, paddingTop: 15 }}>
            <div style={{ color: '#f0f6ff', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Why {selectedRoad.name} is prioritized</div>
            {roadPriorityRecommendations.map((item) => <div key={item.factor} style={{ marginBottom: 9 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: '#cbd5e1', fontSize: 10 }}><span>{item.factor}</span><span style={{ color: '#a78bfa', fontWeight: 800 }}>+{item.contribution}</span></div><div className="progress-bar" style={{ height: 4, marginTop: 4 }}><div className="progress-fill" style={{ width: `${item.contribution * 2.4}%`, background: '#8b5cf6' }} /></div></div>)}
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', color: '#64748b', fontSize: 10, lineHeight: 1.4, marginTop: 10 }}><Gauge size={13} color="#f59e0b" style={{ flexShrink: 0 }} /> Model version ROAD-PRIORITY-v0.1 · generated 25 Sep 2026 · recommendation is not an approval.</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 15 }}>
          <div><div className="section-title" style={{ marginBottom: 4 }}>Road condition register</div><div style={{ color: '#64748b', fontSize: 11 }}>Every record keeps its source and verification state.</div></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><div style={{ position: 'relative', width: 190 }}><Search size={14} color="#475569" style={{ position: 'absolute', left: 10, top: 13 }} /><input className="input-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search road or area" style={{ paddingLeft: 30, height: 38, fontSize: 12 }} /></div>{(['all', 'attention', 'critical', 'verified'] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 11px', fontSize: 11, textTransform: 'capitalize' }}>{item === 'all' ? 'All roads' : item === 'attention' ? 'Needs attention' : item}</button>)}</div>
        </div>
        <div className="responsive-table"><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}><thead><tr style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', textAlign: 'left' }}>{['Road segment', 'Condition', 'Priority', 'Complaints', 'Verification', 'Maintenance', ''].map((heading) => <th key={heading} style={{ padding: '9px 10px', fontWeight: 700 }}>{heading}</th>)}</tr></thead><tbody>{filteredRoads.map((road) => { const tone = toneFor(road.conditionStatus); return <tr key={road.id} className="table-row" onClick={() => setSelectedRoadId(road.id)} style={{ cursor: 'pointer' }}><td style={{ padding: '13px 10px' }}><div style={{ color: '#f0f6ff', fontSize: 12, fontWeight: 700 }}>{road.name}</div><div style={{ color: '#64748b', fontSize: 10, marginTop: 3 }}>{road.id} · {road.area} · {road.roadType}</div></td><td style={{ padding: '13px 10px' }}><Badge tone={road.conditionStatus === 'Critical' ? 'critical' : road.conditionStatus === 'Good' ? 'good' : 'warning'}>{road.conditionStatus}</Badge></td><td style={{ padding: '13px 10px' }}><span style={{ color: tone.color, fontWeight: 800, fontSize: 15 }}>{road.priorityScore}</span><span style={{ color: '#64748b', fontSize: 10 }}> / 100</span></td><td style={{ padding: '13px 10px', color: '#cbd5e1', fontSize: 12 }}>{road.openComplaints} open <span style={{ color: '#64748b' }}>· {road.complaintCount} total</span></td><td style={{ padding: '13px 10px' }}><Badge tone={road.verificationStatus === 'Verified' ? 'good' : 'warning'}>{road.verificationStatus}</Badge><div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>{road.lastVerifiedAt}</div></td><td style={{ padding: '13px 10px', color: '#cbd5e1', fontSize: 11 }}>{road.maintenanceStatus}</td><td style={{ padding: '13px 10px', color: '#475569' }}><ArrowRight size={15} /></td></tr>; })}</tbody></table></div>
        {filteredRoads.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 12 }}>No road segments match this filter.</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, .9fr)', gap: 16 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><div><div className="section-title" style={{ marginBottom: 4 }}>Road Passport</div><div style={{ color: '#64748b', fontSize: 11 }}>{selectedRoad.name} · auditable history</div></div><Badge tone="info">{selectedRoad.id}</Badge></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 17 }}>{[['Condition', `${selectedRoad.conditionScore}/100`], ['Complaints', selectedRoad.complaintCount], ['Flood risk', selectedRoad.waterloggingRisk], ['Source', selectedRoad.source.split(' · ')[0]]].map(([label, value]) => <div key={label} style={{ background: 'rgba(255,255,255,0.035)', borderRadius: 10, padding: 11 }}><div style={{ color: '#64748b', fontSize: 10, marginBottom: 5 }}>{label}</div><div style={{ color: '#f0f6ff', fontWeight: 700, fontSize: 12 }}>{value}</div></div>)}</div>
          <div style={{ position: 'relative', marginLeft: 7, borderLeft: '1px solid rgba(0,212,255,0.25)', paddingLeft: 21, display: 'flex', flexDirection: 'column', gap: 15 }}>{[['25 Sep 2026', 'AI priority recommendation generated', 'ROAD-PRIORITY-v0.1'], [selectedRoad.lastVerifiedAt, 'Condition record verified', selectedRoad.source], ['12 Sep 2026', 'Citizen reports clustered', `${selectedRoad.complaintCount} reports linked for review`]].map(([date, title, detail], index) => <div key={title} style={{ position: 'relative' }}><span style={{ position: 'absolute', left: -27, top: 3, width: 11, height: 11, borderRadius: '50%', background: index === 0 ? '#a78bfa' : '#00d4ff', boxShadow: '0 0 0 4px #0d1629' }} /><div style={{ color: '#64748b', fontSize: 10 }}>{date}</div><div style={{ color: '#f0f6ff', fontWeight: 700, fontSize: 12, marginTop: 2 }}>{title}</div><div style={{ color: '#64748b', fontSize: 11, marginTop: 3 }}>{detail}</div></div>)}</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><div><div className="section-title" style={{ marginBottom: 4 }}>Work evidence queue</div><div style={{ color: '#64748b', fontSize: 11 }}>Daily reports require photo evidence.</div></div><ClipboardCheck size={18} color="#10b981" /></div>
          {dailyWorkReports.map((item) => <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Camera size={14} color="#00d4ff" /></div><div style={{ minWidth: 0, flex: 1 }}><div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}><span style={{ color: '#f0f6ff', fontSize: 11, fontWeight: 700 }}>{item.type}</span><Badge tone={item.status === 'Verified' ? 'good' : item.status === 'Needs review' ? 'warning' : 'info'}>{item.status}</Badge></div><div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}><UserRound size={11} style={{ verticalAlign: '-2px', marginRight: 3 }} />{item.worker} · {item.date} · {item.evidence} photos</div></div></div>)}
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 13, fontSize: 11 }} onClick={() => toast('Evidence review workflow is available to authorized inspectors.')}>Open verification queue <ArrowRight size={14} /></button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><div><div className="section-title" style={{ marginBottom: 4 }}>Repair proposals & project status</div><div style={{ color: '#64748b', fontSize: 11 }}>Contractor workflow remains subject to administrative approval.</div></div><Waves size={18} color="#3b82f6" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>{roadProjects.map((project) => <div key={project.id} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: 13, background: 'rgba(255,255,255,0.025)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 7 }}><span style={{ color: '#f0f6ff', fontSize: 12, fontWeight: 700 }}>{project.title}</span><Badge tone={project.status === 'Work in progress' ? 'good' : 'warning'}>{project.status}</Badge></div><div style={{ color: '#64748b', fontSize: 10, marginTop: 9 }}>{project.contractor} · {project.budget} · ETA {project.eta}</div><div className="progress-bar" style={{ marginTop: 11 }}><div className="progress-fill" style={{ width: `${project.progress}%`, background: project.progress > 0 ? '#3b82f6' : '#475569' }} /></div><div style={{ color: '#64748b', fontSize: 10, marginTop: 5 }}>{project.progress}% reported progress</div></div>)}</div>
      </div>

      <div className="glass-card" style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 15 }}>
          <div>
            <div className="section-title" style={{ marginBottom: 4 }}>Government reference data</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Official administrative and infrastructure references for the Palghar pilot area.</div>
          </div>
          <Badge tone={governmentApiConnected ? 'good' : 'warning'}>{governmentApiConnected ? 'OFFICIAL API DATA' : 'CACHED OFFICIAL DATA'}</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {governmentList.map((location) => (
            <div key={location.id} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: 13, background: 'rgba(255,255,255,0.025)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'center' }}>
                <span style={{ color: '#f0f6ff', fontSize: 13, fontWeight: 800 }}>{location.name}</span>
                <span style={{ color: '#10b981', fontSize: 9, fontWeight: 800 }}>OFFICIAL</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 8 }}>{location.authority}</div>
              <div style={{ color: '#cbd5e1', fontSize: 11, marginTop: 11 }}>
                Population: <strong>{location.population2011 ? location.population2011.toLocaleString('en-IN') : 'VVMC aggregate'}</strong>
              </div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 5 }}>Village roads: {location.districtVillageRoadsKm.toLocaleString('en-IN')} km ({location.roadReferenceYear})</div>
              <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4, marginTop: 7 }}>{location.populationScope}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 13, padding: 11, borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f5c56b', fontSize: 10, lineHeight: 1.5 }}>
          Census population is from 2011. The 4,418 km road figure is district village-road infrastructure for 2022–23 and excludes roads maintained by municipal councils or corporations. Vasai, Virar, and Nalasopara are not assigned fabricated individual populations; the official VVMC figure is an aggregate.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          {governmentSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{ color: '#67e8f9', fontSize: 10, textDecoration: 'none' }}>{source.title} ↗</a>)}
        </div>
      </div>

      {showReport && <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,6,23,0.78)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowReport(false)}><form className="glass-card" onSubmit={submitReport} onClick={(event) => event.stopPropagation()} style={{ width: 'min(560px, 100%)', padding: 24, background: '#0d1629', boxShadow: '0 24px 80px rgba(0,0,0,.55)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}><div><div className="section-title" style={{ marginBottom: 4 }}>Report a road issue</div><div style={{ color: '#64748b', fontSize: 11 }}>Your submission will be reviewed before it becomes a verified record.</div></div><button type="button" aria-label="Close" onClick={() => setShowReport(false)} style={{ background: 'none', border: 0, color: '#64748b', cursor: 'pointer' }}><X size={18} /></button></div><div style={{ display: 'grid', gap: 12 }}><label style={{ color: '#94a3b8', fontSize: 11 }}>Issue type<select className="input-field" value={report.issueType} onChange={(event) => setReport({ ...report, issueType: event.target.value })} style={{ marginTop: 6 }}><option>Pothole</option><option>Cracks</option><option>Waterlogging</option><option>Broken road edge</option><option>Obstruction</option><option>Other</option></select></label><label style={{ color: '#94a3b8', fontSize: 11 }}>Location<input className="input-field" required value={report.location} onChange={(event) => setReport({ ...report, location: event.target.value })} placeholder="Road name, landmark, or GPS pin" style={{ marginTop: 6 }} /></label><label style={{ color: '#94a3b8', fontSize: 11 }}>Description<textarea className="input-field" required value={report.description} onChange={(event) => setReport({ ...report, description: event.target.value })} placeholder="What did you observe?" rows={4} style={{ marginTop: 6, resize: 'vertical' }} /></label><label style={{ color: '#94a3b8', fontSize: 11 }}>Name (optional)<input className="input-field" value={report.reporter} onChange={(event) => setReport({ ...report, reporter: event.target.value })} placeholder="Anonymous" style={{ marginTop: 6 }} /></label></div><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 18 }}><button type="button" className="btn-secondary" onClick={() => setShowReport(false)}>Cancel</button><button type="submit" className="btn-primary"><CheckCircle2 size={15} /> Submit for review</button></div></form></div>}
    </div>
  );
}
