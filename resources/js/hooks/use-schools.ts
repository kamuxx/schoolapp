import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/schools';

export interface School {
    id: number;
    name: string;
    code: string;
    address?: string;
    phone?: string;
}

export function useSchools(schoolsData: School[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<School>(
        schoolsData,
        {
            route: indexRoute().url,
            resourceKey: 'schools',
            errorMessage: 'Error al cargar escuelas',
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
        schools: data,
        setSchools: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
