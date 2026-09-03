"use client";

import * as React from "react";

type Locale = "en" | "pt";
type LocaleScope = "private" | "landing";

function readLocale(scope: LocaleScope): Locale | null {
  if (typeof document === "undefined") return null;
  const cookieName = scope === "private" ? "nova-private-locale" : "nova-landing-locale";
  const value = document.cookie.split("; ").find((item) => item.startsWith(`${cookieName}=`))?.split("=")[1];
  return value === "en" || value === "pt" ? value : null;
}

export function usePreferredLocale(scope: LocaleScope, fallback: string): Locale {
  const defaultLocale = fallback === "pt" ? "pt" : "en";
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const handleLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ scope?: LocaleScope }>).detail;
      if (detail?.scope === scope) onStoreChange();
    };
    window.addEventListener("nova-locale-changed", handleLocaleChange);
    return () => window.removeEventListener("nova-locale-changed", handleLocaleChange);
  }, [scope]);
  const getSnapshot = React.useCallback(() => readLocale(scope) || defaultLocale, [defaultLocale, scope]);
  const getServerSnapshot = React.useCallback(() => defaultLocale, [defaultLocale]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}