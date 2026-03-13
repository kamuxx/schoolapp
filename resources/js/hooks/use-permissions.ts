import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/permissions';

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

export function usePermissions(permissionsData: Permission[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Permission>(
        permissionsData,
        {
            route: indexRoute().url,
            resourceKey: 'permissions',
            errorMessage: 'Error al cargar permisos',
        },
    );

    const searchAndFetch = useCallback(
        (search: string, page: number = 1, perPage: number = 10) => {
            return fetch({ search, page, per_page: perPage });
        },
        [fetch],
    );

    const changePage = useCallback(
        (page: number, perPage: number) => {
            return fetch({ page, per_page: perPage });
        },
        [fetch],
    );

    const changeLimit = useCallback(
        (limit: number) => {
            return fetch({ page: 1, per_page: limit });
        },
        [fetch],
    );

    return {
        permissions: data,
        setPermissions: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
