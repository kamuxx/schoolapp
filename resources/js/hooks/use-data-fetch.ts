import { useCallback, useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export interface FetchParams {
    search?: string;
    page?: number;
    per_page?: number;
}

interface UseDataFetchOptions {
    route: string;
    resourceKey: string;
    errorMessage?: string;
}

export function useDataFetch<T>(
    initialData: T[],
    options: UseDataFetchOptions,
) {
    const {
        route,
        resourceKey,
        errorMessage = 'Error al cargar datos',
    } = options;

    const [data, setData] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    // Sincronizar datos cuando cambian las props externas (solo cuando no estamos esperando datos)
    useEffect(() => {
        if (!isFetching.current) {
            setData(initialData);
        }
    }, [initialData]);

    const fetch = useCallback(
        async (params: FetchParams) => {
            isFetching.current = true;
            setData([]);
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 100));

            router.get(route, params, {
                only: [resourceKey],
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    isFetching.current = false;
                },
                onError: () => {
                    toast.error(errorMessage);
                    setLoading(false);
                    isFetching.current = false;
                },
            });
        },
        [route, resourceKey, errorMessage],
    );

    const refetch = useCallback(
        async (page: number = 1, perPage: number = 10) => {
            await fetch({ page, per_page: perPage });
        },
        [fetch],
    );

    return {
        data,
        setData,
        loading,
        fetch,
        refetch,
        setLoading
    };
}
