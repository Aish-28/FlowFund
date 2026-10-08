import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {

        if (role === "CLIENT") {
            return <Navigate to="/client-dashboard" replace />;
        }

        if (role === "FREELANCER") {
            return <Navigate to="/freelancer-dashboard" replace />;
        }

        if (role === "ADMIN") {
            return <Navigate to="/admin-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;