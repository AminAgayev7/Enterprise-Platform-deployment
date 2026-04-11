import useSWR from "swr";
import { Product } from "@/lib/types";
function fetcher(url: string) {
    return fetch(url).then(function (res) {
        return res.json();
    });
}

export function useProducts(page = 1, limit = 10) {

    const key = "/api/products?page=" + page + "&limit=" + limit;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
            refreshInterval: 30000,
        });

    async function deleteProduct(id: number) {
        if (data) {
            const newProducts = data.products.filter(function (p: Product) {
                    return p.id !== id;
                });

            mutate({ products: newProducts, total: data.total, totalPages: data.totalPages}, false);
        }

        try {
            await fetch("/api/products/" + id, {
                method: "DELETE",
            });
            mutate();

        } catch (err) {
            mutate();
        }
    }


    async function updateProduct(id: number, updates: any) {

        if (data) {

            const newProducts = data.products.map((p: Product) => {

                    if (p.id === id) {
                        return {
                            ...p,
                            ...updates
                        };
                    } else {
                        return p;
                    }
            });

            mutate(
                {
                    products: newProducts,
                    total: data.total,
                    totalPages: data.totalPages
                },
                false
            );
        }

        try {
            await fetch("/api/products/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            mutate();

        } catch (err) {
            mutate();
        }
    }



    let products = [];
    let total = 0;
    let totalPages = 1;

    if (data) {
        products = data.products;
        total = data.total;
        totalPages = data.totalPages;
    }

    let isError = false;

    if (error) {
        isError = true;
    }

    return {
        products: products,
        total: total,
        totalPages: totalPages,
        isLoading: isLoading,
        isError: isError,
        deleteProduct: deleteProduct,
        updateProduct: updateProduct,
        mutate: mutate,
    };
}


export function useProduct(id: number) {

    let key = null;

    if (id) {
        key = "/api/products/" + id;
    }

    const { data, error, isLoading } =
        useSWR(key, fetcher);

    let product = null;

    if (data) {
        product = data;
    }

    let isError = false;

    if (error) {
        isError = true;
    }

    return {
        product: product,
        isLoading: isLoading,
        isError: isError,
    };
}