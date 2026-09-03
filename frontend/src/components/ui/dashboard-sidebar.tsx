"use client";

import Link from "next/link";
import * as React from "react";
import {
  LayoutGrid,
  CheckSquare,
  LineChart,
  BookOpen,
  Gamepad2,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { usePreferredLocale } from "@/shared/lib/locale";

interface DashboardSidebarProps {
  locale: string;
  activePath: string;
  onLogout?: () => void;
}

export function DashboardSidebar({
  locale,
  activePath,
  onLogout,
}: DashboardSidebarProps) {
  const preferredLocale = usePreferredLocale("private", locale);
  const isPt = preferredLocale === "pt";
  const [isOpen, setIsOpen] = React.useState(false);
  const normalizedActivePath = activePath.replace(/^\/(en|pt)(?=\/|$)/, "") || "/";

  const mainNav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/check-in", label: "Check-in", icon: CheckSquare },
    { href: "/insights", label: "Insights", icon: LineChart },
    { href: "/diary", label: isPt ? "Meu Diário" : "My Diary", icon: BookOpen },
    { href: "/novagame", label: isPt ? "Jogos NOVA" : "NOVA Games", icon: Gamepad2 },
  ];

  const accountNav = [
    { href: "/settings", label: isPt ? "Configurações" : "Settings", icon: Settings },
    { href: "/safety", label: isPt ? "Segurança e limites" : "Safety & limits", icon: ShieldCheck },
    { href: "/evidence", label: isPt ? "Evidência e fontes" : "Evidence & sources", icon: BookOpen },
  ];

  return (
    <>
      <button
        type="button"
        className="mobile-sidebar-toggle"
        aria-label={isOpen ? (isPt ? "Fechar menu" : "Close menu") : (isPt ? "Abrir menu" : "Open menu")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label={isPt ? "Fechar menu" : "Close menu"}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar${isOpen ? " mobile-sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-title">NOVA</span>
          <span className="brand-subtitle">psychology</span>
        </div>

        <div className="sidebar-content">
          <nav className="nav-group">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = normalizedActivePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`nav-link${isActive ? " active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <nav className="nav-group">
              {accountNav.map((item) => {
                const Icon = item.icon;
                const isActive = normalizedActivePath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`nav-link${isActive ? " active" : ""}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {onLogout && (
              <button type="button" onClick={onLogout} className="logout-btn">
                <LogOut size={18} />
                <span>{isPt ? "Sair" : "Logout"}</span>
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          .dashboard-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 220px;
            height: 100vh;
            background: #0a0e1a;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            padding: 24px 14px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            z-index: 110;
          }

          .sidebar-brand {
            padding: 0 8px 20px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            flex-shrink: 0;
          }

          .brand-title {
            font-size: 1.2rem;
            font-weight: 800;
            color: #00d2b5;
            letter-spacing: 1px;
          }

          .brand-subtitle {
            color: rgba(255, 255, 255, 0.65);
            font-size: 0.82rem;
            font-weight: 300;
            letter-spacing: 0.02em;
          }

          .sidebar-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
            padding-top: 18px;
          }

          .nav-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          :global(.nav-link) {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 400;
            font-size: 0.88rem;
            text-decoration: none;
            transition: all 0.15s ease;
          }

          :global(.nav-link:hover) {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.04);
          }

          :global(.nav-link.active) {
            color: #00d2b5;
            background: rgba(0, 210, 181, 0.08);
            font-weight: 600;
          }

          .sidebar-footer {
            margin-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex-shrink: 0;
          }

          .logout-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 10px;
            color: #f87171;
            background: transparent;
            border: none;
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            text-align: left;
          }

          .logout-btn:hover {
            background: rgba(248, 113, 113, 0.08);
          }

          .mobile-sidebar-toggle,
          .mobile-sidebar-backdrop {
            display: none;
          }

          @media (max-width: 900px) {
            .dashboard-sidebar {
              display: none;
            }

            .dashboard-sidebar.mobile-sidebar-open {
              display: flex;
              z-index: 120;
            }

            .mobile-sidebar-toggle {
              position: fixed;
              top: 16px;
              left: 14px;
              z-index: 140;
              display: grid;
              place-items: center;
              width: 44px;
              height: 44px;
              color: #fff;
              background: rgba(10, 14, 26, 0.94);
              border: 1px solid rgba(255, 255, 255, 0.18);
              border-radius: 10px;
              cursor: pointer;
            }

            .mobile-sidebar-backdrop {
              position: fixed;
              inset: 0;
              z-index: 115;
              display: block;
              background: rgba(0, 0, 0, 0.48);
              border: 0;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
