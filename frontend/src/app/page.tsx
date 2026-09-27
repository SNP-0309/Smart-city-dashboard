'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useLiveSocket } from '@/lib/useLiveSocket';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import OverviewPage from '@/components/pages/OverviewPage';
import MapPage from '@/components/pages/MapPage';
import TrafficPage from '@/components/pages/TrafficPage';
import AQIPage from '@/components/pages/AQIPage';
import WastePage from '@/components/pages/WastePage';
import WaterPage from '@/components/pages/WaterPage';
import InfrastructurePage from '@/components/pages/InfrastructurePage';
import ComplaintsPage from '@/components/pages/ComplaintsPage';
import AlertsPage from '@/components/pages/AlertsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import AdminPage from '@/components/pages/AdminPage';
import AIAlertsPage from '@/components/pages/AIAlertsPage';
import RoadIntelligencePage from '@/components/pages/RoadIntelligencePage';
import AdminOperationsPage from '@/components/pages/AdminOperationsPage';
import MobileBottomNav from '@/components/MobileBottomNav';

const pageMap: Record<string, React.ComponentType> = {
  overview: OverviewPage,
  'road-intelligence': RoadIntelligencePage,
  'issue-operations': AdminOperationsPage,
  map: MapPage,
  traffic: TrafficPage,
  aqi: AQIPage,
  waste: WastePage,
  water: WaterPage,
  infrastructure: InfrastructurePage,
  complaints: ComplaintsPage,
  alerts: AlertsPage,
  'ai-alerts': AIAlertsPage,
  analytics: AnalyticsPage,
  admin: AdminPage,
};

export default function Dashboard() {
  const { activePage, sidebarCollapsed } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useLiveSocket();
  
  const PageComponent = pageMap[activePage] || OverviewPage;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePage]);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)} />
      
      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: 60,
          minHeight: 'calc(100vh - 60px)',
          paddingBottom: isMobile ? 72 : 0, // space for bottom nav
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
        }}
      >
        <PageComponent key={activePage} />
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
