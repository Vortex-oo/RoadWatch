
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers);
    const token = getToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof payload === "object" &&
                payload !== null &&
                "message" in payload
                ? String(payload.message)
                : `Request failed (${response.status})`;

        throw new Error(message);
    }

    return payload as T;
}

export const adminApi = {
    // Your backend returns totalReports, pendingReports and resolvedReports.
    stats: async (): Promise<AdminStats> => {
        const result = await request<{
            totalReports: number;
            pendingReports: number;
            resolvedReports: number;
        }>("/stats");

        return {
            totalReports: result.totalReports,
            awaitingVerification: result.pendingReports,
            repaired: result.resolvedReports,
            highPriority: 0,
            reportsPerWeek: [],
            recentReports: [],
        };
    },

    // Your GET /reports currently returns a plain array.
    reports: async (
        params: Record<string, string | number | undefined>
    ): Promise<ReportsResponse> => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== "" && value !== undefined) {
                query.set(key, String(value));
            }
        });

        const result = await request<Report[]>(
            `/reports?${query.toString()}`
        );

        return {
            reports: result,
            total: result.length,
        };
    },

    report: (id: string) =>
        request<Report>(`/reports/${id}`),

    // These routes are NOT implemented in your backend yet.
    updateStatus: (
        id: string,
        status: ReportStatus,
        note = ""
    ) =>
        request<{ message?: string }>(`/reports/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status, note }),
        }),

    uploadRepairProof: (id: string, image: File) => {
        const body = new FormData();
        body.append("image", image);

        return request<{ repairProofUrl?: string }>(
            `/reports/${id}/repair-proof`,
            {
                method: "POST",
                body,
            }
        );
    },

    users: () =>
        request<{ users?: AdminUser[]; data?: AdminUser[] }>(
            "/admin/users"
        ),

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

    analytics: () =>
        request<AdminAnalytics>("/admin/analytics"),
};
