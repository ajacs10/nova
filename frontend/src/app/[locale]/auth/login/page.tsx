'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { LanguageDropdown } from '@/shared/ui/LanguageDropdown';

import { useAuth } from '@/shared/lib/AuthContext';
import { ApiError, getUserFriendlyError, login } from '@/shared/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';
  const { loginUser, isLoggedIn, isReady } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isReady && isLoggedIn) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  if (isReady && isLoggedIn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.user) {
        loginUser(result.user);
        router.push(`/${locale}/dashboard`);
      }
    } catch (requestError) {
      const invalidCredentials = requestError instanceof ApiError && (requestError.status === 401 || requestError.status === 404);
      setError(invalidCredentials
        ? (isPt ? 'Email ou palavra-passe incorretos.' : 'Incorrect email or password.')
        : getUserFriendlyError(requestError, isPt));
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* LADO ESQUERDO: Painel Hero com Imagem (/iamgem1.jpeg) e Texto Simples — Preto e Branco */}
      <div style={{
        flex: 1,
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.8) 60%, #000000 100%), url('/iamgem1.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }} className="auth-hero-panel">

        {/* Texto Simples do Painel */}
        <div style={{ zIndex: 2, maxWidth: '480px' }}>

          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: 16,
            textShadow: '0 4px 16px rgba(0,0,0,0.9)'
          }}>
            {isPt
              ? "Entenda a sua mente com inteligência responsável"
              : "Understand your mind with responsible intelligence"}
          </h2>

        </div>
      </div>

      {/* LADO DIREITO: Formulário de Login (Preto e Branco) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 50px',
        backgroundColor: '#050505',
        boxSizing: 'border-box'
      }} className="auth-form-panel">

        {/* Topo do Formulário com Botão Circular para Voltar + Dropdown de Idioma da Imagem */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {!isLoggedIn && (
              <Link
                href={`/${locale}`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                title={isPt ? "Voltar à página inicial" : "Back to landing page"}
              >
                <ArrowLeft size={18} color="#ffffff" />
              </Link>
            )}

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {isPt ? 'Iniciar Sessão' : 'Sign in'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: 2 }}>
                {isPt ? 'Acede à tua conta NOVA' : 'Sign in to your NOVA account'}
              </div>
            </div>
          </div>

          {/* Dropdown Flutuante de Idioma (Estilo Card Branco da Imagem) */}
          <LanguageDropdown />
        </div>

        {/* Formulário Centralizado */}
        <div style={{ maxWidth: '400px', width: '100%', margin: 'auto' }}>

          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '12px',
              marginBottom: 20,
              fontSize: '0.82rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Campo Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                Email <span style={{ color: '#ffffff' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isPt ? "exemplo@email.com" : "you@example.com"}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Campo Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <label htmlFor="password" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {isPt ? 'Palavra-passe' : 'Password'} <span style={{ color: '#ffffff' }}>*</span>
                </label>
                <Link href={`/${locale}/auth/forgot-password`} style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                  {isPt ? 'Esqueceu a palavra-passe?' : 'Forgot password?'}
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    paddingRight: '50px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Botão Principal Branco com Texto Preto */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginTop: 8,
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? (isPt ? 'A carregar...' : 'Signing in...') : (isPt ? 'Seguinte' : 'Sign in')}
            </button>
          </form>

          {/* Link para Registar */}
          <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 24 }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {isPt ? 'Ainda não tem conta? ' : "Don't have an account? "}
            </span>
            <Link href={`/${locale}/auth/register`} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>
              {isPt ? 'Criar conta' : 'Create account'}
            </Link>
          </div>
        </div>

        {/* Rodapé Direito (Único Copyright) */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)', marginTop: 20 }}>
          © 2026 NOVA psychology Inc.
        </div>
      </div>

      {/* Media Query Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .auth-hero-panel {
            display: none !important;
          }
          .auth-form-panel {
            padding: 30px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
