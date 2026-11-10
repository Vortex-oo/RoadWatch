import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './features/auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Temporary redirect to force the app to open the login page first */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Your new Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./component/Navbar";

import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import LoginPage from "./pages/LoginPage";

// Admin and Verifier imports
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
                <Route path="/login" element={<LoginPage />} />
                {/* Existing user pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/reports/:id" element={<ReportDetailPage />} />

                {/* Admin and Verifier pages */}
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

                        {/* Admin-only pages */}
                        <Route
                            element={<RequireRole allowedRoles={["admin"]} />}
                        >
                            <Route path="users" element={<UserManagement />} />
                            <Route path="analytics" element={<Analytics />} />
                        </Route>
                    </Route>
                </Route>

                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
