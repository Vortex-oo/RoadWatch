import { useEffect, useState } from "react";
import { getReports } from "../api/reportsApi";
import FiltersPanel from "../component/FiltersPanel";
import ReportMap from "../component/ReportMap";
import type { Report, ReportFilters } from "../types/report";
import { filterReports } from "../utils/filterReports";

// The map starts with open reports only. "Repaired" is off until the user asks for it.
const startingFilters: ReportFilters = {
    statuses: ["reported", "verified", "in_progress"],
    severity: "all",
    fromDate: "",
    toDate: "",
};

export default function MapPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [filters, setFilters] = useState<ReportFilters>(startingFilters);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadReports() {
            try {
                setReports(await getReports());
            } catch {
                setErrorMessage("Could not load reports. Please try again.");
            }
        }
        loadReports();
    }, []);

    const visibleReports = filterReports(reports, filters);

    return (
        // 56px is the navbar height (h-14), so the page fills the rest of the screen.
        <div className="flex h-[calc(100vh-56px)]">
            <aside className="flex w-64 shrink-0 flex-col gap-2.5 overflow-y-auto border-r-2 border-ink p-4">
                <FiltersPanel filters={filters} onChange={setFilters} />
                <p className="text-lg text-note">
                    Showing {visibleReports.length} of {reports.length} reports
                </p>
                {errorMessage && <p className="text-lg text-note">{errorMessage}</p>}
            </aside>

            <div className="relative flex-1">
                <ReportMap reports={visibleReports} />
                {/* z-[1000] keeps the legend above the map layers */}
                <p className="absolute bottom-2.5 left-3.5 z-[1000] bg-white/85 px-2 text-lg text-note">
                    Red = reported, yellow = verified, orange = in progress, green = repaired
                </p>
            </div>
        </div>
    );
}