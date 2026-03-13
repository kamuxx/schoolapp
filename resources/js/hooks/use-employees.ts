import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/employees';

export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    employee_code: string;
    email?: string;
    position?: string;
    is_active: boolean;
}

export function useEmployees(employeesData: Employee[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Employee>(
        employeesData,
        {
            route: indexRoute().url,
            resourceKey: 'employees',
            errorMessage: 'Error al cargar docentes',
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
        employees: data,
        setEmployees: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
