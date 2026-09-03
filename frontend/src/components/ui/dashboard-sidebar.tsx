"use client";

import Link from "next/link";
import { LayoutGrid, CheckSquare, LineChart, BookOpen, Settings, LogOut } from "lucide-react";

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
  const isPt = locale === "pt";

  const mainNav = [
    { href: `/${locale}/dashboard`, label: "Dashboard", icon: LayoutGrid },
    { href: `/${locale}/check-in`, label: "Check-in", icon: CheckSquare },
    { href: `/${locale}/insights`, label: "Insights", icon: LineChart },
    { href: `/${locale}/diary`, label: isPt ? "Meu Diário" : "My Diary", icon: BookOpen },
  ];

  const accountNav = [
    { href: `/${locale}/settings`, label: isPt ? "Configurações" : "Settings", icon: Settings },
  ];

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "220px",
        height: "100vh",
        background: "#0a0e1a",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        zIndex: 110, // Fica acima do Header
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* NOME PRINCIPAL NA SIDEBAR */}
              <div style={{ padding: "0 8px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#00d2b5", letterSpacing: "1px" }}>
            NOVA
          </span>
          <span style={{ marginLeft: 6, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", fontWeight: 300, letterSpacing: "0.02em" }}>
            psychology
          </span>
        </div>

        {/* NAVEGAÇÃO */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  color: isActive ? "#00d2b5" : "rgba(255, 255, 255, 0.6)",
                  background: isActive ? "rgba(0, 210, 181, 0.08)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ÁREA INFERIOR DA SIDEBAR */}
      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {accountNav.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                color: isActive ? "#00d2b5" : "rgba(255, 255, 255, 0.6)",
                background: isActive ? "rgba(0, 210, 181, 0.08)" : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.88rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              color: "#f87171",
              background: "transparent",
              border: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <LogOut size={18} />
            <span>{isPt ? "Sair" : "Logout"}</span>
          </button>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
}