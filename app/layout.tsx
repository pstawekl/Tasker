'use client';
import LayoutManager from '@/components/layout-manager';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    if ('serviceWorker' in navigator)
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
  }, []);

  // if (!isMounted) return <div></div>

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" />
      </head>
      <body className='h-screen w-screen'>
        <LayoutManager>
          {children}
        </LayoutManager>
      </body>
    </html>
  );
}
