import { getToken } from "./auth";
import type {
  AdminAnalytics,
  AdminStats,
  AdminUser,
  Report,
  ReportsResponse,
  ReportStatus,
  UserRole,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

export const adminApi = {
  stats: () => request<AdminStats>("/admin/stats"),

  reports: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) query.set(key, String(value));
    });
    return request<ReportsResponse>(`/reports?${query.toString()}`);
  },

  report: async (id: string) => {
    const result = await request<Report | { report: Report }>(`/reports/${id}`);
    return "report" in result ? result.report : result;
  },

  updateStatus: (id: string, status: ReportStatus, note = "") =>
    request<{ message?: string }>(`/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),

  uploadRepairProof: (id: string, image: File) => {
    const body = new FormData();
    body.append("image", image);
    return request<{ repairProofUrl?: string }>(`/reports/${id}/repair-proof`, {
      method: "POST",
      body,
    });
  },

  users: () => request<{ users?: AdminUser[]; data?: AdminUser[] }>("/admin/users"),

  updateUserRole: (id: string, role: UserRole) =>
    request<{ message?: string }>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  blockUser: (id: string, blocked: boolean) =>
    request<{ message?: string }>(`/admin/users/${id}/block`, {
      method: "PATCH",
      body: JSON.stringify({ blocked }),
    }),

  analytics: () => request<AdminAnalytics>("/admin/analytics"),
};
