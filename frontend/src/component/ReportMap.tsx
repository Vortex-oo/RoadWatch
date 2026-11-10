import { CircleMarker, MapContainer, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Report } from "../types/report";
import { markerColors, severityLabels, statusLabels } from "../utils/statusInfo";
import PhotoBox from "./PhotoBox";

// Change this to the center of your service area (Kolkata here).
const MAP_CENTER: [number, number] = [22.5726, 88.3639];
const MAP_ZOOM = 12;

interface ReportMapProps {
    reports: Report[];
}

export default function ReportMap({ reports }: ReportMapProps) {
    return (
        <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} zoomControl={false} className="h-full w-full bg-[#f1f3f5]">
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="topright" />

            {reports.map((report) => (
                <CircleMarker
                    key={report.id}
                    center={[report.latitude, report.longitude]}
                    radius={12}
                    pathOptions={{ color: "#1e1e1e", weight: 2, fillColor: markerColors[report.status], fillOpacity: 1 }}
                >
                    <Popup>
                        <div className="flex w-52 flex-col gap-1.5">
                            <PhotoBox imageUrl={report.imageUrl} label="photo" height={80} />
                            <p>Road damage, {severityLabels[report.severity]} severity</p>
                            <p>Status: {statusLabels[report.status]}</p>
                            <p>
                                Priority {report.priorityScore.toFixed(1)} / {report.confirmationCount} reports
                            </p>
                            <Link to={`/reports/${report.id}`} className="sketch bg-hand-yellow px-4 py-2 text-center no-underline">
                                View details
                            </Link>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}