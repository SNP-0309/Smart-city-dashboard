'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { trafficZones, trafficHistory, getCongestionColor } from '@/lib/mockData';
import { Car, Navigation, Clock, AlertTriangle, TrendingUp, Camera, Play, Pause, Volume2, VolumeX, Upload, RotateCcw } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(13, 22, 41, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrafficPage() {
  const totalVehicles = trafficZones.reduce((s, z) => s + z.vehicles, 0);
  const avgCongestion = Math.round(trafficZones.reduce((s, z) => s + z.congestion, 0) / trafficZones.length);
  const avgSpeed = Math.round(trafficZones.reduce((s, z) => s + z.speed, 0) / trafficZones.length);

  const cameras = useMemo(
    () => [
      { id: 'CAM-01', name: 'Main Blvd & 5th', location: 'Downtown', status: 'Live' as const },
      { id: 'CAM-02', name: 'Airport Corridor', location: 'Airport', status: 'Live' as const },
      { id: 'CAM-03', name: 'Harbor Express', location: 'Harbor', status: 'Live' as const },
      { id: 'CAM-04', name: 'Industrial Bypass', location: 'Industrial', status: 'Intermittent' as const },
    ],
    [],
  );

  const DEMO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  const [activeCam, setActiveCam] = useState(cameras[0]?.id ?? 'CAM-01');
  const [videoSrc, setVideoSrc] = useState<string>(DEMO_URL);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [useDemo, setUseDemo] = useState(true);
  const [uploadedName, setUploadedName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      void el.play().catch(() => setIsPlaying(false));
    } else {
      el.pause();
    }
  }, [isPlaying, videoSrc]);

  useEffect(() => {
    return () => {
      // If we generated an object URL, release it on unmount.
      if (videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    };
  }, [videoSrc]);

  const onUpload = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) return;

    setUseDemo(false);
    setUploadedName(file.name);
    if (videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsPlaying(true);
  };

  const resetToDemo = () => {
    setUseDemo(true);
    setUploadedName('');
    if (videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    setVideoSrc(DEMO_URL);
    setIsPlaying(false);
  };

  return (
    <div className="page-enter" style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Vehicles', value: totalVehicles.toLocaleString(), icon: Car, color: '#3b82f6', sub: 'across all roads' },
          { label: 'Avg Congestion', value: `${avgCongestion}%`, icon: AlertTriangle, color: '#f59e0b', sub: 'city-wide' },
          { label: 'Avg Speed', value: `${avgSpeed} km/h`, icon: Navigation, color: '#10b981', sub: 'current avg' },
          { label: 'Peak Hour', value: '8:30 AM', icon: Clock, color: '#8b5cf6', sub: 'most congested' },
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

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Congestion Trend (Today)</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trafficHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="mainBoulevard" name="Main Blvd" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="harborExpress" name="Harbor Exp" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="northRing" name="North Ring" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Congestion by Road</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trafficZones} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <YAxis dataKey="road" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={115} />
              <Tooltip formatter={(v) => [`${v}%`, 'Congestion']} contentStyle={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar dataKey="congestion" radius={[0, 4, 4, 0]}>
                {trafficZones.map((entry) => (
                  <Cell key={entry.id} fill={getCongestionColor(entry.congestion)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CCTV demo feed + quick controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={18} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#f0f6ff' }}>CCTV Feed</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>
                  {cameras.find((c) => c.id === activeCam)?.name ?? 'Camera'}
                  {uploadedName ? ` • ${uploadedName}` : useDemo ? ' • Demo footage' : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setMuted((m) => !m)}
                style={{ padding: '8px 10px', borderRadius: 12 }}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                className="btn-primary"
                onClick={() => setIsPlaying((p) => !p)}
                style={{ padding: '8px 12px', borderRadius: 12 }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span style={{ fontSize: 12 }}>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.35)' }}>
            <video
              ref={videoRef}
              src={videoSrc}
              controls={false}
              playsInline
              muted={muted}
              style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Overlay HUD */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${cameras.find((c) => c.id === activeCam)?.status === 'Live' ? 'badge-green' : 'badge-orange'}`}>
                  {cameras.find((c) => c.id === activeCam)?.status ?? 'Live'}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(6,11,24,0.65)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 999 }}>
                  {activeCam}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(6,11,24,0.65)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 999 }}>
                  {new Date().toLocaleTimeString()}
                </span>
                <span style={{ fontSize: 11, color: '#f0f6ff', background: 'rgba(6,11,24,0.65)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 999 }}>
                  Signal: {cameras.find((c) => c.id === activeCam)?.status === 'Live' ? 'Strong' : 'Medium'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="btn-secondary" style={{ padding: '8px 12px', borderRadius: 12, cursor: 'pointer' }}>
              <Upload size={16} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Upload demo video</span>
              <input
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            <button className="btn-secondary" onClick={resetToDemo} style={{ padding: '8px 12px', borderRadius: 12 }}>
              <RotateCcw size={16} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Reset to demo</span>
            </button>
            <span style={{ fontSize: 11, color: '#475569' }}>
              Tip: upload any small `.mp4`/`.mov` to simulate CCTV footage.
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 18 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Camera Control</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 12, color: '#94a3b8' }}>Select camera</label>
            <select value={activeCam} onChange={(e) => setActiveCam(e.target.value)} className="input-field">
              {cameras.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#0d1629' }}>
                  {c.id} — {c.location}
                </option>
              ))}
            </select>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Mode</span>
              <span className={`badge ${useDemo ? 'badge-purple' : 'badge-cyan'}`}>{useDemo ? 'DEMO' : 'LOCAL'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setIsPlaying(false)} style={{ justifyContent: 'center' }}>
                Pause feed
              </button>
              <button className="btn-secondary" onClick={() => setIsPlaying(true)} style={{ justifyContent: 'center' }}>
                Resume
              </button>
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Incident simulation</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>
                This is a demo CCTV panel. For real CCTV, wire a stream URL (HLS/WebRTC) to the video source.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Road Status Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-title">Road-by-Road Status</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Road', 'Status', 'Congestion', 'Avg Speed', 'Vehicles', 'Prediction'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trafficZones.map((zone) => (
                <tr key={zone.id} className="table-row">
                  <td style={{ padding: '14px 16px', color: '#f0f6ff', fontWeight: 500 }}>{zone.road}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${zone.status === 'Severe' ? 'badge-red' : zone.status === 'Heavy' ? 'badge-orange' : zone.status === 'Moderate' ? 'badge-orange' : 'badge-green'}`}>
                      {zone.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ width: 100 }}>
                        <div className="progress-fill" style={{ width: `${zone.congestion}%`, background: getCongestionColor(zone.congestion) }} />
                      </div>
                      <span style={{ color: getCongestionColor(zone.congestion), fontWeight: 700 }}>{zone.congestion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{zone.speed} km/h</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{zone.vehicles.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: zone.congestion > 70 ? '#ef4444' : '#10b981' }}>
                      <TrendingUp size={14} />
                      {zone.congestion > 70 ? 'Will worsen' : 'Clearing soon'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
