"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 sticky top-0 z-50">
            <div className="text-4xl">Storex</div>

            <div className="flex flex-wrap gap-4 items-center">
                <Link href="/" className="hover:text-blue-500">Home</Link>
                {user && <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>}
                {!loading && (
                    <>
                        {user ? (
                            <>
                                <span className="text-sm border rounded-full p-3">
                                    <i className="fa-regular fa-user"></i>{user.name}
                                    {user.role === "ADMIN" && (
                                        <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="hover:text-blue-500">Log in</Link>
                                <Link href="/auth/register" className="hover:text-blue-500">Sign Up</Link>
                            </>
                        )}
                        
                    </>
                )}
            </div>
        </nav>
    );
}