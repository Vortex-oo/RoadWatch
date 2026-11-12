// The steps a report goes through. "rejected" reports are never shown publicly.
export type ReportStatus = "reported" | "verified" | "in_progress" | "repaired" | "rejected";

export type Severity = "low" | "medium" | "high";

export interface StatusChange {
    status: ReportStatus;
    changedAt: string; // ISO date, for example "2026-11-03T09:30:00Z"
}

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  severity: "low" | "medium" | "high";
  status: "reported" | "verified" | "in_progress" | "repaired" | "rejected";
  priorityScore: number;
  confirmationCount: number;
}

// The values chosen in the map filters panel.
export interface ReportFilters {
    statuses: ReportStatus[];
    severity: Severity | "all";
    fromDate: string; // "YYYY-MM-DD", empty means no limit
    toDate: string; // "YYYY-MM-DD", empty means no limit
}