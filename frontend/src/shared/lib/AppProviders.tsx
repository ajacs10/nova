'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';

export function AppProviders({ children }: { children: React.ReactNode })
{
  return <AuthProvider>{children}</AuthProvider>;
}
