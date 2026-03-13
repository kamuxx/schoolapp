import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
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
} from '@/routes/subjects';
import type { BreadcrumbItem } from '@/types';
import type { Page } from '@/types/page';
import { PayloadSearch } from '@/types/page';

interface Subject {
    id: number;
    name: string;
    short_name: string;
    description?: string;
    credits?: number;
    level?: { id: number; name: string };
}

type Responselist = {
    data: Subject[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    subjects: Responselist;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Institucional', href: '/institucional' },
    { title: 'Materias', href: '/institucional/materias' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Subjects({ subjects }: Props) {
    const [subjectsState, setSubjectsState] = useState<Subject[]>(
        subjects.data,
    );
    const [selected, setSelected] = useState<Subject | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        subjects.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        subjects.per_page || initialPerPage,
    );
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
        setSubjectsState([]);
        setLoading(true);

        // Debounce solo para búsqueda
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (subjects.recordsTotal || 0) / limitPage,
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

        setSubjectsState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['subjects'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar materias');
                setLoading(false);
            },
        });
    }, [limitPage]);

    useEffect(() => {
        setSubjectsState(subjects.data);
        setLoading(false);
        if (!urlParams.get('page') && subjects.current_page) {
            setCurrentPage(subjects.current_page);
        }
        if (!urlParams.get('per_page') && subjects.per_page) {
            setLimitPage(subjects.per_page);
        }
    }, [subjects]);

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({ name: '', short_name: '', description: '', credits: 0 });

    useEffect(() => {
        if (selected)
            setData({
                name: selected.name,
                short_name: selected.short_name,
                description: selected.description || '',
                credits: selected.credits || 0,
            });
        else reset();
        clearErrors();
    }, [selected]);

    // Definición de columnas para el DataTable
    const columns: ColumnDef<Subject>[] = [
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
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => (
                <div className="font-semibold">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'short_name',
            header: 'Short',
            cell: ({ row }) => (
                <div className="font-mono text-sm italic">
                    {row.getValue('short_name')}
                </div>
            ),
        },
        {
            accessorKey: 'credits',
            header: 'Créditos',
            cell: ({ row }) => {
                const credits = row.getValue('credits') as number;
                return credits ? (
                    <span className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/20 ring-inset">
                        {credits} CR
                    </span>
                ) : (
                    '-'
                );
            },
        },
    ];

    const handleRefresh = () => {
        handleSearch({
            current_page: 1,
            limit: limitPage,
            offset: 0,
            last_page: Math.ceil((subjects.recordsTotal || 0) / limitPage),
        });
    };

    const handleSearch = (page: Page) => {
        setSubjectsState([]);
        setLoading(true);
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['subjects'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar materias');
                setLoading(false);
            },
        });
    };

    const handleSelect = (subject: Subject) => {
        setSelected(subject);
    };

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
            onClick: handleRefresh,
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
            <Head title="Materias" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Materias</h2>
                <DataTable
                    columns={columns}
                    data={subjectsState}
                    loading={loading}
                    onRowClick={handleSelect}
                    selectedRow={selected}
                    getRowId={(row) => row.id.toString()}
                    toolbar={{
                        search: true,
                        paginate: true,
                        limit: limitPage,
                        onSearch: setSearchTerm,
                        onLimitChange: setLimitPage,
                        buttons: buttons,
                    }}
                    pagination={{
                        totalRecords: subjects.recordsTotal,
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
                            <DialogTitle>Materia</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar' : 'Nueva'} materia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="name"
                                label="Nombre"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                error={errors.name}
                                required
                            />
                            <FormField
                                name="short_name"
                                label="Abreviatura"
                                value={data.short_name}
                                onChange={(e) =>
                                    setData('short_name', e.target.value)
                                }
                                error={errors.short_name}
                                required
                            />
                            <FormField
                                name="credits"
                                label="Créditos"
                                type="number"
                                value={String(data.credits)}
                                onChange={(e) =>
                                    setData('credits', parseInt(e.target.value))
                                }
                                error={errors.credits}
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
                                        : 'Guardar Materia'}
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
                                ¿Eliminar "{selected?.name}"?
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
