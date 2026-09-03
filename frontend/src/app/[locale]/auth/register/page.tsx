'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { LanguageDropdown } from '@/shared/ui/LanguageDropdown';
import { useAuth } from '@/shared/lib/AuthContext';
import { getUserFriendlyError, register } from '@/shared/lib/api';

const COUNTRY_PREFIXES = [
  { code: '+244', country: 'AO', name: 'Angola (+244)' },
  { code: '+351', country: 'PT', name: 'Portugal (+351)' },
  { code: '+258', country: 'MZ', name: 'Moçambique (+258)' },
  { code: '+238', country: 'CV', name: 'Cabo Verde (+238)' },
  { code: '+245', country: 'GW', name: 'Guiné-Bissau (+245)' },
  { code: '+239', country: 'ST', name: 'São Tomé e Príncipe (+239)' },
  { code: '+55', country: 'BR', name: 'Brasil (+55)' },
  { code: '+1', country: 'US', name: 'EUA / Canadá (+1)' },
  { code: '+44', country: 'GB', name: 'Reino Unido (+44)' },
  { code: '+34', country: 'ES', name: 'Espanha (+34)' },
  { code: '+33', country: 'FR', name: 'França (+33)' },
  { code: '+49', country: 'DE', name: 'Alemanha (+49)' },
  { code: '+39', country: 'IT', name: 'Itália (+39)' },
  { code: '+41', country: 'CH', name: 'Suíça (+41)' },
];

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';
  const { isLoggedIn, isReady } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+244');
  const [phoneNum, setPhoneNum] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (isReady && isLoggedIn) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  if (isReady && isLoggedIn) return null;

  // Formatação automática do número de telefone com traços
  const formatPhoneNumber = (raw: string, country: string): string => {
    const digits = raw.replace(/\D/g, '');
    if (country === '+244') {
      const limited = digits.slice(0, 9);
      if (limited.length <= 3) return limited;
      if (limited.length <= 6) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6, 9)}`;
    }

    const limited = digits.slice(0, 14);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    if (limited.length <= 9) return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6, 9)}-${limited.slice(9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, countryCode);
    setPhoneNum(formatted);
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validateField('phone', formatted, countryCode) }));
    }
  };

  // Validação de Segurança Rigorosa (Security Policy Document)
  const validateField = (fieldName: string, val: string, currentCountry: string = countryCode): string => {
    switch (fieldName) {
      case 'firstName':
        if (!val.trim()) return isPt ? 'Primeiro nome é obrigatório' : 'First name is required';
        if (val.trim().length < 2) return isPt ? 'Mínimo de 2 caracteres' : 'Minimum 2 characters required';
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(val.trim())) return isPt ? 'Apenas letras e hífenes permitidos' : 'Only letters and hyphens allowed';
        return '';

      case 'lastName':
        if (!val.trim()) return isPt ? 'Apelido é obrigatório' : 'Last name is required';
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(val.trim())) {
          return isPt ? 'Apenas letras e hífenes permitidos' : 'Only letters and hyphens allowed';
        }
        return '';

      case 'email':
        if (!val.trim()) return isPt ? 'Email é obrigatório' : 'Email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())) {
          return isPt ? 'Formato de email inválido (ex: utilizador@dominio.com)' : 'Invalid email format (e.g. user@domain.com)';
        }
        return '';

      case 'phone': {
        if (!val.trim()) return '';
        const digits = val.replace(/\D/g, '');

        if (currentCountry === '+244') {
          if (!digits.startsWith('9')) {
            return isPt
              ? 'Número de Angola (+244) deve começar por 9 (ex: 9XX-XXX-XXX).'
              : 'Angola phone number (+244) must start with 9 (e.g. 9XX-XXX-XXX).';
          }
          if (digits.length !== 9) {
            return isPt
              ? 'Número de Angola (+244) deve conter exatamente 9 dígitos.'
              : 'Angola phone number (+244) must have exactly 9 digits.';
          }

          const blockedAngolaSamples = [
            '123456789', '111111111', '222222222', '333333333', '444444444', '555555555',
            '666666666', '777777777', '888888888', '999999999', '000000000', '987654321'
          ];

          if (blockedAngolaSamples.includes(digits)) {
            return isPt
              ? 'Número de teste inválido. Introduza um contacto real.'
              : 'Invalid sample number. Please enter a real contact number.';
          }
        } else {
          if (digits.length < 6 || digits.length > 14) {
            return isPt
              ? 'Número de telefone inválido para o país selecionado.'
              : 'Invalid phone number for the selected country prefix.';
          }

          const repeatedDigits = /^(\d)\1{5,}$/;
          if (repeatedDigits.test(digits)) {
            return isPt
              ? 'Número inválido. Não são permitidos valores repetidos ou fictícios.'
              : 'Invalid number. Repeated or fake values are not allowed.';
          }
        }
        return '';
      }

      case 'password':
        if (!val) return isPt ? 'Palavra-passe é obrigatória' : 'Password is required';
        if (val.length < 8) return isPt ? 'Mínimo de 8 caracteres' : 'Must be at least 8 characters';
        if (!/[A-Z]/.test(val)) return isPt ? 'Inclua pelo menos uma letra maiúscula (A-Z)' : 'Include at least one uppercase letter (A-Z)';
        if (!/[a-z]/.test(val)) return isPt ? 'Inclua pelo menos uma letra minúscula (a-z)' : 'Include at least one lowercase letter (a-z)';
        if (!/[0-9]/.test(val)) return isPt ? 'Inclua pelo menos um número (0-9)' : 'Include at least one number (0-9)';
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(val)) return isPt ? 'Inclua pelo menos um caractere especial (!@#$%...)' : 'Include at least one special character (!@#$%...)';
        return '';

      case 'confirmPassword':
        if (!val) return isPt ? 'Confirmação obrigatória' : 'Confirm password is required';
        if (val !== password) return isPt ? 'As palavras-passe não coincidem' : 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      phone: validateField('phone', phoneNum, countryCode),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!acceptedTerms) {
      newErrors.terms = isPt ? 'Aceita os termos da plataforma para criar a conta.' : 'Accept the platform terms to create your account.';
    }
    return !Object.values(newErrors).some((err) => err !== '');
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    let val = '';
    if (fieldName === 'firstName') val = firstName;
    if (fieldName === 'lastName') val = lastName;
    if (fieldName === 'email') val = email;
    if (fieldName === 'phone') val = phoneNum;
    if (fieldName === 'password') val = password;
    if (fieldName === 'confirmPassword') val = confirmPassword;

    const errorMsg = validateField(fieldName, val, countryCode);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      await register(fullName, email, password, `${countryCode}${phoneNum.replace(/\D/g, '')}`, acceptedTerms);
      setIsLoading(false);
      router.push(`/${locale}/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (requestError) {
      setIsLoading(false);
      setErrors((previous) => ({
        ...previous,
        form: getUserFriendlyError(requestError, isPt),
      }));
    }
  };

  return (
    <div className="register-shell" style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative'
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
        zIndex: 1,
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }} className="auth-hero-panel auth-hero-panel-mobile">

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

      {/* LADO DIREITO: Formulário de Registo (Preto e Branco) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 50px',
        backgroundColor: '#050505',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto'
      }} className="auth-form-panel auth-form-panel-mobile">

        {/* Topo do Formulário com Botão Circular para Voltar + Dropdown de Idioma da Imagem */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {isPt ? 'Registar Conta' : 'Register Account'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: 2 }}>
                {isPt ? 'Crie a sua conta de utilizador NOVA' : 'Create your NOVA user account'}
              </div>
            </div>
          </div>

          {/* Dropdown Flutuante de Idioma (Estilo Card Branco da Imagem) */}
          <LanguageDropdown />
        </div>

        {/* Formulário Centralizado em Preto e Branco */}
        <div style={{ maxWidth: '440px', width: '100%', margin: 'auto', position: 'relative', zIndex: 3 }}>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Grelha 2 colunas para Primeiro e Último Nome */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {isPt ? 'Primeiro nome' : 'First name'} <span style={{ color: '#ffffff' }}>*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (touched.firstName) setErrors((prev) => ({ ...prev, firstName: validateField('firstName', e.target.value) }));
                  }}
                  onBlur={() => handleBlur('firstName')}
                  placeholder={isPt ? "Ex. João" : "John"}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: touched.firstName && errors.firstName ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {touched.firstName && errors.firstName && (
                  <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {isPt ? 'Último nome' : 'Last name'} <span style={{ color: '#ffffff' }}>*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (touched.lastName) setErrors((prev) => ({ ...prev, lastName: validateField('lastName', e.target.value) }));
                  }}
                  onBlur={() => handleBlur('lastName')}
                  placeholder={isPt ? "Ex. Silva" : "Doe"}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: touched.lastName && errors.lastName ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {touched.lastName && errors.lastName && (
                  <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                Email <span style={{ color: '#ffffff' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) setErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
                }}
                onBlur={() => handleBlur('email')}
                placeholder="exemplo@email.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: touched.email && errors.email ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
              {touched.email && errors.email && (
                <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Telefone Internacional com Formatação Automática e Validação de Angola (+244 a começar com 9) */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                {isPt ? 'Telefone' : 'Phone'} <span style={{ color: '#ffffff' }}>*</span>
              </label>

              <div className="register-phone-row" style={{ display: 'flex', gap: 6 }}>
                {/* Dropdown do Prefixo do País */}
                <select
                  className="register-phone-select"
                  value={countryCode}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setCountryCode(newCode);
                    if (touched.phone) {
                      setErrors((prev) => ({ ...prev, phone: validateField('phone', phoneNum, newCode) }));
                    }
                  }}
                  style={{
                    width: '105px',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {COUNTRY_PREFIXES.map((item) => (
                    <option key={item.code + item.country} value={item.code} style={{ background: '#111111', color: '#ffffff' }}>
                      {item.country} {item.code}
                    </option>
                  ))}
                </select>

                {/* Campo do Número de Telefone Formatado com Traços Ex: 9XX-XXX-XXX */}
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder={countryCode === '+244' ? '923-456-789' : '912-345-678'}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: touched.phone && errors.phone ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {touched.phone && errors.phone && (
                <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Password e Confirmar Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {isPt ? 'Palavra-passe' : 'Password'} <span style={{ color: '#ffffff' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) setErrors((prev) => ({ ...prev, password: validateField('password', e.target.value) }));
                      if (touched.confirmPassword && confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: e.target.value !== confirmPassword ? (isPt ? 'As palavras-passe não coincidem' : 'Passwords do not match') : '' }));
                      }
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      paddingRight: '40px',
                      borderRadius: '12px',
                      border: touched.password && errors.password ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontSize: '0.88rem',
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
                      right: '10px',
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
                {touched.password && errors.password && (
                  <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                    {errors.password}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {isPt ? 'Confirmar' : 'Confirm'} <span style={{ color: '#ffffff' }}>*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', e.target.value) }));
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: touched.confirmPassword && errors.confirmPassword ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Requisitos de Segurança da Password */}
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.35)', marginTop: -4 }}>
              {isPt
                ? 'Mínimo 8 caracteres (maiúscula, minúscula, número e símbolo).'
                : 'Min 8 chars with uppercase, lowercase, digit & special symbol.'}
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, color: 'rgba(255,255,255,0.72)', fontSize: '0.78rem', lineHeight: 1.5, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked);
                  if (event.target.checked) setErrors((previous) => ({ ...previous, terms: '' }));
                }}
                style={{ marginTop: 3, accentColor: '#00d2b5' }}
              />
              <span>
                {isPt ? 'Li e aceito os ' : 'I have read and accept the '}
                <Link href={`/${locale}/terms`} target="_blank" style={{ color: '#00d2b5', textDecoration: 'underline' }}>
                  {isPt ? 'Termos da plataforma' : 'Platform Terms'}
                </Link>.
              </span>
            </label>
            {errors.terms && <span style={{ color: '#f87171', fontSize: '0.72rem', display: 'block', marginTop: 5 }}>{errors.terms}</span>}

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
              {isLoading ? (isPt ? 'A criar conta...' : 'Creating account...') : (isPt ? 'Seguinte' : 'Next')}
            </button>
          </form>

          {/* Link para Iniciar Sessão */}
          <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 24 }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {isPt ? 'Já tem conta? ' : 'Already have an account? '}
            </span>
            <Link href={`/${locale}/auth/login`} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>
              {isPt ? 'Entrar' : 'Sign in'}
            </Link>
          </div>
        </div>

        {/* Rodapé Direito (Único Copyright) */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)', marginTop: 20, position: 'relative', zIndex: 3 }}>
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
