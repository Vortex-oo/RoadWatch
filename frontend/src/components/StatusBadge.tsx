import type { ReportStatus } from "../types/report";
import { badgeColors, statusLabels } from "../utils/statusInfo";

interface StatusBadgeProps {
    status: ReportStatus;
}

// The color depends on the status, so it comes from statusInfo.ts as a style.
export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className="sketch inline-block px-2.5 py-0.5 text-lg" style={{ background: badgeColors[status] }}>
            {statusLabels[status]}
        </span>
    );
}