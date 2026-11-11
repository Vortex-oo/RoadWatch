import type { ReportFilters, ReportStatus, Severity } from "../types/report";
import { markerColors, severityLabels, statusLabels } from "../utils/statusInfo";

interface FiltersPanelProps {
    filters: ReportFilters;
    onChange: (newFilters: ReportFilters) => void;
}

const statusOptions: ReportStatus[] = ["reported", "verified", "in_progress", "repaired"];
const severityOptions: Severity[] = ["low", "medium", "high"];

export default function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
    // Adds the status if it is not selected, removes it if it is.
    function toggleStatus(status: ReportStatus) {
        const isSelected = filters.statuses.includes(status);
        const newStatuses = isSelected
            ? filters.statuses.filter((item) => item !== status)
            : [...filters.statuses, status];

        onChange({ ...filters, statuses: newStatuses });
    }

    // Clicking the selected severity again goes back to "all".
    function chooseSeverity(severity: Severity) {
        const newSeverity = filters.severity === severity ? "all" : severity;
        onChange({ ...filters, severity: newSeverity });
    }

    return (
        <>
            <h2 className="text-3xl">Filters</h2>

            <span>Status</span>
            {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.statuses.includes(status)} onChange={() => toggleStatus(status)} />
                    <span
                        className="inline-block h-4 w-4 rounded-full border-2 border-ink"
                        style={{ background: markerColors[status] }}
                    />
                    {statusLabels[status]}
                </label>
            ))}

            <span>Severity</span>
            <div className="flex flex-wrap gap-2">
                {severityOptions.map((severity) => (
                    <button
                        key={severity}
                        type="button"
                        className={
                            filters.severity === severity
                                ? "sketch cursor-pointer bg-hand-yellow px-3 py-1"
                                : "sketch cursor-pointer px-3 py-1"
                        }
                        onClick={() => chooseSeverity(severity)}
                    >
                        {severityLabels[severity]}
                    </button>
                ))}
            </div>

            <span>Date range</span>
            <label>
                From
                <input
                    type="date"
                    className="sketch mt-1 block w-full px-3 py-2"
                    value={filters.fromDate}
                    onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
                />
            </label>
            <label>
                To
                <input
                    type="date"
                    className="sketch mt-1 block w-full px-3 py-2"
                    value={filters.toDate}
                    onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
                />
            </label>
        </>
    );
}