'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ApiError, verifyEmail } from '@/shared/lib/api';

export default function VerifyEmailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'pt';
  const isPt = locale === 'pt';
  const [state, setState] = useState<'loading' | 'success' | 'error' | 'waiting'>(() => {
    if (typeof window === 'undefined') return 'loading';
    return new URLSearchParams(window.location.search).get('token') ? 'loading' : 'waiting';
  });
  const [email] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('email') || '';
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    if (!token) {
      return;
    }

    verifyEmail(token)
      .then(() => setState('success'))
      .catch((error: unknown) => {
        if (error instanceof ApiError) setState('error');
        else setState('error');
      });
  }, []);

  const title = state === 'success'
    ? (isPt ? 'Email confirmado' : 'Email verified')
    : state === 'error'
      ? (isPt ? 'Link inválido ou expirado' : 'Invalid or expired link')
      : (isPt ? 'Confirma o teu email' : 'Confirm your email');

  const description = state === 'success'
    ? (isPt ? 'A tua conta está pronta. Já podes iniciar sessão.' : 'Your account is ready. You can now sign in.')
    : state === 'error'
      ? (isPt ? 'Solicita um novo email de confirmação.' : 'Request a new confirmation email.')
      : state === 'waiting'
        ? (isPt ? `Enviámos um link de confirmação para ${email || 'o teu email'}.` : `We sent a confirmation link to ${email || 'your email'}.`)
        : (isPt ? 'Estamos a validar o teu email.' : 'We are verifying your email.');

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#060810', color: '#fff' }}>
      <section style={{ width: 'min(100%, 460px)', textAlign: 'center', padding: 40, border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 20 }} aria-hidden="true">
          {state === 'success' ? '✓' : state === 'error' ? '!' : '✉'}
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: '1.7rem' }}>{title}</h1>
        <p style={{ margin: '0 0 28px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.6 }}>{description}</p>
        {(state === 'success' || state === 'error') && (
          <Link href={`/${locale}/auth/login`} style={{ display: 'inline-block', padding: '12px 20px', borderRadius: 10, background: '#00d2b5', color: '#061018', fontWeight: 700, textDecoration: 'none' }}>
            {isPt ? 'Ir para iniciar sessão' : 'Go to sign in'}
          </Link>
        )}
      </section>
    </main>
  );
}
