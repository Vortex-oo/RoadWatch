import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./features/auth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import { CreateReportPage, MyReportsPage } from "./modules/citizenApp";
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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/report" element={<CreateReportPage />} />
                <Route path="/my-reports" element={<MyReportsPage />} />
                <Route path="/reports/:id" element={<ReportDetailPage />} />

                <Route element={<RequireRole allowedRoles={["admin", "verifier"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="reports" element={<ReportsTable />} />
                        <Route path="reports/:id" element={<ReportReview />} />
                        <Route path="verify" element={<VerifierQueue />} />

                        <Route element={<RequireRole allowedRoles={["admin"]} />}>
                            <Route path="users" element={<UserManagement />} />
                            <Route path="analytics" element={<Analytics />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}