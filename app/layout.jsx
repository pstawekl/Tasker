'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import React, { useEffect } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import LayoutManager from '@/components/layout-manager';

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator)
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" />
      </head>
      <body>
        <UserProvider>
          <LayoutManager children={children} />
        </UserProvider>
      </body>
    </html>
  );
}
