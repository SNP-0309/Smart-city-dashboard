'use client';
import { useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

export type LiveUpdate = {
  timestamp?: string;
  aqi_city_avg?: number;
  traffic_congestion_avg?: number;
  active_complaints?: number;
};

export type SystemLogEntry = {
  id: string;
  ts: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  meta?: Record<string, string | number>;
};

// Store for global state
interface AppState {
  role: 'citizen' | 'admin';
  activePage: string;
  sidebarCollapsed: boolean;
  notifications: number;
  theme: ThemeMode;
  live: LiveUpdate;
  emergencyMode: boolean;
  logs: SystemLogEntry[];
  setRole: (role: 'citizen' | 'admin') => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  clearNotifications: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLive: (live: LiveUpdate) => void;
  triggerEmergencyMode: () => void;
  addLog: (entry: Omit<SystemLogEntry, 'id' | 'ts'> & Partial<Pick<SystemLogEntry, 'id' | 'ts'>>) => void;
}

let globalState: AppState = {
  role: 'admin',
  activePage: 'overview',
  sidebarCollapsed: false,
  notifications: 5,
  theme: 'dark',
  live: {},
  emergencyMode: false,
  logs: [],
  setRole: () => {},
  setActivePage: () => {},
  toggleSidebar: () => {},
  clearNotifications: () => {},
  setTheme: () => {},
  setLive: () => {},
  triggerEmergencyMode: () => {},
  addLog: () => {},
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(l => l());
}

export function useAppStore(): AppState {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender(n => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return {
    ...globalState,
    setRole: (role) => {
      globalState = { ...globalState, role };
      notifyListeners();
    },
    setActivePage: (page) => {
      globalState = { ...globalState, activePage: page };
      notifyListeners();
    },
    toggleSidebar: () => {
      globalState = { ...globalState, sidebarCollapsed: !globalState.sidebarCollapsed };
      notifyListeners();
    },
    clearNotifications: () => {
      globalState = { ...globalState, notifications: 0 };
      notifyListeners();
    },
    setTheme: (theme) => {
      globalState = { ...globalState, theme };
      notifyListeners();
    },
    setLive: (live) => {
      globalState = { ...globalState, live: { ...globalState.live, ...live } };
      notifyListeners();
    },
    triggerEmergencyMode: () => {
      globalState = { ...globalState, emergencyMode: true, notifications: globalState.notifications + 3, activePage: 'traffic' };
      notifyListeners();
    },
    addLog: (entry) => {
      const full: SystemLogEntry = {
        id: entry.id ?? `LOG-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        ts: entry.ts ?? new Date().toISOString(),
        level: entry.level,
        message: entry.message,
        meta: entry.meta,
      };
      globalState = { ...globalState, logs: [full, ...globalState.logs].slice(0, 200) };
      notifyListeners();
    },
  };
}
