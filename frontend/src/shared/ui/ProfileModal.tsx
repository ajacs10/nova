'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { X, Mail, Phone, Calendar, Save } from 'lucide-react';
import { useAuth } from '@/shared/lib/AuthContext';
import { getUserFriendlyError } from '@/shared/lib/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (!isOpen || !user) return;
    queueMicrotask(() => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? '');
    });
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: '#0c0e18',
          border: 'none',
          borderRadius: '24px 0 0 24px',
          padding: '32px 28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
          animation: 'sidebarIn 0.25s ease-out',
          color: '#ffffff',
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {isPt ? 'Perfil do Utilizador' : 'User Profile'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Card do Avatar & Nome */}
        <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px 0' }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(0, 210, 181, 0.2)',
            overflow: 'hidden'
          }}>
            <Image src="/mascotes/mascote_equilibrado_v2.svg" alt="Avatar NOVA" width={88} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: '#ffffff' }}>
            {user?.name || 'Utilizador NOVA'}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}>
            {isPt ? 'Membro da Comunidade NOVA' : 'NOVA Community Member'}
          </span>
        </div>

        {/* Detalhes de Contacto */}
        <form onSubmit={async (event) => {
          event.preventDefault();
          setIsSaving(true);
          setSaveError(null);
          setSaved(false);
          try {
            await updateUser({ name, email, phone: phone || undefined });
            setSaved(true);
          } catch (error) {
            setSaveError(getUserFriendlyError(error, isPt));
          } finally {
            setIsSaving(false);
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
            <Mail size={16} color="rgba(255,255,255,0.6)" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>Email</div>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required style={{ display: 'block', marginTop: 4, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }} />
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
            <Phone size={16} color="rgba(255,255,255,0.6)" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>{isPt ? 'Telefone' : 'Phone'}</div>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="Não informado" style={{ display: 'block', marginTop: 4, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }} />
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
            <Calendar size={16} color="rgba(255,255,255,0.6)" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>Nome completo</div>
              <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} style={{ display: 'block', marginTop: 4, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }} />
            </div>
          </label>
          <div style={{ fontSize: '0.75rem', color: saveError ? '#fca5a5' : '#00d2b5', minHeight: 18 }}>
            {saveError || (saved ? (isPt ? 'Perfil atualizado.' : 'Profile updated.') : '')}
          </div>
          <button type="submit" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', backgroundColor: '#00d2b5', color: '#060810', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: isSaving ? 'wait' : 'pointer' }}>
            <Save size={16} />
            {isSaving ? (isPt ? 'A guardar...' : 'Saving...') : (isPt ? 'Guardar alterações' : 'Save changes')}
          </button>
        </form>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginTop: 24,
            cursor: 'pointer'
          }}
        >
          {isPt ? 'Fechar' : 'Close'}
        </button>
      </div>

      <style>{`
        @keyframes sidebarIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
