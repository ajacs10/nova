'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Languages, Check } from 'lucide-react';

interface LanguageDropdownProps {
  buttonStyle?: React.CSSProperties;
  inline?: boolean;
}

export function LanguageDropdown({ buttonStyle, inline = false }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = (params?.locale as string) || 'en';

  const languages = [
    { code: 'pt', name: 'Português', codeLabel: 'PT', flag: '🇵🇹' },
    { code: 'en', name: 'English', codeLabel: 'GB', flag: '🇬🇧' },
  ];

  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setIsOpen(false);
    if (code === currentLocale) return;

    let newPath = '';
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${code}`);
    } else {
      newPath = `/${code}${pathname === '/' ? '' : pathname}`;
    }

    router.push(newPath);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {!inline && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '100px',
            padding: '7px 10px',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            outline: 'none',
            boxShadow: 'none',
            ...buttonStyle,
          }}
        >
          <Languages size={15} color="#ffffff" style={{ opacity: 0.9 }} />
          <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>{currentLang.flag}</span>
          <span style={{ fontSize: '0.7rem', lineHeight: 1, fontWeight: 800, letterSpacing: '0.04em' }}>{currentLang.codeLabel}</span>
        </button>
      )}

      {/* Menu Flutuante Estilo Card Branco (exatamente como na imagem de referência) */}
      {(isOpen || inline) && (
        <div
          style={{
            position: inline ? 'static' : 'absolute',
            top: inline ? undefined : 'calc(100% + 10px)',
            right: inline ? undefined : 0,
            width: inline ? 'auto' : '190px',
            backgroundColor: inline ? 'rgba(255,255,255,0.04)' : '#ffffff',
            borderRadius: inline ? '100px' : '18px',
            padding: inline ? '4px' : '8px',
            boxShadow: inline ? 'none' : '0 12px 35px rgba(0, 0, 0, 0.35)',
            zIndex: inline ? undefined : 99999,
            display: 'flex',
            flexDirection: inline ? 'row' : 'column',
            gap: inline ? 4 : 4,
            animation: inline ? undefined : 'dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          {languages.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: inline ? '9px 14px' : '10px 14px',
                  borderRadius: inline ? '100px' : '14px',
                  backgroundColor: inline ? (isSelected ? '#ffffff' : 'transparent') : (isSelected ? '#f1f5f9' : 'transparent'),
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: inline ? (isSelected ? '#060810' : 'rgba(255,255,255,0.6)') : undefined,
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = inline ? 'rgba(255,255,255,0.08)' : '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = inline ? 'transparent' : 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>{lang.flag}</span>
                  <span style={{ minWidth: 24, fontSize: '0.68rem', lineHeight: 1, fontWeight: 800, letterSpacing: '0.04em' }}>{lang.codeLabel}</span>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: inline ? (isSelected ? '#060810' : 'rgba(255,255,255,0.6)') : (isSelected ? '#0f172a' : '#334155'),
                    }}
                  >
                    {lang.name}
                  </span>
                </div>

                {isSelected && (
                  <Check size={16} color="#0d9488" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
