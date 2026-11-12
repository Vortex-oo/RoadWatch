import { useEffect } from "react";

import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
    ZoomControl,
    useMap,
} from "react-leaflet";

import { LatLngBounds } from "leaflet";
import { Link } from "react-router-dom";

import type { Report } from "../types/report";

import {
    severityColors,
    severityLabels,
    statusLabels,
} from "../utils/statusInfo";

import PhotoBox from "./PhotoBox";

const MAP_CENTER: [number, number] = [22.5726, 88.3639];
const MAP_ZOOM = 12;

interface ReportMapProps {
    reports: Report[];
}

// Automatically adjust the map to show every report.
function FitReportsBounds({ reports }: ReportMapProps) {
    const map = useMap();

    useEffect(() => {
        const validReports = reports.filter(
            (report) =>
                Number.isFinite(report.latitude) &&
                Number.isFinite(report.longitude) &&
                report.latitude >= -90 &&
                report.latitude <= 90 &&
                report.longitude >= -180 &&
                report.longitude <= 180
        );

        if (validReports.length === 0) return;

        const bounds = new LatLngBounds(
            validReports.map(
                (report) => [report.latitude, report.longitude] as [number, number]
            )
        );

        map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 14,
        });
    }, [reports, map]);

    return null;
}

export default function ReportMap({ reports }: ReportMapProps) {
    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_ZOOM}
                zoomControl={false}
                className="h-full w-full bg-[#f1f3f5]"
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ZoomControl position="topright" />

                <FitReportsBounds reports={reports} />

                {reports.map((report) => {
                    const color =
                        severityColors[report.severity] || "#64748b";

                    return (
                        <CircleMarker
                            key={report.id}
                            center={[report.latitude, report.longitude]}
                            radius={10}
                            pathOptions={{
                                color: "#ffffff",
                                weight: 2,
                                fillColor: color,
                                fillOpacity: 0.9,
                            }}
                        >
                            <Popup>
                                <div className="flex w-52 flex-col gap-2">
                                    <PhotoBox
                                        imageUrl={report.imageUrl}
                                        label="Pothole photo"
                                        height={100}
                                    />

                                    <p className="font-semibold">
                                        Road damage report
                                    </p>

                                    <p>
                                        Severity:{" "}
                                        {severityLabels[report.severity] || "Unknown"}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {statusLabels[report.status] || report.status}
                                    </p>

                                    <p>
                                        Priority: {report.priorityScore.toFixed(1)}
                                    </p>

                                    <p>
                                        Confirmations: {report.confirmationCount}
                                    </p>

                                    <Link
                                        to={`/reports/${report.id}`}
                                        className="sketch bg-hand-yellow px-4 py-2 text-center no-underline"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Severity legend */}
            <div className="absolute bottom-5 left-5 z-[1000] rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                <p className="mb-2 text-xs font-bold text-slate-800">
                    Pothole severity
                </p>

                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-green-600" />
                        Low
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-amber-500" />
                        Medium
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-red-600" />
                        High
                    </div>
                </div>

                <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                    Total reports: {reports.length}
                </p>
            </div>
        </div>
    );
}
