import type
{
  CheckInFormData,
  WellbeingEntry,
  InsightPattern,
} from "@/entities/check-in/model/types";

const BASE_URL = "/api";
type DashboardData = {
  streak: number;
  totalCheckins: number;
  avgMood: number;
  weekEntries: WellbeingEntry[];
  latestInsight?: InsightPattern;
};
let dashboardCache: DashboardData | null = null;
let dashboardCacheAt = 0;
let dashboardRequest: Promise<DashboardData> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getUserFriendlyError(error: unknown, isPt = true): string {
  if (!(error instanceof ApiError)) {
    return isPt
      ? "Não foi possível concluir o pedido. Verifica a tua ligação e tenta novamente."
      : "We could not complete the request. Check your connection and try again.";
  }

  if (error.status === 400) {
    return isPt ? "Os dados enviados não são válidos." : "The submitted data is not valid.";
  }
  if (error.status === 401) {
    return isPt ? "A tua sessão terminou. Inicia sessão novamente." : "Your session has ended. Please sign in again.";
  }
  if (error.status === 403) {
    return isPt ? "Não tens autorização para realizar esta ação." : "You are not authorized to perform this action.";
  }
  if (error.status === 404) {
    return isPt ? "A informação solicitada não foi encontrada." : "The requested information was not found.";
  }
  if (error.status === 409) {
    return isPt ? "Já existe uma conta com estes dados." : "An account with these details already exists.";
  }
  if (error.status >= 500) {
    return isPt ? "O serviço está temporariamente indisponível. Tenta novamente." : "The service is temporarily unavailable. Please try again.";
  }
  return isPt ? "Não foi possível concluir o pedido." : "We could not complete the request.";
}

async function fetcher<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // send HttpOnly cookies
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new ApiError(
      (errorBody as { message?: string }).message ??
        "Request failed",
      res.status,
    );
  }

  return res.json() as Promise<T>;
}

export function login(email: string, password: string)
{
  return fetcher<{ user: { id: string; name: string; email: string; role: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string, phone?: string, acceptedTerms = false)
{
  return fetcher<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone, acceptedTerms }),
  });
}

export function verifyEmail(token: string) {
  return fetcher<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function verifyEmailCode(code: string) {
  return fetcher<{ message: string }>(`/auth/verify-email?code=${encodeURIComponent(code)}`);
}

export function logout()
{
  return fetcher<{ message: string }>("/auth/logout", { method: "POST" });
}

export function getCurrentUser()
{
  return fetcher<{ user: { id: string; name: string; email: string; phone?: string; avatarData?: string | null; role: string } }>("/auth/me");
}

export function uploadAvatar(data: string, mimeType: string) {
  return fetcher<{ avatarData: string }>("/auth/avatar", {
    method: "POST",
    body: JSON.stringify({ data, mimeType }),
  });
}

export function exportUserData() {
  return fetcher<{ user: { id: string; name: string; email: string; phone?: string | null; createdAt: string }; checkIns: WellbeingEntry[] }>('/auth/data-export');
}

export function deleteAccount() {
  return fetcher<{ message: string }>('/auth/account', { method: 'DELETE' });
}

export function updateProfile(data: { name: string; email: string; phone?: string }) {
  return fetcher<{ user: { id: string; name: string; email: string; phone?: string; role: string } }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  return fetcher<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function checkIn(data: CheckInFormData)
{
  return fetcher<WellbeingEntry | { crisis: true; message: string }>("/check-in", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((result) => {
    if (!("crisis" in result)) {
      dashboardCache = null;
      dashboardCacheAt = 0;
    }
    return result;
  });
}

export function getCheckIns()
{
  return fetcher<WellbeingEntry[]>("/check-in");
}

export function getInsights()
{
  return fetcher<InsightPattern[]>("/insights");
}

export function getDashboard()
{
  const now = Date.now();
  if (dashboardCache && now - dashboardCacheAt < 30_000) return Promise.resolve(dashboardCache);
  if (dashboardRequest) return dashboardRequest;
  dashboardRequest = fetcher<DashboardData>("/insights/dashboard").then((data) => {
    dashboardCache = data;
    dashboardCacheAt = Date.now();
    return data;
  }).finally(() => {
    dashboardRequest = null;
  });
  return dashboardRequest;
}
