'use client';

import { useState, useEffect, useRef } from 'react';
import {
  aiPredictions, aiModelMetrics, riskTimeline,
  getRiskColor, getRiskBg, getSystemIcon, getSystemColor,
  type AIPrediction, type RiskLevel, type PredictionSystem
} from '@/lib/mockData';
import {
  Brain, AlertTriangle, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronUp, RefreshCw, Shield, Zap, Eye,
  Clock, Target, CheckCircle, Radio, Filter, BarChart2,
  Cpu, Activity
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, Legend, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

// ── Animated confidence bar ──────────────────────────────────────
function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}60`,
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

// ── Probability ring ─────────────────────────────────────────────
function ProbabilityRing({ probability, risk }: { probability: number; risk: RiskLevel }) {
  const color = getRiskColor(risk);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPct(probability), 200);
    return () => clearTimeout(t);
  }, [probability]);

  return (
    <svg width={72} height={72} viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform="rotate(-90, 36, 36)"
        style={{ filter: `drop-shadow(0 0 5px ${color}80)`, transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="36" y="40" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

// ── Risk badge ───────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: RiskLevel }) {
  const color = getRiskColor(risk);
  const labels = { critical: '🔴 CRITICAL', high: '🟠 HIGH', medium: '🟡 MEDIUM', low: '🟢 LOW' };
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.8px',
      background: `${color}18`,
      color,
      border: `1px solid ${color}35`,
      whiteSpace: 'nowrap',
    }}>
      {labels[risk]}
    </span>
  );
}

// ── System chip ──────────────────────────────────────────────────
function SystemChip({ system }: { system: PredictionSystem }) {
  const color = getSystemColor(system);
  const icon = getSystemIcon(system);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: `${color}14`, color, border: `1px solid ${color}28`,
    }}>
      {icon} {system.charAt(0).toUpperCase() + system.slice(1)}
    </span>
  );
}

// ── Prediction Card ──────────────────────────────────────────────
function PredictionCard({ pred, index }: { pred: AIPrediction; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = getRiskColor(pred.risk);
  const bg = getRiskBg(pred.risk);

  const TrendIcon = pred.trend === 'worsening' ? TrendingUp : pred.trend === 'improving' ? TrendingDown : Minus;
  const trendColor = pred.trend === 'worsening' ? '#ef4444' : pred.trend === 'improving' ? '#10b981' : '#94a3b8';

  return (
    <div
      style={{
        borderRadius: 16,
        background: bg,
        border: `1px solid ${color}28`,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        animation: `fade-slide-in 0.4s ease ${index * 0.06}s both`,
      }}
    >
      {/* Card Header */}
      <div
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Probability ring */}
        <ProbabilityRing probability={pred.probability} risk={pred.risk} />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 }}>
            <RiskBadge risk={pred.risk} />
            <SystemChip system={pred.system} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: trendColor, fontWeight: 600 }}>
              <TrendIcon size={12} /> {pred.trend}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 4, lineHeight: 1.3 }}>
            {pred.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> ETA: <strong style={{ color: '#f0f6ff' }}>{pred.eta}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Target size={11} /> AI: <strong style={{ color }}>{pred.confidence}% confident</strong>
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
          {expanded ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
        </div>
      </div>

      {/* Confidence bar */}
      <div style={{ padding: '0 20px 14px' }}>
        <ConfidenceBar value={pred.confidence} color={color} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          borderTop: `1px solid ${color}20`,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{pred.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {[
              { label: 'Affected Area', value: pred.affectedArea, icon: '📍' },
              { label: 'Impact', value: pred.impact, icon: '⚠️' },
              { label: 'Model', value: pred.modelVersion, icon: '🤖' },
              { label: 'Probability', value: `${pred.probability}% likely`, icon: '📊' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontSize: 12, color: '#f0f6ff', fontWeight: 500, lineHeight: 1.4 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Recommendation</div>
              <p style={{ fontSize: 13, color: '#f0f6ff', lineHeight: 1.4 }}>{pred.recommendation}</p>
            </div>
          </div>

          {/* Actions for admin */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'linear-gradient(135deg, #00d4ff, #3b82f6)', color: 'white', border: 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Zap size={12} /> Dispatch Response
            </button>
            <button style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Radio size={12} /> Send Alert
            </button>
            <button style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Eye size={12} /> Monitor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
const SYSTEM_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: '🌫️ AQI', value: 'aqi' },
  { label: '🚦 Traffic', value: 'traffic' },
  { label: '💧 Water', value: 'water' },
  { label: '🗑️ Waste', value: 'waste' },
  { label: '⚡ Infra', value: 'infrastructure' },
  { label: '🌊 Flood', value: 'flood' },
];

const riskRadarData = [
  { subject: 'Traffic', value: 87, fullMark: 100 },
  { subject: 'AQI', value: 92, fullMark: 100 },
  { subject: 'Water', value: 74, fullMark: 100 },
  { subject: 'Waste', value: 78, fullMark: 100 },
  { subject: 'Flood', value: 76, fullMark: 100 },
  { subject: 'Infra', value: 68, fullMark: 100 },
];

export default function AIAlertsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'eta' | 'risk' | 'confidence'>('risk');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); setLastRefresh(new Date()); }, 1200);
  };

  const riskOrder: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const filtered = aiPredictions
    .filter(p => filter === 'all' || p.system === filter)
    .filter(p => riskFilter === 'all' || p.risk === riskFilter)
    .sort((a, b) => {
      if (sortBy === 'risk') return riskOrder[a.risk] - riskOrder[b.risk];
      if (sortBy === 'eta') return a.etaMs - b.etaMs;
      return b.confidence - a.confidence;
    });

  const criticalCount = aiPredictions.filter(p => p.risk === 'critical').length;
  const highCount = aiPredictions.filter(p => p.risk === 'high').length;
  const totalRisk = Math.round(
    (criticalCount * 4 + highCount * 3 + aiPredictions.filter(p => p.risk === 'medium').length * 2) / aiPredictions.length * 25
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(13,22,41,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  };

  return (
    <div className="page-enter" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start',
        marginBottom: 24,
        padding: '20px 24px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.08) 60%, rgba(0, 212, 255, 0.06) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            boxShadow: '0 0 24px rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#f0f6ff', marginBottom: 4 }}>
              AI Future Problem Detection
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Predictive risk analysis across all city systems · Updated {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="live-indicator">AI Active</span>
          <button
            onClick={handleRefresh}
            style={{
              width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} color="#94a3b8" style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Critical Risks', value: criticalCount, color: '#ef4444', icon: '🔴', sub: 'Immediate action needed' },
          { label: 'High Risks', value: highCount, color: '#f97316', icon: '🟠', sub: 'Act within hours' },
          { label: 'Medium Risks', value: aiPredictions.filter(p => p.risk === 'medium').length, color: '#f59e0b', icon: '🟡', sub: 'Monitor closely' },
          { label: 'City Risk Score', value: `${totalRisk}/100`, color: '#8b5cf6', icon: '📊', sub: 'Combined risk index' },
          { label: 'AI Predictions', value: aiPredictions.length, color: '#00d4ff', icon: '🤖', sub: 'Next 72 hours' },
          { label: 'Avg Confidence', value: `${Math.round(aiPredictions.reduce((s, p) => s + p.confidence, 0) / aiPredictions.length)}%`, color: '#10b981', icon: '🎯', sub: 'Model accuracy avg' },
        ].map((s) => (
          <div key={s.label} className="metric-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 16, marginBottom: 24 }}>
        
        {/* Risk Timeline Area Chart */}
        <div className="glass-card" style={{ padding: 20, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div className="section-title" style={{ marginBottom: 2 }}>Predicted Risk Timeline — Next 72 Hours</div>
              <div style={{ fontSize: 12, color: '#475569' }}>Risk index per system (0 = safe, 100 = critical)</div>
            </div>
            <BarChart2 size={18} color="#8b5cf6" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={riskTimeline} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                {[
                  ['traffic', '#f59e0b'],
                  ['aqi', '#ef4444'],
                  ['water', '#3b82f6'],
                  ['waste', '#10b981'],
                  ['infra', '#8b5cf6'],
                ].map(([key, color]) => (
                  <linearGradient key={key} id={`ai-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color as string} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color as string} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="aqi" name="AQI" stroke="#ef4444" fill="url(#ai-grad-aqi)" strokeWidth={2} />
              <Area type="monotone" dataKey="traffic" name="Traffic" stroke="#f59e0b" fill="url(#ai-grad-traffic)" strokeWidth={2} />
              <Area type="monotone" dataKey="water" name="Water" stroke="#3b82f6" fill="url(#ai-grad-water)" strokeWidth={2} />
              <Area type="monotone" dataKey="waste" name="Waste" stroke="#10b981" fill="url(#ai-grad-waste)" strokeWidth={2} />
              <Area type="monotone" dataKey="infra" name="Infra" stroke="#8b5cf6" fill="url(#ai-grad-infra)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 4 }}>City Risk Radar</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>Current combined risk index</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={riskRadarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Risk" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AI Model Accuracy ── */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="section-title" style={{ marginBottom: 2 }}>AI Model Performance</div>
            <div style={{ fontSize: 12, color: '#475569' }}>Prediction accuracy of active ML models</div>
          </div>
          <Cpu size={18} color="#00d4ff" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {aiModelMetrics.map((m) => {
            const color = getSystemColor(m.system as any);
            return (
              <div key={m.model} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{m.model}</div>
                  <span style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{m.accuracy}%</span>
                </div>
                <ConfidenceBar value={m.accuracy} color={color} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#475569' }}>
                  <span>Trained {m.lastTrained}</span>
                  <span>{m.correct}/{m.predictions} correct</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Predictions List ── */}
      <div className="glass-card" style={{ padding: 20 }}>
        {/* Filters & Sort */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 8 }}>Filter by System</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SYSTEM_FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                  background: filter === f.value ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: filter === f.value ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)',
                  color: filter === f.value ? '#8b5cf6' : '#94a3b8',
                  transition: 'all 0.2s',
                }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 8 }}>Risk Level</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'critical', 'high', 'medium', 'low'].map(r => (
                  <button key={r} onClick={() => setRiskFilter(r)} style={{
                    padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid',
                    background: riskFilter === r ? `${r === 'all' ? '#8b5cf6' : getRiskColor(r as RiskLevel)}18` : 'rgba(255,255,255,0.04)',
                    borderColor: riskFilter === r ? `${r === 'all' ? '#8b5cf6' : getRiskColor(r as RiskLevel)}40` : 'rgba(255,255,255,0.08)',
                    color: riskFilter === r ? (r === 'all' ? '#8b5cf6' : getRiskColor(r as RiskLevel)) : '#94a3b8',
                    textTransform: 'capitalize',
                  }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 8 }}>Sort by</div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input-field" style={{ height: 34, fontSize: 12, paddingTop: 0, paddingBottom: 0, width: 'auto' }}>
                <option value="risk">Risk Level</option>
                <option value="eta">Time to Impact</option>
                <option value="confidence">AI Confidence</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>
          Showing <strong style={{ color: '#f0f6ff' }}>{filtered.length}</strong> predictions · Click any card to expand details
        </div>

        {/* Prediction cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((pred, i) => (
            <PredictionCard key={pred.id} pred={pred} index={i} />
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569' }}>
              <Brain size={40} color="#475569" style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No predictions matching current filters</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
