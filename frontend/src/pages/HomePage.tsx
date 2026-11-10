import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../api/reportsApi";
import type { Report } from "../types/report";

export default function HomePage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadReports() {
            try {
                setReports(await getReports());
            } catch {
                setErrorMessage("Could not load the report counts.");
            } finally {
                setIsLoading(false);
            }
        }
        loadReports();
    }, []);

    const totalCount = reports.length;
    const repairedCount = reports.filter((report) => report.status === "repaired").length;

    return (
        <div className="mx-auto max-w-4xl px-5 py-8">
            <h1 className="mb-3 text-4xl">Report road damage. Track the repair.</h1>
            <p>Take a photo, share the location, and follow your report until the road is fixed.</p>

            <div className="mb-8 mt-5 flex flex-wrap gap-3">
                <Link to="/report" className="sketch bg-hand-blue px-4 py-2 no-underline">
                    Report damage
                </Link>
                <Link to="/map" className="sketch px-4 py-2 no-underline">
                    View the map
                </Link>
            </div>

            <div className="mb-8 flex flex-wrap gap-3.5">
                <div className="sketch min-w-[180px] flex-1 bg-hand-blue px-4 py-3">
                    <div className="text-4xl">{isLoading ? "..." : totalCount}</div>
                    Total reports
                </div>
                <div className="sketch min-w-[180px] flex-1 bg-hand-green px-4 py-3">
                    <div className="text-4xl">{isLoading ? "..." : repairedCount}</div>
                    Repaired
                </div>
            </div>
            {errorMessage && <p className="text-lg text-note">{errorMessage}</p>}

            <h2 className="mb-3 text-3xl">How it works</h2>
            <div className="flex flex-wrap gap-3.5">
                <div className="sketch min-w-[220px] flex-1 px-4 py-3">
                    <h3 className="mb-2 text-2xl">1. Take a photo</h3>
                    <p>Your phone shares the location. You can move the pin if it is off.</p>
                </div>
                <div className="sketch min-w-[220px] flex-1 px-4 py-3">
                    <h3 className="mb-2 text-2xl">2. We check it</h3>
                    <p>The photo is checked, and nearby reports of the same spot are linked together.</p>
                </div>
                <div className="sketch min-w-[220px] flex-1 px-4 py-3">
                    <h3 className="mb-2 text-2xl">3. Follow the repair</h3>
                    <p>See every status change, from reported to repaired, with a photo of the fix.</p>
                </div>
            </div>
        </div>
    );
}