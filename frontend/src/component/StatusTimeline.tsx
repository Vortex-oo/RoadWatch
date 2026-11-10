import type { StatusChange } from "../types/report";
import { formatDate } from "../utils/formatDate";
import StatusBadge from "./StatusBadge";

interface StatusTimelineProps {
    history: StatusChange[];
}

export default function StatusTimeline({ history }: StatusTimelineProps) {
    return (
        <ol className="ml-2 border-l-2 border-dashed border-gray-400">
            {history.map((change) => (
                // The before: classes draw the small circle on the dashed line.
                <li
                    key={`${change.status}-${change.changedAt}`}
                    className="relative pb-3.5 pl-5 before:absolute before:-left-2 before:top-1.5 before:h-3.5 before:w-3.5 before:rounded-full before:border-2 before:border-ink before:bg-white before:content-['']"
                >
                    <StatusBadge status={change.status} />{" "}
                    <span className="text-lg text-note">{formatDate(change.changedAt)}</span>
                </li>
            ))}
        </ol>
    );
}