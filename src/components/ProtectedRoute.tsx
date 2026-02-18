import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRole: "admin" | "student";
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (!user || !role) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
        // Redirect to the appropriate dashboard if role doesn't match
        return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
    }

    return <Outlet />;
}
