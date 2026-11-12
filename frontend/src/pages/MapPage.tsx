import { useEffect, useState } from "react";
import ReportMap from "../components/ReportMap";
import { getMapReports } from "../api/reportsApi";
import type { Report } from "../types/report";

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const data = await getMapReports();
        setReports(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        Loading map reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-3">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border-2 border-black bg-yellow-300 px-4 py-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-64px)] w-full">
      <ReportMap reports={reports} />
    </main>
  );
}