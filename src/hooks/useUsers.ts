import useSWR from "swr";
import { User } from "@/lib/types";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUsers(page = 1, limit = 10) {
    const key = `/api/users?page=${page}&limit=${limit}`;
    const { data, error, isLoading, mutate } = useSWR(key, fetcher);

    async function deleteUserOptimistic(id: number) {
        const optimisticData = {
            ...data,
            users: data?.users?.filter((u: User) => u.id !== id) ?? [],
        };
        await mutate(optimisticData, false);
        try {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            await mutate();
        } catch {
            await mutate();
        }
    }

    async function updateUserOptimistic(id: number, updates: any) {
        const optimisticData = {
            ...data,
            users: data?.users?.map((u: User) =>
                u.id === id ? { ...u, ...updates } : u
            ) ?? [],
        };
        await mutate(optimisticData, false);
        try {
            await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            await mutate();
        } catch {
            await mutate();
        }
    }

    return {
        users: data?.users ?? [],
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: !!error,
        mutate,
        deleteUserOptimistic,
        updateUserOptimistic,
    };
}
