import type { ReportStatus, Severity } from "../types/report";

export const statusLabels: Record<ReportStatus, string> = {
    reported: "Reported",
    verified: "Verified",
    in_progress: "In progress",
    repaired: "Repaired",
    rejected: "Rejected",
};

// Stronger colors for the map markers.
export const markerColors: Record<ReportStatus, string> = {
    reported: "#ff8787",
    verified: "#ffd43b",
    in_progress: "#ffa94d",
    repaired: "#69db7b",
    rejected: "#adb5bd",
};

// Soft colors for the status badges.
export const badgeColors: Record<ReportStatus, string> = {
    reported: "#ffc9c9",
    verified: "#ffec99",
    in_progress: "#ffd8a8",
    repaired: "#b2f2bb",
    rejected: "#e9ecef",
};

export const severityLabels: Record<Severity, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
};