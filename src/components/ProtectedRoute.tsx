"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "USER";
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
        if (!loading && requiredRole && user?.role !== requiredRole) {
            router.push("/dashboard");
        }
    }, [user, loading]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }
    return <>{children}</>;
}