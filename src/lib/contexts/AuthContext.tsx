"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => {},
    refetch: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        window.location.href = "/auth/login";
    }

    useEffect(() => {
        fetchUser();
        
        const interval = setInterval(async () => {
            try {
                const res = await fetch("/api/auth/refresh", { method: "POST" });
                if (!res.ok) {
                    setUser(null);
                    window.location.href = "/auth/login";
                }
            } catch(err) {
                console.log(err)
            }
        }, 20 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refetch: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
