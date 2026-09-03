"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { Navbar } from "@/shared/ui/Navbar";
import { useAuth } from "@/shared/lib/AuthContext";

interface PrivateShellProps {
  children: React.ReactNode;
}

export function PrivateShell({ children }: PrivateShellProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const { isLoggedIn, isReady, logoutUser } = useAuth();

  if (!isReady) return null;
  if (!isLoggedIn) {
    router.replace(`/${locale}/auth/login`);
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="private-shell">
      <Navbar />
      <DashboardSidebar locale={locale} activePath={pathname} onLogout={handleLogout} />
      <main className="private-content">{children}</main>
      <style jsx>{`
        .private-shell {
          min-height: 100vh;
          background: #060810;
          color: #ffffff;
        }
        :global(html[data-theme="light"]) .private-shell {
          background: #f5f7fb;
          color: #172033;
        }
        .private-content {
          min-height: 100vh;
          margin-left: 220px;
          padding: 117px 32px 60px;
          box-sizing: border-box;
        }
        @media (max-width: 900px) {
          .private-content {
            margin-left: 0;
            padding: 104px 16px 40px;
          }
        }
      `}</style>
    </div>
  );
}
