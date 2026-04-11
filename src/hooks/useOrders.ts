import useSWR from "swr";
import { Order } from "@/lib/types";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useOrders(page = 1, limit = 10) {
    const key = `/api/orders?page=${page}&limit=${limit}`;
    const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
        refreshInterval: 15000,
    });

    async function updateStatusOptimistic(id: number, status: string) {
        const ordersArr = data.orders.map((o: Order) => o.id === id ? { ...o, status } : o)
        const optimisticData = {...data, orders: ordersArr ?? [],};
        await mutate(optimisticData, false);
        try {
            await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            await mutate();
        } catch {
            await mutate();
        }
    }

    return {
        orders: data?.orders ?? [],
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: !!error,
        mutate,
        updateStatusOptimistic,
    };
}
