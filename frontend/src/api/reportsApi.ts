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