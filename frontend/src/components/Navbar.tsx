import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        // sticky top-0: stays at the top while scrolling
        // bg-white: so the page content does not show through the navbar
        // z-[2000]: Leaflet's map layers go up to 1000, so the navbar must be higher
        <header className="sticky top-0 z-[2000] flex h-14 items-center justify-between border-b-2 border-ink bg-white px-5">
            <Link to="/" className="text-3xl no-underline">
                RoadWatch
            </Link>
            <nav className="flex gap-6">
                <Link to="/map">Map</Link>
                <Link to="/report">Report</Link>
                <Link to="/my-reports">My reports</Link>
                <Link to="/login">Login</Link>
            </nav>
        </header>
    );
}