import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReportById } from "../api/reportsApi";
import PhotoBox from "../component/PhotoBox";
import StatusBadge from "../component/StatusBadge";
import StatusTimeline from "../component/StatusTimeline";
import type { Report } from "../types/report";
import { formatDate } from "../utils/formatDate";
import { severityLabels } from "../utils/statusInfo";

export default function ReportDetailPage() {
    const { id } = useParams();
    const [report, setReport] = useState<Report | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadReport() {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                setReport(await getReportById(id));
            } catch {
                setErrorMessage("Could not load this report. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        loadReport();
    }, [id]);

    if (isLoading) {
        return <p className="p-6">Loading report...</p>;
    }
    if (errorMessage) {
        return <p className="p-6">{errorMessage}</p>;
    }
    if (!report) {
        return (
            <p className="p-6">
                Report not found. <Link to="/map">Back to the map</Link>
            </p>
        );
    }

    const confidencePercent = Math.round(report.aiConfidence * 100);

    return (
        <div className="mx-auto max-w-4xl px-5 py-8">
            <p className="mb-3">
                <Link to="/map">&larr; Back to the map</Link>
            </p>
            <h1 className="mb-3 text-4xl">
                Report details <StatusBadge status={report.status} />
            </h1>

            <div className="mb-8 flex flex-wrap gap-5">
                <div className="flex min-w-[280px] flex-1 flex-col gap-3.5">
                    <PhotoBox imageUrl={report.imageUrl} label="Before photo" height={240} />
                    {/* The "after" photo only exists once the repair is done. */}
                    {report.status === "repaired" && (
                        <PhotoBox imageUrl={report.afterImageUrl} label="After photo (repaired)" height={240} />
                    )}
                </div>

                <div className="sketch flex min-w-[280px] flex-1 flex-col gap-2 bg-sticky p-4">
                    <p>Location: {report.address}</p>
                    <p className="text-lg text-note">
                        {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </p>
                    <p>AI check: {confidencePercent}% confident this is road damage</p>
                    <p>Severity: {severityLabels[report.severity]}</p>
                    <p>Priority score: {report.priorityScore.toFixed(1)}</p>
                    <p>People who reported this spot: {report.confirmationCount}</p>
                    <p>Reported on: {formatDate(report.createdAt)}</p>
                    <p>Description: {report.description || "No description given."}</p>
                </div>
            </div>

            <h2 className="mb-3 text-3xl">Status timeline</h2>
            <StatusTimeline history={report.statusHistory} />
        </div>
    );
}