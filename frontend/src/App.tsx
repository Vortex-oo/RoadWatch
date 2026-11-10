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