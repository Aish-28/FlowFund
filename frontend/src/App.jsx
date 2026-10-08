import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/landing/Home";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./utils/ProtectedRoute";
import Registration from "./pages/auth/Registration";

export default function App() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/register" element={<Registration />} />

            <Route path="/login" element={<Login />} />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route
                path="/freelancer-dashboard"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/client-dashboard"
                element={
                    <ProtectedRoute allowedRole="CLIENT">
                        <ClientDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}