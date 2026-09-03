'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiError, getCurrentUser, logout, updateProfile } from './api';

interface User
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarData?: string | null;
  role: string;
}

interface AuthContextType
{
  user: User | null;
  isLoggedIn: boolean;
  isReady: boolean;
  loginUser: (user: User) => void;
  updateUser: (data: { name: string; email: string; phone?: string }) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isReady: false,
  loginUser: () => {},
  updateUser: async () => {},
  logoutUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode })
{
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasSessionMarker = document.cookie
      .split('; ')
      .some((cookie) => cookie === 'nova_session_present=1');

    if (!hasSessionMarker) {
      const readyTimer = window.setTimeout(() => setIsReady(true), 0);
      return () => window.clearTimeout(readyTimer);
    }

    getCurrentUser()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
          document.cookie = 'nova_session_present=; path=/; max-age=0; samesite=lax';
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const loginUser = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const updateUser = async (data: { name: string; email: string; phone?: string }) => {
    const result = await updateProfile(data);
    setUser(result.user);
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isReady, loginUser, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
