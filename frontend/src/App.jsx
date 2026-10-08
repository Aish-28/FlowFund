import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/landing/Home";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import AdminLogin from "./pages/auth/AdminLogin";
import Payments from "./pages/client/Payments";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import Wallet from "./pages/client/Wallet";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./utils/ProtectedRoute";
import Transactions from "./pages/client/Transactions";
import FreelancerWallet from "./pages/freelancer/Wallet";
import FreelancerPayments from "./pages/freelancer/Payments";
import FreelancerTransactions from "./pages/freelancer/Transactions";
import FreelancerPayout from "./pages/freelancer/Payout";

export default function App() {
    return (
        <Routes>
            {/* Landing */}
            <Route path="/" element={<Home />} />

            {/* Authentication */}
            <Route
                path="/register"
                element={<Registration />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* Freelancer */}
            <Route
                path="/freelancer-dashboard"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/freelancer-wallet"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerWallet />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/freelancer-payments"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerPayments />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/freelancer-transactions"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerTransactions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/freelancer-payout"
                element={
                    <ProtectedRoute allowedRole="FREELANCER">
                        <FreelancerPayout />
                    </ProtectedRoute>
                }
            />

            {/* Client */}
            <Route
                path="/client-dashboard"
                element={
                    <ProtectedRoute allowedRole="CLIENT">
                        <ClientDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/client-wallet"
                element={
                    <ProtectedRoute allowedRole="CLIENT">
                        <Wallet />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/client-payments"
                element={
                    <ProtectedRoute allowedRole="CLIENT">
                        <Payments />
                    </ProtectedRoute>
                }
            />

            <Route
              path="/client-transactions"
              element={
                  <ProtectedRoute allowedRole="CLIENT">
                      <Transactions />
                  </ProtectedRoute>
              }
          />

            {/* Admin */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}