"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black gap-6 text-center px-4">
      <h1 className="text-7xl font-bold">Welcome!</h1>
      <p className="text-gray-500 max-w-md">
        Manage your products, orders and users from one place.
      </p>

      {user ? (

        <div className="flex flex-col items-center gap-2">
          <p>Hello, <span className="font-semibold">{user.name}!</span></p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Go to Dashboard →
          </a>
        </div>
      ) : (

        <div className="flex gap-3">
          <a
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Log in
          </a>
          <a
            href="/auth/register"
            className="border px-6 py-2.5 rounded-xl font-semibold hover:bg-zinc-900 transition-all"

          >
            Sign up
          </a>
        </div>

      )}
    </div>
  )
}