'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Check, Clock3, Mail, RefreshCw, TriangleAlert } from 'lucide-react';
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
    ? (isPt ? 'A tua conta está pronta. Já podes iniciar sessão com segurança.' : 'Your account is ready. You can now sign in securely.')
    : state === 'error'
      ? (isPt ? 'Este link já não é válido. Solicita um novo email de confirmação.' : 'This link is no longer valid. Request a new confirmation email.')
      : state === 'waiting'
        ? (isPt ? `Enviámos um link de confirmação para ${email || 'o teu email'}.` : `We sent a confirmation link to ${email || 'your email'}.`)
        : (isPt ? 'Estamos a validar o teu email.' : 'We are verifying your email.');

  const statusIcon = state === 'success'
    ? <Check size={28} strokeWidth={2.5} />
    : state === 'error'
      ? <TriangleAlert size={28} />
      : state === 'waiting'
        ? <Mail size={28} />
        : <Clock3 size={28} />;

  const eyebrow = state === 'success'
    ? (isPt ? 'Conta verificada' : 'Account verified')
    : state === 'error'
      ? (isPt ? 'Confirmação interrompida' : 'Confirmation interrupted')
      : state === 'waiting'
        ? (isPt ? 'Um último passo' : 'One final step')
        : (isPt ? 'Só um momento' : 'One moment');

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px 20px', background: 'linear-gradient(135deg, #050608 0%, #111318 100%)', color: '#fff' }}>
      <section style={{ width: 'min(100%, 480px)', textAlign: 'center', padding: '32px clamp(24px, 7vw, 56px) 40px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, background: 'rgba(255,255,255,0.055)', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <Image src="/icons/nova-icon-192.svg" alt="NOVA Psychology" width={56} height={56} style={{ margin: '0 auto 24px' }} priority />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: state === 'error' ? '#ffb4ab' : '#00d2b5', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {statusIcon}
          <span>{eyebrow}</span>
        </div>
        <h1 style={{ margin: '20px 0 12px', fontSize: 'clamp(1.7rem, 5vw, 2.15rem)', lineHeight: 1.15, letterSpacing: 0 }}>{title}</h1>
        <p style={{ margin: '0 auto 28px', maxWidth: 340, color: 'rgba(255,255,255,0.68)', lineHeight: 1.65 }}>{description}</p>
        {state === 'waiting' && (
          <div style={{ margin: '0 auto 28px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.52)', fontSize: '0.82rem', lineHeight: 1.55 }}>
            {isPt ? 'Verifica também a pasta de spam ou lixo eletrónico.' : 'Also check your spam or junk folder.'}
          </div>
        )}
        {(state === 'success' || state === 'error') && (
          <Link href={`/${locale}/auth/login`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 48, padding: '0 20px', borderRadius: 6, background: '#00d2b5', color: '#061018', fontWeight: 700, textDecoration: 'none' }}>
            {state === 'error' ? (isPt ? 'Voltar ao início de sessão' : 'Back to sign in') : (isPt ? 'Iniciar sessão' : 'Sign in')}
            {state === 'error' ? <RefreshCw size={17} /> : <ArrowRight size={17} />}
          </Link>
        )}
        <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.38)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>NOVA PSYCHOLOGY</div>
      </section>
    </main>
  );
}
