"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Award, Flame, Menu, X } from "lucide-react";
import { getDashboard } from "@/shared/lib/api";
import { useAuth } from "@/shared/lib/AuthContext";
import { LanguageDropdown } from "@/shared/ui/LanguageDropdown";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isPt = locale === "pt";
  const { user, isLoggedIn } = useAuth();
  const [displayName, setDisplayName] = React.useState("");
  const [avatarSrc, setAvatarSrc] = React.useState("/mascotes/mascote_equilibrado_v2.svg");
  const [progress, setProgress] = React.useState({ totalCheckins: 0, streak: 0 });

  const isDashboardRoute = pathname?.includes("/dashboard") ?? false;
  const isPrivateRoute = isLoggedIn && (
    isDashboardRoute ||
    pathname?.includes("/profile") ||
    pathname?.includes("/settings") ||
    pathname?.includes("/check-in") ||
    pathname?.includes("/insights") ||
    pathname?.includes("/diary")
    || pathname?.includes("/novagame")
  );

  React.useEffect(() => {
    if (!isPrivateRoute) return;
    getDashboard().then(({ totalCheckins, streak }) => setProgress({ totalCheckins, streak })).catch(() => undefined);
  }, [isPrivateRoute]);

  const level = Math.max(1, Math.floor(progress.totalCheckins / 3) + 1);
  const badges = [
    progress.totalCheckins >= 1 ? "Primeiro passo" : null,
    progress.totalCheckins >= 3 ? "A observar" : null,
    progress.streak >= 3 ? "Ritmo presente" : null,
  ].filter((badge): badge is string => Boolean(badge));

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const updateDisplayName = () => {
      setDisplayName(window.localStorage.getItem(`nova-display-name-${user?.id}`) || user?.name || "");
    };
    updateDisplayName();
    window.addEventListener("nova-display-name-changed", updateDisplayName);
    return () => window.removeEventListener("nova-display-name-changed", updateDisplayName);
  }, [user]);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAvatarSrc(user?.avatarData || "/mascotes/mascote_equilibrado_v2.svg");
    });
    const handleAvatarChange = (event: Event) => {
      const avatarData = (event as CustomEvent<string>).detail;
      if (avatarData) setAvatarSrc(avatarData);
    };
    window.addEventListener("nova-avatar-changed", handleAvatarChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("nova-avatar-changed", handleAvatarChange);
    };
  }, [user]);

  const navItems = isPt
    ? [
        { label: "Início", href: `/${locale}` },
        { label: "Check-in", href: `/${locale}/check-in` },
        { label: "Insights", href: `/${locale}/insights` },
        { label: "Dashboard", href: `/${locale}/dashboard` },
      ]
    : [
        { label: "Home", href: `/${locale}` },
        { label: "Check-in", href: `/${locale}/check-in` },
        { label: "Insights", href: `/${locale}/insights` },
        { label: "Dashboard", href: `/${locale}/dashboard` },
      ];

  if (isPrivateRoute) {
    return (
      <>
        <header
          className="dashboard-header navbar"
          style={{
            position: "fixed",
            top: 0,
            left: 220,
            right: 0,
            width: "calc(100% - 220px)",
            zIndex: 30,
            transition: "all 0.3s ease",
            background: scrolled
              ? "linear-gradient(180deg, rgba(6,8,16,0.98) 0%, rgba(6,8,16,0.95) 100%)"
              : "linear-gradient(180deg, rgba(6,8,16,0.85) 0%, rgba(6,8,16,0.70) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
          }}
        >
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 85, padding: "0 28px", boxSizing: "border-box" }}>
            <div style={{ flex: 1 }} />

            <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div title={isPt ? `${badges.length} distintivos conquistados` : `${badges.length} badges earned`} style={{ display: "flex", alignItems: "center", gap: 8, color: "#00d2b5", fontSize: "0.78rem", fontWeight: 700 }}>
                <Award size={17} aria-hidden="true" />
                <span>{badges.length}</span>
              </div>
              <div title={isPt ? `Nível ${level}` : `Level ${level}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid rgba(0,210,181,0.35)", borderRadius: 999, color: "#ffffff", fontSize: "0.78rem", fontWeight: 700 }}>
                <Flame size={15} color="#f59e0b" aria-hidden="true" />
                <span>{isPt ? `Nível ${level}` : `Level ${level}`}</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", fontWeight: 600 }}>{displayName}</span>
              <Link href={`/${locale}/settings`} aria-label={isPt ? "Abrir configurações" : "Open settings"} style={{ display: "block" }}>
                <button
                  type="button"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border: "2px solid rgba(0, 210, 181, 0.6)",
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  }}
                  title={user?.name || "Avatar"}
                >
                  <Image src={avatarSrc} alt="Avatar NOVA" width={50} height={50} unoptimized style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                </button>
              </Link>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 100,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          background: scrolled
            ? "linear-gradient(180deg, rgba(6, 8, 16, 0.98) 0%, rgba(6, 8, 16, 0.95) 100%)"
            : "linear-gradient(180deg, rgba(6, 8, 16, 0.85) 0%, rgba(6, 8, 16, 0.70) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "none",
          boxShadow: "none",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 85, padding: "0 28px" }}>
          <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", color: "#ffffff", textDecoration: "none" }}>
            <Image src="/icons/nova-icon-192.svg" alt="NOVA Psychology" width={38} height={38} />
            <span><span style={{ fontWeight: 800 }}>NOVA</span> <span style={{ fontWeight: 300, fontSize: "1.05rem", opacity: 0.85, letterSpacing: "0.02em" }}>psychology</span></span>
          </Link>

          <nav style={{ display: "flex", gap: 36 }}>
            {navItems.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link key={l.label} href={l.href} style={{ fontSize: "0.9375rem", fontWeight: isActive ? 600 : 400, color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)", textDecoration: "none" }}>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LanguageDropdown buttonStyle={{ background: "transparent", border: "1px solid transparent", boxShadow: "none" }} />
            <Link href={`/${locale}/auth/login`} style={{ border: "none", color: "#ffffff", padding: "10px 18px", borderRadius: "100px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", background: "transparent", boxShadow: "none" }}>
              {isPt ? "Começar" : "Get Started"}
            </Link>
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            style={{ display: "none", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
          >
            {isMobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
    </>
  );
}