'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/lib/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 22, 41, 0.98)',
            color: '#f0f6ff',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 14,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          },
        }}
      />
    </>
  );
}

