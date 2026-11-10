import { fakeReports } from "../data/fakeReports";
import type { Report } from "../types/report";

// Later, replace the body of these functions with real calls to the backend.
// Leaflet wants [latitude, longitude], but MongoDB stores [longitude, latitude].
// Do that swap here, once, so the pages only see latitude and longitude.

export async function getReports(): Promise<Report[]> {
    // Public pages never show rejected reports.
    return fakeReports.filter((report) => report.status !== "rejected");
}

export async function getReportById(id: string): Promise<Report | undefined> {
    const report = fakeReports.find((item) => item.id === id);

    if (report && report.status === "rejected") {
        return undefined;
    }
    return report;
}