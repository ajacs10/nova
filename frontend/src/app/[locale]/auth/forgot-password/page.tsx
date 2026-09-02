'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { LanguageDropdown } from '@/shared/ui/LanguageDropdown';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      setError(isPt ? 'Por favor insira um email válido.' : 'Please enter a valid email address.');
      return;
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setError(isPt
      ? 'A recuperação automática ainda não está disponível. Contacta info@novapsychology.ao.'
      : 'Automatic password recovery is not available yet. Contact info@novapsychology.ao.');
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
          <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#000000'
            }}>
              N
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                NOVA psychology
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>
                Mental Wellness AI
              </div>
            </div>
          </div>

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
              ? "Recuperação segura de acesso à sua conta"
              : "Secure recovery of your account access"}
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.6,
            fontWeight: 400,
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)'
          }}>
            {isPt
              ? "Enviaremos instruções seguras para reposição de palavra-passe diretamente para o seu correio eletrónico."
              : "We will send secure password reset instructions directly to your email address."}
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Formulário de Recuperação de Palavra-passe (Preto e Branco) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 50px',
        backgroundColor: '#050505',
        boxSizing: 'border-box'
      }} className="auth-form-panel">

        {/* Topo do Formulário com Botão Circular para Voltar ao Login + Seletor de Idioma */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link
              href={`/${locale}/auth/login`}
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
              title={isPt ? "Voltar ao login" : "Back to login"}
            >
              <ArrowLeft size={18} color="#ffffff" />
            </Link>

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {isPt ? 'Recuperar Palavra-passe' : 'Reset Password'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: 2 }}>
                {isPt ? 'Instruções de reposição de acesso' : 'Access recovery instructions'}
              </div>
            </div>
          </div>

          {/* Dropdown Flutuante de Idioma (Estilo Card Branco da Imagem) */}
          <LanguageDropdown />
        </div>

        {/* Formulário Centralizado */}
        <div style={{ maxWidth: '400px', width: '100%', margin: 'auto' }}>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <CheckCircle size={32} color="#ffffff" />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>
                {isPt ? 'Recuperação indisponível' : 'Recovery unavailable'}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: 28 }}>
                {isPt
                  ? 'Contacta o suporte para obter ajuda com o acesso à tua conta.'
                  : 'Contact support for help accessing your account.'}
              </p>

              <Link
                href={`/${locale}/auth/login`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {isPt ? 'Voltar ao Login' : 'Back to Sign in'}
              </Link>
            </div>
          ) : (
            <>
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
                  {isLoading ? (isPt ? 'A enviar...' : 'Sending link...') : (isPt ? 'Enviar Link de Recuperação' : 'Send Reset Link')}
                </button>
              </form>

              <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 24 }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  {isPt ? 'Lembrou-se da palavra-passe? ' : 'Remembered your password? '}
                </span>
                <Link href={`/${locale}/auth/login`} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>
                  {isPt ? 'Entrar' : 'Sign in'}
                </Link>
              </div>
            </>
          )}
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
