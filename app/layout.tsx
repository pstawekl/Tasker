'use client';
import LayoutManager from '@/components/layout-manager';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { notificationService } from '../utils/notificationUtils';
import { SettingsUtils } from '../utils/settingsUtils';
import './globals.css';

export default function RootLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const settingsUtils = SettingsUtils.getInstance();

  useEffect(() => {
    setIsMounted(true);
    settingsUtils.appMode = localStorage.getItem('appMode') as 'light' | 'dark' || 'light';

    if (settingsUtils.appMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const initializeApp = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
        }

        await notificationService.checkPermission();
        console.log('Notification service initialized');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

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
