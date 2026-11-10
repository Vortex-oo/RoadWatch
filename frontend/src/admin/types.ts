export type UserRole = "user" | "verifier" | "admin";
export type ReportStatus = "reported" | "verified" | "in_progress" | "repaired" | "rejected";
export type SeverityLevel = "low" | "medium" | "high";

export interface AuthUser {
  _id?: string;
  name: string;
  email?: string;
  role: UserRole;
}

export interface AIResult {
  isPothole?: boolean;
  confidence?: number; // Expected as 0..1. Adjust if your API returns 0..100.
  severity?: SeverityLevel;
}

export interface GeoPoint {
  type?: "Point";
  coordinates: [number, number]; // MongoDB order: [longitude, latitude]
}

export interface Report {
  _id: string;
  description?: string;
  imageUrl?: string;
  repairProofUrl?: string;
  address?: string;
  location?: GeoPoint;
  aiResult?: AIResult;
  status: ReportStatus;
  priorityScore?: number;
  priorityBreakdown?: {
    roadImportance?: number | string;
  };
  duplicateCount?: number;
  ageDays?: number;
  reporter?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
}

export interface ReportsResponse {
  reports?: Report[];
  data?: Report[];
  total?: number;
}

export interface WeeklyCount {
  week: string;
  count: number;
}

export interface RepairTimePoint {
  week: string;
  averageDays: number;
}

export interface HotspotArea {
  area: string;
  count: number;
}

export interface AdminStats {
  totalReports?: number;
  awaitingVerification?: number;
  highPriority?: number;
  repaired?: number;
  reportsPerWeek?: WeeklyCount[];
  recentReports?: Report[];
}

export interface AdminAnalytics {
  reportsPerWeek?: WeeklyCount[];
  repairTimeTrend?: RepairTimePoint[];
  hotspotAreas?: HotspotArea[];
}

export interface AdminUser {
  _id: string;
  name?: string;
  email?: string;
  role: UserRole;
  blocked?: boolean;
  createdAt?: string;
}
