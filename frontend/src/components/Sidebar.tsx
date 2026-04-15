'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard, Car, Wind, Trash2, Droplets,
  MessageSquare, Settings, Menu, X, Shield, Zap, Building2, Map,
  Bell, TrendingUp, Brain, ChevronRight
} from 'lucide-react';
import { aiPredictions } from '@/lib/mockData';

const navItems = [
  { id: 'overview',    label: 'Overview',      icon: LayoutDashboard },
  { id: 'map',         label: 'Live Map',      icon: Map },
  { id: 'traffic',     label: 'Traffic',        icon: Car },
  { id: 'aqi',         label: 'Air Quality',    icon: Wind },
  { id: 'waste',       label: 'Waste Mgmt',     icon: Trash2 },
  { id: 'water',       label: 'Water',          icon: Droplets },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'complaints',  label: 'Complaints',     icon: MessageSquare },
  { id: 'alerts',      label: 'Alerts',         icon: Bell },
];

const adminItems = [
  { id: 'ai-alerts',   label: 'AI Predictions', icon: Brain,       badge: 'NEW' },
  { id: 'analytics',   label: 'Analytics',       icon: TrendingUp },
  { id: 'admin',       label: 'Admin Panel',     icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar, role } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);
  const criticalAI = aiPredictions.filter(p => p.risk === 'critical').length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile, "open" means visible; collapsed is irrelevant
  const isCollapsed = isMobile ? false : sidebarCollapsed;
  const sidebarVisible = isMobile ? mobileOpen : true;

  const handleNav = (id: string) => {
    setActivePage(id);
    if (isMobile && onMobileClose) onMobileClose();
  };

  const sidebarWidth = isCollapsed ? 72 : 240;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 39,
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          zIndex: 40,
          width: isMobile ? 260 : sidebarWidth,
          transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(6, 11, 24, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: isCollapsed ? '20px 16px' : '20px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, #00d4ff, #3b82f6)',
            boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={20} color="white" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#f0f6ff' }}>MetroCity</div>
              <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Smart Dashboard</div>
            </div>
          )}
          {isMobile && (
            <button onClick={onMobileClose} style={{
              marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <X size={15} color="#94a3b8" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
          {!isCollapsed && (
            <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 6px 8px' }}>
              City Systems
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%', background: 'none', border: 'none', fontFamily: 'inherit',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '10px' : '10px 14px',
                  }}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && <span style={{ fontSize: 14 }}>{item.label}</span>}
                  {!isCollapsed && isActive && (
                    <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '14px 4px' }} />

          {!isCollapsed && (
            <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 6px 8px' }}>
              Administration
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {adminItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isAI = item.id === 'ai-alerts';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%', background: 'none', border: 'none', fontFamily: 'inherit',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '10px' : '10px 14px',
                    position: 'relative',
                  }}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && <span style={{ fontSize: 14 }}>{item.label}</span>}
                  {isAI && !isCollapsed && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.4px',
                      padding: '2px 6px', borderRadius: 6,
                      background: 'rgba(139,92,246,0.2)', color: '#a78bfa',
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}>
                      {criticalAI} CRIT
                    </span>
                  )}
                  {isAI && isCollapsed && criticalAI > 0 && (
                    <span style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#ef4444', fontSize: 8, fontWeight: 800,
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #060b18',
                    }}>
                      {criticalAI}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Profile */}
        <div style={{ padding: '10px 10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {isCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white' }}>
                {role === 'admin' ? 'AD' : 'CT'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {role === 'admin' ? 'AD' : 'CT'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{role === 'admin' ? 'Admin User' : 'Citizen'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={10} color={role === 'admin' ? '#00d4ff' : '#10b981'} />
                  <span style={{ fontSize: 11, color: role === 'admin' ? '#00d4ff' : '#10b981', fontWeight: 600, textTransform: 'capitalize' }}>{role}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            style={{
              position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
              width: 24, height: 24, borderRadius: '50%',
              background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10,
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={12} color="#94a3b8" /> : <X size={12} color="#94a3b8" />}
          </button>
        )}
      </aside>
    </>
  );
}
