import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
    const { token, user } = useAuth();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user.role?.toLowerCase();

    if (role && userRole !== role.toLowerCase()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;