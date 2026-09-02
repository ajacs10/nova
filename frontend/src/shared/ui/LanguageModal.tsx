'use client';

import React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe, X, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = (params?.locale as string) || 'en';
  const isPt = currentLocale === 'pt';

  if (!isOpen) return null;

  const handleSelectLanguage = (newLocale: string) => {
    onClose();
    if (newLocale === currentLocale) return;

    let newPath = '';
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`;
    }

    router.push(newPath);
  };

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
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Container do Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0c0e18',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
          animation: 'fadeInScale 0.25s ease-out',
          color: '#ffffff',
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {/* Cabeçalho do Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <Globe size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {isPt ? 'Selecionar Idioma' : 'Select Language'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                {isPt ? 'Escolha o idioma de preferência' : 'Choose your preferred language'}
              </span>
            </div>
          </div>

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

        {/* Opções de Idioma */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Opção Português */}
          <button
            onClick={() => handleSelectLanguage('pt')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: currentLocale === 'pt' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: currentLocale === 'pt' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span aria-hidden="true" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇵🇹</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>PT</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Português</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Portugal / Angola / Brasil</div>
              </div>
            </div>
            {currentLocale === 'pt' && (
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </button>

          {/* Opção Inglês */}
          <button
            onClick={() => handleSelectLanguage('en')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: currentLocale === 'en' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: currentLocale === 'en' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span aria-hidden="true" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇬🇧</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>GB</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>English</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>International / US / UK</div>
              </div>
            </div>
            {currentLocale === 'en' && (
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
