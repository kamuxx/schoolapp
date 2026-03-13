import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/students';

export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    student_code: string;
    email?: string;
    is_active: boolean;
}

export function useStudents(studentsData: Student[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Student>(
        studentsData,
        {
            route: indexRoute().url,
            resourceKey: 'students',
            errorMessage: 'Error al cargar estudiantes',
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
        students: data,
        setStudents: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
