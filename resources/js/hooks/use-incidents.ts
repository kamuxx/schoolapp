import { useCallback } from 'react';
import { useDataFetch, type FetchParams } from './use-data-fetch';
import { index as indexRoute } from '@/routes/incidents';

export interface Incident {
    id: number;
    description: string;
    incident_date: string;
    type?: IncidentType;
    student?: Student;
}

interface IncidentType {
    id: number;
    name: string;
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
}

export function useIncidents(incidentsData: Incident[]) {
    const { data, setData, loading, fetch, refetch } = useDataFetch<Incident>(
        incidentsData,
        {
            route: indexRoute().url,
            resourceKey: 'incidents',
            errorMessage: 'Error al cargar incidencias',
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
        incidents: data,
        setIncidents: setData,
        loading,
        fetch,
        refetch,
        searchAndFetch,
        changePage,
        changeLimit,
    };
}
