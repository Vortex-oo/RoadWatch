import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing authentication pages
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
} from "./features/auth";

// Existing public pages
import Navbar from "./component/Navbar";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportDetailPage from "./pages/ReportDetailPage";

// Admin and Verifier pages
import { AdminLayout, RequireRole } from "./admin/AdminApp";

import {
    AdminDashboard,
    ReportsTable,
    ReportReview,
    VerifierQueue,
    UserManagement,
    Analytics,
} from "./admin/AdminPages";


export default function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/reports/:id" element={<ReportDetailPage />} />

                {/* Authentication pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Admin and Verifier */}
                <Route
                    element={
                        <RequireRole allowedRoles={["admin", "verifier"]} />
                    }
                >
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="reports" element={<ReportsTable />} />
                        <Route path="reports/:id" element={<ReportReview />} />
                        <Route path="verify" element={<VerifierQueue />} />

                        {/* Admin only */}
                        <Route
                            element={<RequireRole allowedRoles={["admin"]} />}
                        >
                            <Route path="users" element={<UserManagement />} />
                            <Route path="analytics" element={<Analytics />} />
                        </Route>
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
