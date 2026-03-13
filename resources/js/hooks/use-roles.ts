import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/roles';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: PermissionItem[];
}

interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
}

export function useRoles(rolesData: Role[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Role>(
        rolesData,
        {
            route: indexRoute().url,
            resourceKey: 'roles',
            errorMessage: 'Error al cargar roles',
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
        roles: data,
        setRoles: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
