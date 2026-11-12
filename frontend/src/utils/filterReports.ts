import type { Report, ReportFilters } from "../types/report";

// Keeps only the reports that match every filter the user chose.
export function filterReports(reports: Report[], filters: ReportFilters): Report[] {
    return reports.filter((report) => {
        if (!filters.statuses.includes(report.status)) {
            return false;
        }

        if (filters.severity !== "all" && report.severity !== filters.severity) {
            return false;
        }

        // The first 10 characters of an ISO date are "YYYY-MM-DD",
        // so plain text comparison works for dates.
        const reportDate = report.createdAt?.slice(0, 10) ?? "";

        if (filters.fromDate && reportDate < filters.fromDate) {
            return false;
        }
        if (filters.toDate && reportDate > filters.toDate) {
            return false;
        }

        return true;
    });
}