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
import { AppToolbar } from '@/components/app-toolbar';
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
} from '@/routes/schools';
import type { BreadcrumbItem } from '@/types';
import type { Page } from '@/types/page';

interface School {
    id: number;
    name: string;
    slug: string;
    country?: string;
    city?: string;
    phone?: string;
    address?: string;
    is_active: boolean;
}

type Responselist = {
    data: School[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    schools: Responselist;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/config' },
    { title: 'Gestión de Escuelas', href: '/config/escuelas' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Schools({ schools }: Props) {
    const [schoolsState, setSchoolsState] = useState<School[]>(schools.data);
    const [selected, setSelected] = useState<School | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        schools.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        schools.per_page || initialPerPage,
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
        clearErrors,
    } = useForm({
        name: '',
        slug: '',
        country: '',
        city: '',
        phone: '',
        address: '',
        is_active: true,
    });

    useEffect(() => {
        if (selected) {
            setData({
                name: selected.name,
                slug: selected.slug,
                country: selected.country || '',
                city: selected.city || '',
                phone: selected.phone || '',
                address: selected.address || '',
                is_active: selected.is_active,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [selected]);

    useEffect(() => {
        setSchoolsState(schools.data);
        setLoading(false);
        if (!urlParams.get('page') && schools.current_page) {
            setCurrentPage(schools.current_page);
        }
        if (!urlParams.get('per_page') && schools.per_page) {
            setLimitPage(schools.per_page);
        }
    }, [schools]);

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
                        (schools.recordsTotal || 0) / limitPage,
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

    const columns: ColumnDef<School>[] = [
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
            cell: ({ row }) => {
                return (
                    <div className="font-semibold">{row.getValue('name')}</div>
                );
            },
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => {
                return (
                    <div className="font-mono text-xs italic">
                        {row.getValue('slug')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'city',
            header: 'Ciudad',
            cell: ({ row }) => {
                return (
                    <div className="text-sm">{row.getValue('city') || '-'}</div>
                );
            },
        },
        {
            accessorKey: 'country',
            header: 'País',
            cell: ({ row }) => {
                return (
                    <div className="text-sm">
                        {row.getValue('country') || '-'}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Estado',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ring-1 ring-inset ${
                            isActive
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                : 'bg-zinc-50 text-zinc-700 ring-zinc-600/20'
                        }`}
                    >
                        <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                        ></span>
                        {isActive ? 'Activa' : 'Inactiva'}
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
        setSchoolsState([]);
        setLoading(true);

        // Debounce solo para búsqueda
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (schools.recordsTotal || 0) / limitPage,
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

        setSchoolsState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['schools'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar escuelas');
                setLoading(false);
            },
        });
    }, [limitPage]);

    const handleSearch = (page: Page) => {
        setSchoolsState([]);
        setLoading(true);
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['schools'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar escuelas');
                setLoading(false);
            },
        });
    };

    const handleSelect = (school: School) => {
        setSelected(school);
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

    const confirmDelete = () => {
        if (!selected) return;
        destroy(destroyRoute(selected.id).url, {
            onSuccess: () => {
                toast.success('Eliminado');
                setOpenDelete(false);
                setSelected(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Escuelas" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Gestión de Escuelas</h2>
                <DataTable
                    columns={columns}
                    data={schoolsState}
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
                        totalRecords: schools.recordsTotal,
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
                            <DialogTitle>Escuela</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar' : 'Nueva'} escuela
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
                            />
                            <FormField
                                name="slug"
                                label="Slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                error={errors.slug}
                            />
                            <FormField
                                name="country"
                                label="País"
                                value={data.country}
                                onChange={(e) =>
                                    setData('country', e.target.value)
                                }
                                error={errors.country}
                            />
                            <FormField
                                name="city"
                                label="Ciudad"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                error={errors.city}
                            />
                            <FormField
                                name="phone"
                                label="Teléfono"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                error={errors.phone}
                            />
                            <FormField
                                name="address"
                                label="Dirección"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                error={errors.address}
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
                                        : 'Guardar Escuela'}
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
                                onClick={confirmDelete}
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
