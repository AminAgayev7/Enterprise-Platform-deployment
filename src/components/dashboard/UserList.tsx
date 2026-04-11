"use client";
import { User } from "@/lib/types";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/lib/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/ui/Pagination";

export default function UserList() {
    const [page, setPage] = useState(1);
    const { user: currentUser } = useAuth();
    const { users, totalPages, isLoading, isError, mutate, deleteUserOptimistic, updateUserOptimistic } = useUsers(page);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <ErrorMessage message="Users not loaded." onRetry={mutate} />;
    }
    if (users.length === 0) {
        return <p className="text-gray-400 text-sm">No users.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {users.map((u: User) => (
                <div key={u.id} className="flex justify-between items-center border rounded-xl px-4 py-3 text-sm hover:bg-gray-50 transition gap-4">
                    <div className="flex flex-col flex-1">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-gray-400 text-xs">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                            {u.role}
                        </span>
                        {currentUser?.role === "ADMIN" && currentUser.id !== u.id && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateUserOptimistic(u.id, { role: u.role === "ADMIN" ? "USER" : "ADMIN" })}
                                    className="text-xs text-blue-500 hover:underline"
                                >
                                    {u.role === "ADMIN" ? "→ USER" : "→ ADMIN"}
                                </button>
                                <button
                                    onClick={() => deleteUserOptimistic(u.id)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
