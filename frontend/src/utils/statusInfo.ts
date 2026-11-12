import type { ReportStatus, Severity } from "../types/report";

export const severityColors: Record<Severity, string> = {
    low: "#16a34a",     // Green
    medium: "#f59e0b",  // Orange
    high: "#dc2626",    // Red
} as const;

export const severityLabels: Record<Severity, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

export const statusLabels: Record<ReportStatus, string> = {
    reported: "Reported",
    verified: "Verified",
    in_progress: "In progress",
    repaired: "Repaired",
    rejected: "Rejected",
};

export const markerColors: Record<ReportStatus, string> = {
    reported: "#eab308",
    verified: "#2563eb",
    in_progress: "#f97316",
    repaired: "#16a34a",
    rejected: "#64748b",
};

export const badgeColors: Record<ReportStatus, string> = {
    reported: "#ffc9c9",
    verified: "#ffec99",
    in_progress: "#ffd8a8",
    repaired: "#b2f2bb",
    rejected: "#e9ecef",
};