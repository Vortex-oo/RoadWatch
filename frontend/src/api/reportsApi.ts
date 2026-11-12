
import type { Report } from "../types/report";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ReportsResponse {
    success: boolean;
    count: number;
    reports: Report[];
}

interface CreateReportPayload {
    description: string;
    photo: File;
    latitude: number;
    longitude: number;
    severity?: "low" | "medium" | "high";
}

// GET all potholes for the map
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

// GET a single pothole report
export async function getReportById(id: string): Promise<Report> {
    const response = await fetch(`${API_URL}/reports/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.status}`);
    }

    return response.json();
}

// POST a new pothole report with an image
export async function createReport(
    payload: CreateReportPayload
) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in before submitting a report.");
    }

    const formData = new FormData();

    formData.append("description", payload.description);
    formData.append("photo", payload.photo);
    formData.append("latitude", String(payload.latitude));
    formData.append("longitude", String(payload.longitude));
    formData.append("severity", payload.severity || "medium");

    const response = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Failed to create report.");
    }

    return data;
}
