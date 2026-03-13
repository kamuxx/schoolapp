import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
    AlertTriangleIcon,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/datatable';
import { FormField } from '@/components/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
    index as indexRoute,
} from '@/routes/incidents';
import type { BreadcrumbItem } from '@/types';
import type { Page } from '@/types/page';

interface Incident {
    id: number;
    incident_date: string;
    observation: string;
    requires_commitment: boolean;
    student?: {
        id: number;
        first_name: string;
        last_name: string;
        student_code: string;
    };
    incidentType?: { id: number; name: string };
}

type Responselist = {
    data: Incident[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface IncidentType {
    id: number;
    name: string;
}

interface Props {
    incidents: Responselist;
    incidentTypes: IncidentType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gestión Escolar', href: '/gestion-escolar' },
    { title: 'Incidencias', href: '/gestion-escolar/incidencias' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Incidents({ incidents, incidentTypes }: Props) {
    const [incidentsState, setIncidentsState] = useState<Incident[]>(
        incidents.data,
    );
    const [typesState, setTypesState] = useState<IncidentType[]>(incidentTypes);
    const [selected, setSelected] = useState<Incident | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        incidents.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        incidents.per_page || initialPerPage,
    );

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        student_id: 0,
        incident_type_id: 0,
        incident_date: '',
        observation: '',
        requires_commitment: false,
    });

    useEffect(() => {
        setTypesState(incidentTypes);
    }, [incidentTypes]);

    useEffect(() => {
        setIncidentsState(incidents.data);
        setLoading(false);
        if (!urlParams.get('page') && incidents.current_page) {
            setCurrentPage(incidents.current_page);
        }
        if (!urlParams.get('per_page') && incidents.per_page) {
            setLimitPage(incidents.per_page);
        }
    }, [incidents]);

    const buttons: ToolButtonOptions[] = [
        {
            label: 'Actualizar',
            icon: (
                <Icon
                    iconNode={RefreshCwIcon}
                    className="h-5 w-5 text-blue-500"
                />
            ),
            variant: 'outline',
            onClick: () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (incidents.recordsTotal || 0) / limitPage,
                    ),
                });
            },
        },
        {
            label: 'Nueva',
            icon: (
                <Icon iconNode={PlusIcon} className="h-5 w-5 text-blue-500" />
            ),
            variant: 'outline',
            onClick: () => {
                setOpenModal(true);
                setSelected(null);
            },
        },
        {
            label: 'Editar',
            icon: (
                <Icon
                    iconNode={PencilIcon}
                    className="h-5 w-5 text-amber-700"
                />
            ),
            variant: 'outline',
            onClick: () =>
                selected
                    ? setOpenModal(true)
                    : toast.error('Seleccione un registro para continuar'),
        },
        {
            label: 'Eliminar',
            icon: (
                <Icon iconNode={Trash2Icon} className="h-5 w-5 text-red-400" />
            ),
            variant: 'outline',
            onClick: () =>
                selected
                    ? setOpenDelete(true)
                    : toast.error('Seleccione un registro para continuar'),
        },
    ];

    const columns: ColumnDef<Incident>[] = [
        {
            accessorKey: 'row_number',
            header: '#',
            cell: ({ row }) => {
                const rowNumber = (currentPage - 1) * limitPage + row.index + 1;
                return (
                    <div className="w-8 text-center text-xs font-medium text-muted-foreground">
                        {rowNumber}
                    </div>
                );
            },
        },
        {
            accessorKey: 'incident_date',
            header: 'Fecha',
            cell: ({ row }) => {
                return (
                    <div className="text-sm font-medium">
                        {row.getValue('incident_date')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'student',
            header: 'Estudiante',
            cell: ({ row }) => {
                const student = row.original.student;
                return (
                    <div className="font-semibold">
                        {student?.first_name} {student?.last_name}
                    </div>
                );
            },
        },
        {
            accessorKey: 'incidentType',
            header: 'Tipo',
            cell: ({ row }) => {
                const type = row.original.incidentType;
                return (
                    <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-800 uppercase ring-1 ring-zinc-600/20 ring-inset">
                        {type?.name}
                    </span>
                );
            },
        },
        {
            accessorKey: 'observation',
            header: 'Observación',
            cell: ({ row }) => {
                return (
                    <div className="max-w-[200px] truncate text-sm text-muted-foreground italic">
                        {row.getValue('observation')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'requires_commitment',
            header: 'Compromiso',
            cell: ({ row }) => {
                const requires = row.getValue('requires_commitment') as boolean;
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            requires
                                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 ring-inset'
                                : 'bg-zinc-50 text-zinc-600 ring-1 ring-zinc-600/10 ring-inset'
                        }`}
                    >
                        {requires ? 'Requiere' : 'No'}
                    </span>
                );
            },
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const isFirstRender = useRef(true);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Limpiar timeout anterior de búsqueda
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Activar skeleton inmediatamente para cambio de página
        setIncidentsState([]);
        setLoading(true);

        // Debounce solo para búsqueda
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (incidents.recordsTotal || 0) / limitPage,
                    ),
                });
            },
            searchTerm ? 150 : 0,
        );

        searchTimeoutRef.current = delayDebounceFn;

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Efecto separado para cambio de límite - skeleton inmediato
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIncidentsState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['incidents'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar incidencias');
                setLoading(false);
            },
        });
    }, [limitPage]);

    const handleSearch = (page: Page) => {
        setIncidentsState([]);
        setLoading(true);
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['incidents'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar incidencias');
                setLoading(false);
            },
        });
    };

    const handleSelect = (incident: Incident) => {
        setSelected(incident);
    };

    const handleSave = () => {
        const action = selected ? patch : post;
        const url = selected ? updateRoute(selected.id).url : storeRoute().url;
        action(url, {
            onSuccess: () => {
                toast.success(selected ? 'Actualizado' : 'Creado');
                setOpenModal(false);
                setSelected(null);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidencias" />
            <div className="space-y-4 p-4">
                <div className="flex items-center gap-2">
                    <Icon
                        iconNode={AlertTriangleIcon}
                        className="h-6 w-6 text-amber-500"
                    />
                    <h2 className="text-xl font-semibold">
                        Incidencias y Penalidades
                    </h2>
                </div>
                <DataTable
                    columns={columns}
                    data={incidentsState}
                    loading={loading}
                    onRowClick={handleSelect}
                    selectedRow={selected}
                    getRowId={(row) => row.id.toString()}
                    toolbar={{
                        paginate: true,
                        limit: limitPage,
                        search: true,
                        onLimitChange: (limit) => setLimitPage(limit),
                        onSearch: (value) => setSearchTerm(value),
                        buttons,
                    }}
                    pagination={{
                        totalRecords: incidents.recordsTotal,
                        currentPage: currentPage,
                        perPage: limitPage,
                        onPageChange: handleSearch,
                    }}
                />

                <Dialog
                    open={openModal}
                    onOpenChange={(o) => {
                        setOpenModal(o);
                        if (!o) setSelected(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Incidencia</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar' : 'Nueva'} incidencia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="incident_date"
                                label="Fecha"
                                type="date"
                                value={data.incident_date}
                                onChange={(e) =>
                                    setData('incident_date', e.target.value)
                                }
                                error={errors.incident_date}
                                required
                            />
                            <FormField
                                name="incident_type_id"
                                label="Tipo"
                                type="select"
                                value={String(data.incident_type_id)}
                                onValueChange={(v) =>
                                    setData('incident_type_id', Number(v))
                                }
                                options={typesState.map((t) => ({
                                    label: t.name,
                                    value: String(t.id),
                                }))}
                                error={errors.incident_type_id}
                                required
                            />
                            <FormField
                                name="observation"
                                label="Observación"
                                value={data.observation}
                                onChange={(e) =>
                                    setData('observation', e.target.value)
                                }
                                error={errors.observation}
                                required
                            />
                        </div>
                        <div className="mt-6 flex flex-col gap-4 border-t pt-5">
                            {Object.keys(errors).length > 0 && (
                                <Alert
                                    variant="destructive"
                                    className="animate-in border-red-100 bg-red-50/50 py-3 fade-in slide-in-from-top-2"
                                >
                                    <Icon
                                        iconNode={AlertCircle}
                                        className="h-4 w-4"
                                    />
                                    <AlertDescription className="text-[0.75rem] font-medium">
                                        Se encontraron{' '}
                                        {Object.keys(errors).length} errores de
                                        validación.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!Object.keys(errors).length && (
                                <p className="flex items-center px-1 text-[10px] text-muted-foreground">
                                    <span className="mr-1.5 font-bold text-red-600">
                                        *
                                    </span>
                                    Por favor complete todos los campos
                                    obligatorios para guardar.
                                </p>
                            )}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        onClick={() => reset()}
                                    >
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={handleSave}
                                    disabled={processing}
                                    className="bg-zinc-900 px-6 text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar Incidencia'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar</DialogTitle>
                            <DialogDescription>
                                ¿Eliminar esta incidencia?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    selected &&
                                    destroy(destroyRoute(selected.id).url, {
                                        onSuccess: () => {
                                            toast.success('Eliminado');
                                            setOpenDelete(false);
                                            setSelected(null);
                                        },
                                    })
                                }
                            >
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
