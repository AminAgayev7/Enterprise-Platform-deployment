import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAnalytics() {
    const { data, error, isLoading, mutate } = useSWR("/api/analytics", fetcher, {
        refreshInterval: 15000,
    });

    return {
        analytics: data,
        isLoading,
        isError: !!error,
        mutate,
    };
}
