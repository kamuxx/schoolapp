import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/users';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles?: RoleItem[];
    permissions?: PermissionItem[];
}

interface RoleItem {
    id: number;
    name: string;
}

interface PermissionItem {
    id: number;
    name: string;
}

export function useUsers(usersData: User[]) {
    const { data, setData, loading, fetch, refetch, setLoading } = useDataFetch<User>(
        usersData,
        {
            route: indexRoute().url,
            resourceKey: 'users',
            errorMessage: 'Error al cargar usuarios',
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
        users: data,
        setUsers: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
        setLoading
    };
}
