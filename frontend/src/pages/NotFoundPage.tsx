import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="mx-auto max-w-4xl px-5 py-8">
            <h1 className="mb-3 text-4xl">Page not found</h1>
            <p className="mb-5">This page does not exist or has moved.</p>
            <Link to="/" className="sketch inline-block bg-hand-blue px-4 py-2 no-underline">
                Go to the home page
            </Link>
        </div>
    );
}