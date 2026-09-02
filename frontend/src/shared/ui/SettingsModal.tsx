'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { X, Globe, Bell, Shield } from 'lucide-react';
import { LanguageDropdown } from './LanguageDropdown';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';

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
          width: 'min(480px, 100%)',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 16 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {isPt ? 'Configurações' : 'Settings'}
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

        {/* Conteúdo das Configurações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Seção Idioma da Aplicação (Onde a tradução para utilizador logado fica!) */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Globe size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                  {isPt ? 'Idioma da Aplicação' : 'App Language'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {isPt ? 'Selecione o seu idioma de preferência' : 'Select your preferred language'}
                </div>
              </div>
            </div>

            {/* Dropdown de Idioma integrado nas Configurações! */}
            <LanguageDropdown />
          </div>

          {/* Seção Notificações */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bell size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                  {isPt ? 'Lembrete de Check-in' : 'Check-in Reminder'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {isPt ? 'Notificação diária às 09:00' : 'Daily reminder at 09:00 AM'}
                </div>
              </div>
            </div>

            <input type="checkbox" defaultChecked style={{ accentColor: '#ffffff', width: 18, height: 18, cursor: 'pointer' }} />
          </div>

          {/* Seção Privacidade */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                  {isPt ? 'Privacidade de Dados' : 'Data Privacy'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {isPt ? 'Encriptação total e anonimização' : 'Full encryption and anonymization'}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
              {isPt ? 'Ativo' : 'Active'}
            </span>
          </div>

        </div>

        {/* Botão Concluído */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.92rem',
            marginTop: 24,
            cursor: 'pointer'
          }}
        >
          {isPt ? 'Guardar & Fechar' : 'Save & Close'}
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
