"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth.actions";

const initialState = { error: ""};

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerAction, initialState);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form
                action={formAction}
                className="flex flex-col gap-4 w-full max-w-md p-6 sm:p-10 border rounded-3xl shadow-lg"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Registration</h1>

                {state.error && (
                    <p className="text-red-500 text-sm text-center">{state.error}</p>
                )}
                {state.success && (
                    <p className="text-green-500 text-sm text-center">{state.success}</p>
                )}

                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="border border-gray-300 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="John Doe"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="border border-gray-300 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="example@mail.com"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium ml-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="border border-gray-300 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <div className="text-center text-sm">
                    Do you have an account ? <a href="/auth/login" className="text-blue-600 hover:underline">Log in</a>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white font-semibold rounded-xl p-2.5 mt-2 hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all w-full"
                >
                    {isPending ? "Loading..." : "Register"}
                </button>
            </form>
        </div>
    );
}