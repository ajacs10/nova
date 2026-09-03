'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';

function ThemeInitializer() {
  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem('nova-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode })
{
  return <AuthProvider><ThemeInitializer />{children}</AuthProvider>;
}
