'use client';

import { useState, useRef } from 'react';
import { complaints, complaintsByArea, complaintsByType, getPriorityColor, getStatusColor } from '@/lib/mockData';
import { downloadText, toCSV } from '@/lib/exporters';
import { MessageSquare, Plus, Upload, MapPin, Filter, Search, X, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import {
  BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useAppStore } from '@/lib/store';

const COMPLAINT_TYPES = ['Pothole', 'Garbage', 'Streetlight', 'Water Leak', 'Smoke', 'Noise', 'Other'];

export default function ComplaintsPage() {
  const { role } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiDetected, setAiDetected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchSearch = !searchQuery || c.type.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = {
    Open: complaints.filter(c => c.status === 'Open').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        // Simulate AI detection
        setTimeout(() => {
          const types = ['Pothole', 'Garbage', 'Smoke'];
          setAiDetected(types[Math.floor(Math.random() * types.length)]);
          setSelectedType(types[Math.floor(Math.random() * types.length)]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setImagePreview(null);
        setAiDetected(null);
        setDescription('');
        setLocation('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="page-enter" style={{ padding: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Open', value: statusCounts.Open, icon: AlertCircle, color: '#ef4444' },
          { label: 'In Progress', value: statusCounts['In Progress'], icon: Clock, color: '#f59e0b' },
          { label: 'Resolved', value: statusCounts.Resolved, icon: CheckCircle, color: '#10b981' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus(s.label)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{s.label} Complaints</div>
                </div>
                <Icon size={32} color={s.color} opacity={0.3} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Complaint Form */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 560, padding: 28, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} color="#94a3b8" />
            </button>

            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>Report an Issue</h3>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>AI will automatically detect the issue type from your photo</p>

            {/* Image Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed rgba(0, 212, 255, 0.3)',
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: 20,
                background: imagePreview ? 'transparent' : 'rgba(0, 212, 255, 0.03)',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 140,
              }}
            >
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: 'cover', maxWidth: '100%' }} />
                  {aiDetected ? (
                    <div style={{ marginTop: 10, padding: '8px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                      🤖 AI Detected: {aiDetected}
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>🔍 AI analyzing image...</div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload size={32} color="#00d4ff" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>Click to upload photo</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>AI will detect issue type automatically</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

            {/* Type & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Issue Type</label>
                <select className="input-field" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f6ff' }}>
                  <option value="" style={{ background: '#0d1629' }}>Select type</option>
                  {COMPLAINT_TYPES.map(t => <option key={t} value={t} style={{ background: '#0d1629' }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Priority</label>
                <select className="input-field" value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f6ff' }}>
                  {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p} style={{ background: '#0d1629' }}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-field" style={{ paddingLeft: 34 }} placeholder="Enter address or click map" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Description</label>
              <textarea className="input-field" rows={3} placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 14, background: submitted ? 'linear-gradient(135deg, #10b981, #059669)' : undefined }}
              onClick={handleSubmit}
              disabled={submitting || submitted}
            >
              {submitted ? <><CheckCircle size={16} /> Submitted!</> : submitting ? 'Submitting...' : <><Send size={16} /> Submit Complaint</>}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        
        {/* Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1px solid',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterStatus === s ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                    borderColor: filterStatus === s ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255,255,255,0.08)',
                    color: filterStatus === s ? '#00d4ff' : '#94a3b8',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} color="#475569" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-field" style={{ paddingLeft: 30, height: 36, width: 180, fontSize: 12 }} placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button
                className="btn-secondary"
                style={{ height: 36, fontSize: 12 }}
                onClick={() => {
                  const rows = filtered.map((c: any) => ({
                    id: c.id,
                    type: c.type,
                    status: c.status,
                    priority: c.priority,
                    area: c.area,
                    location: c.location,
                    reportedBy: c.reportedBy,
                    timestamp: c.timestamp,
                    description: c.description,
                    lat: c.lat ?? '',
                    lng: c.lng ?? '',
                  }));
                  const csv = toCSV(rows);
                  downloadText(`complaints-report.csv`, csv, 'text/csv;charset=utf-8');
                }}
              >
                Export CSV
              </button>
              <button className="btn-primary" style={{ height: 36, fontSize: 12 }} onClick={() => setShowForm(true)}>
                <Plus size={14} /> Report
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['ID', 'Type', 'Location', 'Priority', 'Status', 'Reported', role === 'admin' ? 'Action' : ''].filter(Boolean).map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td style={{ padding: '12px 14px', color: '#00d4ff', fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>{c.id}</td>
                    <td style={{ padding: '12px 14px', color: '#f0f6ff', fontWeight: 500 }}>{c.type}</td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.location}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: getPriorityColor(c.priority) }}>● {c.priority}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${c.status === 'Open' ? 'badge-red' : c.status === 'In Progress' ? 'badge-orange' : 'badge-green'}`}>{c.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569', fontSize: 11 }}>{new Date(c.timestamp).toLocaleDateString()}</td>
                    {role === 'admin' && (
                      <td style={{ padding: '12px 14px' }}>
                        <button style={{ fontSize: 11, color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Update</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>By Area</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={complaintsByArea} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} hide />
                <YAxis dataKey="area" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" name="Complaints" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {complaintsByArea.map((_, i) => <Cell key={i} fill={`hsl(${210 + i * 20}, 70%, 55%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Issue Types</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {complaintsByType.map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: '#94a3b8' }}>{t.name}</div>
                  <div className="progress-bar" style={{ width: 60 }}>
                    <div className="progress-fill" style={{ width: `${(t.value / 34) * 100}%`, background: t.color }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f6ff', width: 24, textAlign: 'right' }}>{t.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
