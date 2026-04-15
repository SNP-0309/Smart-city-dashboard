'use client';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/lib/store';

export function useLiveSocket() {
  const { setLive, addLog } = useAppStore();
  const lastRef = useRef<{ aqi?: number; traffic?: number; complaints?: number }>({});

  useEffect(() => {
    const url =
      (process.env.NEXT_PUBLIC_WS_URL as string | undefined) ??
      'ws://127.0.0.1:8010/ws/live';

    let ws: WebSocket | null = null;
    let closedByUs = false;
    let retryTimer: number | undefined;

    const connect = () => {
      try {
        ws = new WebSocket(url);
      } catch {
        retryTimer = window.setTimeout(connect, 2000);
        return;
      }

      ws.onopen = () => {
        addLog({ level: 'info', message: 'WebSocket connected', meta: { url } });
      };

      ws.onclose = () => {
        addLog({ level: 'warning', message: 'WebSocket disconnected', meta: { url } });
        if (!closedByUs) retryTimer = window.setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        // browser will also call close; keep logs minimal
      };

      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload?.event !== 'live_update') return;
          const data = payload?.aqi_city_avg != null ? payload : payload?.data ?? payload;

          const aqi = Number(data.aqi_city_avg);
          const traffic = Number(data.traffic_congestion_avg);
          const complaints = Number(data.active_complaints);
          const ts = String(data.timestamp ?? new Date().toISOString());

          if (Number.isFinite(aqi) && Number.isFinite(traffic) && Number.isFinite(complaints)) {
            setLive({ aqi_city_avg: aqi, traffic_congestion_avg: traffic, active_complaints: complaints, timestamp: ts });

            // Toasts when things spike (demo-friendly, not noisy)
            const last = lastRef.current;
            if (last.aqi != null && aqi >= 170 && last.aqi < 170) {
              toast.error(`AQI critical spike: ${aqi}`);
              addLog({ level: 'critical', message: 'AQI spike detected', meta: { aqi } });
            }
            if (last.traffic != null && traffic >= 85 && last.traffic < 85) {
              toast(`Traffic congestion severe: ${traffic}%`, { icon: '🚦' as any });
              addLog({ level: 'warning', message: 'Traffic congestion severe', meta: { traffic } });
            }
            if (last.complaints != null && complaints > last.complaints) {
              toast(`New complaint detected (+${complaints - last.complaints})`, { icon: '📝' as any });
              addLog({ level: 'info', message: 'Complaint count increased', meta: { complaints } });
            }

            lastRef.current = { aqi, traffic, complaints };
          }
        } catch {
          // ignore malformed frames
        }
      };
    };

    connect();

    return () => {
      closedByUs = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
  }, [addLog, setLive]);
}

