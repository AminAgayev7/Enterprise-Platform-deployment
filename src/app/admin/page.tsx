
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <h1>Admin Page</h1>
        </ProtectedRoute>
    );
}