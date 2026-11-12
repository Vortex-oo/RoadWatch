import type { Report } from "../types/report";

const API_URL = "http://localhost:3000";

interface ReportsResponse {
  success: boolean;
  count: number;
  reports: Report[];
}

export async function getMapReports(): Promise<Report[]> {
  const response = await fetch(`${API_URL}/reports`);

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.status}`);
  }

  const data: ReportsResponse = await response.json();

  if (!data.success) {
    throw new Error("Backend could not fetch reports");
  }

  return data.reports;
}

export async function getReportById(id: string): Promise<Report> {
  const response = await fetch(`${API_URL}/reports/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function createReport(payload: {
  description: string;
  photo?: string;
  latitude: number;
  longitude: number;
  severity?: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      description: payload.description,
      photo: payload.photo || "",
      latitude: payload.latitude,
      longitude: payload.longitude,
      severity: payload.severity || "medium",
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create report.");
  }

  return data;
}