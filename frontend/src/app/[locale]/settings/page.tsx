"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Bell, Eye, EyeOff, Globe, Laptop, Moon, Pencil, Save, Shield, Sliders, Sun, User } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { changePassword, getUserFriendlyError, uploadAvatar } from "@/shared/lib/api";
import { useAuth } from "@/shared/lib/AuthContext";
import { LanguageDropdown } from "@/shared/ui/LanguageDropdown";

type TabType = "profile" | "security" | "system";

export default function SettingsPage() {
  const params = useParams();
  const isPt = ((params?.locale as string) || "pt") === "pt";
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("/mascotes/mascote_equilibrado_v2.svg");
  const [avatarMessage, setAvatarMessage] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Password state
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({ current: false, new: false, confirm: false });

  // System state
  const [reminders, setReminders] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");

  useEffect(() => {
    if (!user) return;
    const frame = window.requestAnimationFrame(() => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
      setDisplayName(window.localStorage.getItem(`nova-display-name-${user.id}`) || user.name);
      setAvatarSrc(user.avatarData || window.localStorage.getItem(`nova-avatar-${user.id}`) || "/mascotes/mascote_equilibrado_v2.svg");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [user]);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarMessage(isPt ? "Escolhe uma imagem JPEG, PNG ou WebP." : "Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarMessage(isPt ? "A imagem não pode exceder 2 MB." : "The image must not exceed 2 MB.");
      return;
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const jpegValid = file.type === "image/jpeg" && bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const pngValid = file.type === "image/png" && bytes.length >= 8 && pngSignature.every((byte, index) => bytes[index] === byte);
    const decoder = new TextDecoder();
    const webpValid = file.type === "image/webp" && bytes.length >= 12 && decoder.decode(bytes.slice(0, 4)) === "RIFF" && decoder.decode(bytes.slice(8, 12)) === "WEBP";
    if (!jpegValid && !pngValid && !webpValid) {
      setAvatarMessage(isPt ? "O conteúdo não corresponde ao formato da imagem." : "The file content does not match its image format.");
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid image"));
        reader.onerror = () => reject(new Error("Unable to read image"));
        reader.readAsDataURL(file);
      });
      const result = await uploadAvatar(dataUrl, file.type);
      setAvatarSrc(result.avatarData);
      window.localStorage.removeItem(`nova-avatar-${user.id}`);
      window.dispatchEvent(new CustomEvent("nova-avatar-changed", { detail: result.avatarData }));
      setAvatarMessage(isPt ? "Foto atualizada." : "Profile photo updated.");
    } catch (error) {
      setAvatarMessage(getUserFriendlyError(error, isPt));
    }
  }

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("nova-theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      const frame = window.requestAnimationFrame(() => {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme === "system"
          ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
          : savedTheme;
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  function handleThemeChange(nextTheme: "light" | "dark" | "system") {
    setTheme(nextTheme);
    window.localStorage.setItem("nova-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : nextTheme;
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateUser({ name, email, phone: phone || undefined });
      window.localStorage.setItem(`nova-display-name-${user?.id}`, displayName.trim() || name.trim());
      window.dispatchEvent(new Event("nova-display-name-changed"));
      setMessage(isPt ? "Perfil atualizado." : "Profile updated.");
      setIsEditingProfile(false);
    } catch (error) {
      setMessage(getUserFriendlyError(error));
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordMessage("");
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage(isPt ? "Palavra-passe atualizada." : "Password updated.");
    } catch (error) {
      setPasswordMessage(getUserFriendlyError(error, isPt));
    } finally {
      setSavingPassword(false);
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  return (
    <PrivateShell>
      <section className="settings-page">
        <header className="page-heading">
          <h1>{isPt ? "Configurações de Conta" : "Account Settings"}</h1>
        </header>

        <div className="settings-container">
          {/* Menu Lateral Estilo Tabs */}
          <aside className="settings-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>{isPt ? "Meu Perfil" : "My Profile"}</span>
            </button>

            <button
              className={`nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} />
              <span>{isPt ? "Segurança" : "Security"}</span>
            </button>

            <button
              className={`nav-item ${activeTab === "system" ? "active" : ""}`}
              onClick={() => setActiveTab("system")}
            >
              <Sliders size={18} />
              <span>{isPt ? "Sistema" : "System"}</span>
            </button>
          </aside>

          {/* Conteúdo Principal */}
          <main className="settings-content">
            {activeTab === "profile" && (
              <div className="tab-pane">
                <h2>{isPt ? "Meu Perfil" : "My Profile"}</h2>

                {/* Card de Avatar / Destaque */}
                <div className="content-card header-profile-card">
                  <button type="button" className="profile-avatar" onClick={() => avatarInputRef.current?.click()} aria-label={isPt ? "Alterar foto de perfil" : "Change profile photo"} title={isPt ? "Alterar foto de perfil" : "Change profile photo"}>
                    <Image src={avatarSrc} alt={isPt ? "Foto de perfil" : "Profile photo"} width={68} height={68} unoptimized />
                    <span className="avatar-upload-hint">{isPt ? "Alterar" : "Change"}</span>
                  </button>
                  <input ref={avatarInputRef} className="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} />
                  <div className="profile-info">
                    <h3>{displayName || name || "Utilizador"}</h3>
                    <p>{email}</p>
                    <span className="location-tag">NOVA Psychology</span>
                  </div>
                  <button
                    type="button"
                    className="edit-pill-btn"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? (isPt ? "Cancelar" : "Cancel") : (isPt ? "Editar" : "Edit")} <Pencil size={14} />
                  </button>
                  {avatarMessage && <span className="avatar-message" role="status">{avatarMessage}</span>}
                </div>

                {/* Card de Informação Pessoal */}
                <form onSubmit={handleProfileSubmit} className="content-card">
                  <div className="card-top">
                    <h4>{isPt ? "Informação Pessoal" : "Personal Information"}</h4>
                  </div>

                  <div className="form-grid">
                    <label>
                      <span className="label-text">{isPt ? "Nome Completo" : "Full Name"}</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        readOnly={!isEditingProfile}
                      />
                    </label>

                    <label>
                      <span className="label-text">{isPt ? "Nome a Exibir" : "Display Name"}</span>
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        readOnly={!isEditingProfile}
                      />
                    </label>

                    <label>
                      <span className="label-text">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        readOnly={!isEditingProfile}
                      />
                    </label>

                    <label>
                      <span className="label-text">{isPt ? "Telefone" : "Phone"}</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isPt ? "Opcional" : "Optional"}
                        readOnly={!isEditingProfile}
                      />
                    </label>
                  </div>

                  {isEditingProfile && (
                    <div className="form-footer">
                      <span role="status">{message}</span>
                      <button type="submit" disabled={saving} className="save-btn">
                        <Save size={16} />
                        {saving ? (isPt ? "A guardar..." : "Saving...") : (isPt ? "Guardar Alterações" : "Save Changes")}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="tab-pane">
                <h2>{isPt ? "Segurança" : "Security"}</h2>

                <form onSubmit={handlePasswordSubmit} className="content-card">
                  <div className="card-top">
                    <h4>{isPt ? "Alterar Palavra-passe" : "Change Password"}</h4>
                  </div>

                  <div className="form-stack">
                    {[
                      { key: "current", label: isPt ? "Palavra-passe Atual" : "Current Password", value: currentPassword, setter: setCurrentPassword },
                      { key: "new", label: isPt ? "Nova Palavra-passe" : "New Password", value: newPassword, setter: setNewPassword },
                      { key: "confirm", label: isPt ? "Confirmar Nova Palavra-passe" : "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
                    ].map((field) => {
                      const fieldKey = field.key as "current" | "new" | "confirm";
                      const isVisible = visiblePasswords[fieldKey];
                      return (
                        <label key={field.key}>
                          <span className="label-text">{field.label}</span>
                          <div className="input-with-icon">
                            <input
                              type={isVisible ? "text" : "password"}
                              value={field.value}
                              onChange={(e) => field.setter(e.target.value)}
                              required
                              minLength={8}
                            />
                            <button
                              type="button"
                              className="eye-btn"
                              onClick={() => togglePasswordVisibility(fieldKey)}
                            >
                              {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="form-footer">
                    <span role="status">{passwordMessage}</span>
                    <button type="submit" disabled={savingPassword} className="save-btn">
                      <Save size={16} />
                      {savingPassword ? (isPt ? "A guardar..." : "Saving...") : (isPt ? "Atualizar Palavra-passe" : "Update Password")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "system" && (
              <div className="tab-pane">
                <h2>{isPt ? "Sistema" : "System"}</h2>

                <div className="content-card">
                  <div className="card-top">
                    <h4>{isPt ? "Preferências Globais" : "Global Preferences"}</h4>
                  </div>

                  <div className="system-rows">
                    <div className="system-row">
                      <div className="row-info">
                        <Globe size={18} className="icon-cyan" />
                        <div>
                          <strong>{isPt ? "Idioma da aplicação" : "Application language"}</strong>
                          <p>{isPt ? "Escolhe o teu idioma de preferência." : "Select your preferred language."}</p>
                        </div>
                      </div>
                      <LanguageDropdown inline />
                    </div>

                    <div className="system-row">
                      <div className="row-info">
                        <Bell size={18} className="icon-cyan" />
                        <div>
                          <strong>{isPt ? "Lembretes diários" : "Daily reminders"}</strong>
                          <p>{isPt ? "Receber notificações de check-in." : "Receive check-in notifications."}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={reminders}
                        onChange={(e) => setReminders(e.target.checked)}
                        className="custom-checkbox"
                      />
                    </div>

                    <div className="system-row vertical">
                      <div className="row-info">
                        <Sliders size={18} className="icon-cyan" />
                        <div>
                          <strong>{isPt ? "Tema Visual" : "Visual Theme"}</strong>
                          <p>{isPt ? "Ajusta a aparência da plataforma." : "Adjust the platform appearance."}</p>
                        </div>
                      </div>

                      <div className="theme-toggle-group">
                        <button
                          type="button"
                          className={`theme-btn ${theme === "light" ? "selected" : ""}`}
                          onClick={() => handleThemeChange("light")}
                        >
                          <Sun size={15} /> {isPt ? "Claro" : "Light"}
                        </button>
                        <button
                          type="button"
                          className={`theme-btn ${theme === "dark" ? "selected" : ""}`}
                          onClick={() => handleThemeChange("dark")}
                        >
                          <Moon size={15} /> {isPt ? "Escuro" : "Dark"}
                        </button>
                        <button
                          type="button"
                          className={`theme-btn ${theme === "system" ? "selected" : ""}`}
                          onClick={() => handleThemeChange("system")}
                        >
                          <Laptop size={15} /> {isPt ? "Sistema" : "System"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      <style jsx>{`
        .settings-page { max-width: 1100px; margin: 0 auto; padding: 12px 20px 24px; }
        .page-heading h1 { color: #ffffff; font-size: 1.6rem; font-weight: 700; margin-bottom: 16px; }

        /* Contento Layout */
        .settings-container { display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: start; }

        /* Menu Lateral Estilo Tabs */
        .settings-nav { display: flex; flex-direction: column; gap: 4px; border-right: 1px solid rgba(255,255,255,.08); padding-right: 16px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: transparent; border: 0; color: rgba(255,255,255,.6); font-size: .9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; text-align: left; }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,.04); }
        .nav-item.active { background: rgba(0, 210, 181, 0.12); color: #00d2b5; }

        /* Conteúdo principal */
        .tab-pane h2 { font-size: 1.3rem; color: #fff; margin-bottom: 20px; font-weight: 600; }
        .content-card { background: #0a0e1a; border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 18px 20px; margin-bottom: 14px; position: relative; }

        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .card-top h4 { color: #fff; font-size: 1.05rem; font-weight: 600; margin: 0; }

        /* Cartão de Perfil do Topo */
        .header-profile-card { display: flex; align-items: center; gap: 20px; }
        .profile-avatar { position: relative; width: 68px; height: 68px; padding: 0; border-radius: 50%; overflow: hidden; background: #151c2e; border: 2px solid rgba(0,210,181,.4); flex-shrink: 0; cursor: pointer; }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-upload-hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.62); color: #fff; font-size: .68rem; font-weight: 700; opacity: 0; transition: opacity .2s ease; }
        .profile-avatar:hover .avatar-upload-hint, .profile-avatar:focus-visible .avatar-upload-hint { opacity: 1; }
        .avatar-input { display: none; }
        .avatar-message { position: absolute; right: 24px; bottom: 18px; color: rgba(255,255,255,.65); font-size: .76rem; }
        .profile-info { flex: 1; }
        .profile-info h3 { margin: 0 0 4px 0; color: #fff; font-size: 1.15rem; }
        .profile-info p { margin: 0 0 6px 0; color: rgba(255,255,255,.5); font-size: .85rem; }
        .location-tag { font-size: .75rem; color: #00d2b5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Botão "Editar" estilo Pill igual da referência */
        .edit-pill-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 100px; border: 1px solid rgba(255,255,255,.12); background: transparent; color: #fff; font-size: .8rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .edit-pill-btn:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.3); }

        /* Formulários e Inputs */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; }
        .form-stack { display: flex; flex-direction: column; gap: 14px; }

        label { display: flex; flex-direction: column; gap: 6px; }
        .label-text { color: rgba(255,255,255,.5); font-size: .8rem; font-weight: 600; }

        input { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: .9rem; outline: none; transition: 0.2s; width: 100%; box-sizing: border-box; }
        input[readonly] { background: transparent; border-color: transparent; padding-left: 0; color: rgba(255,255,255,.9); font-weight: 600; }
        input:not([readonly]):focus { border-color: #00d2b5; background: rgba(255,255,255,.05); }

        .input-with-icon { position: relative; display: flex; align-items: center; }
        .eye-btn { position: absolute; right: 12px; background: transparent; border: 0; color: rgba(255,255,255,.5); cursor: pointer; padding: 4px; display: flex; }
        .eye-btn:hover { color: #fff; }

        .form-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.06); }
        .save-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: #00d2b5; color: #060810; font-weight: 700; border: 0; cursor: pointer; margin-left: auto; }
        .save-btn:hover { opacity: 0.9; }

        /* Sistema / Preferências */
        .system-rows { display: flex; flex-direction: column; gap: 20px; }
        .system-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .system-row:last-child { border: 0; padding-bottom: 0; }
        .system-row.vertical { flex-direction: column; align-items: flex-start; gap: 12px; }

        .row-info { display: flex; align-items: flex-start; gap: 12px; }
        .icon-cyan { color: #00d2b5; margin-top: 2px; }
        .row-info strong { display: block; color: #fff; font-size: .9rem; }
        .row-info p { margin: 2px 0 0 0; color: rgba(255,255,255,.45); font-size: .8rem; }

        .theme-toggle-group { display: flex; gap: 8px; background: rgba(255,255,255,.04); padding: 4px; border-radius: 12px; width: 100%; box-sizing: border-box; }
        .theme-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; border: 0; border-radius: 8px; background: transparent; color: rgba(255,255,255,.6); font-size: .8rem; font-weight: 600; cursor: pointer; }
        .theme-btn.selected { background: #00d2b5; color: #060810; }

        .custom-checkbox { width: 20px; height: 20px; accent-color: #00d2b5; cursor: pointer; }

        /* Responsividade */
        @media (max-width: 840px) {
          .settings-container { grid-template-columns: 1fr; }
          .settings-nav { flex-direction: row; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); padding-right: 0; padding-bottom: 12px; overflow-x: auto; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </PrivateShell>
  );
}