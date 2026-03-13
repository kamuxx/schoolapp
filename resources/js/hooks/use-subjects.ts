import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/subjects';

export interface Subject {
    id: number;
    name: string;
    short: string;
    credits: number;
}

export function useSubjects(subjectsData: Subject[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Subject>(
        subjectsData,
        {
            route: indexRoute().url,
            resourceKey: 'subjects',
            errorMessage: 'Error al cargar materias',
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
        subjects: data,
        setSubjects: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
