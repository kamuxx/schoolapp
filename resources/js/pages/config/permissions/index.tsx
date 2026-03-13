import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { AppPagination } from '@/components/app-pagination';
import { DataTable } from '@/components/datatable';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/form-field';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
    index as indexRoute,
} from '@/routes/permissions';
import { AppToolbar } from '@/components/app-toolbar';
import type { BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types';
import type { Page } from '@/types/page';
import { PayloadSearch } from '@/types/page';

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    group?: string | null;
    roles?: Role[];
}

type Responselist = {
    data: Permission[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};
interface Props {
    permissions: Responselist;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/config' },
    { title: 'Permisos', href: '/config/permisos' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    onClick: () => void;
};

export default function Permissions({ permissions }: Props) {
    const [permisos, setPermisosState] = useState<Permission[]>(
        permissions.data,
    );
    const [permiso, setPermisoState] = useState<Permission | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewModal, setOpenViewModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    // Obtener página inicial de URL params solo en primera carga
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        permissions.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        permissions.per_page || initialPerPage,
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
        guard_name: 'web',
        group: '',
    });

    useEffect(() => {
        if (permiso) {
            setData({
                name: permiso.name,
                guard_name: permiso.guard_name,
                group: permiso.group || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [permiso]);

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
                        (permissions.recordsTotal || 0) / limitPage,
                    ),
                });
            },
        },
        {
            label: 'Ver',
            icon: <Icon iconNode={EyeIcon} className="h-5 w-5 text-blue-500" />,
            variant: 'outline',
            onClick: () => {
                handleView();
            },
        },
        {
            label: 'Nuevo Permiso',
            icon: (
                <Icon iconNode={PlusIcon} className="h-5 w-5 text-blue-500" />
            ),
            variant: 'outline',
            onClick: () => {
                handleNew();
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
            onClick: () => {
                handleEdit();
            },
        },
        {
            label: 'Eliminar',
            icon: (
                <Icon iconNode={Trash2Icon} className="h-5 w-5 text-red-400" />
            ),
            variant: 'outline',
            onClick: () => {
                handleDelete();
            },
        },
    ];

    // Definición de columnas para DataTable
    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'row_number',
            header: '#',
            cell: ({ row }) => {
                // Calcular número de fila basado en página actual
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
                    <div className="text-sm font-semibold">
                        {row.getValue('name')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'guard_name',
            header: 'Guard Name',
            cell: ({ row }) => {
                return (
                    <div className="font-mono text-sm text-muted-foreground italic">
                        {row.getValue('guard_name')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'group',
            header: 'Grupo',
            cell: ({ row }) => {
                const group = row.getValue('group') as string | null;
                return group ? (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium tracking-wider text-blue-700 uppercase ring-1 ring-blue-600/20 ring-inset">
                        {group}
                    </span>
                ) : (
                    '-'
                );
            },
        },
    ];
    // Debounced search optimizado
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
        setPermisosState([]);
        setLoading(true);

        // Debounce solo para búsqueda, no para cambio de límite
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (permissions.recordsTotal || 0) / limitPage,
                    ),
                });
            },
            searchTerm ? 150 : 0,
        );

        searchTimeoutRef.current = delayDebounceFn;

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Activar skeleton inmediatamente para cambio de límite
        setPermisosState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['permissions'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar permisos');
                setLoading(false);
            },
        });
    }, [limitPage]);

    const handleSearch = (page: Page) => {
        setPermisosState([]);
        setLoading(true);
        setCurrentPage(page.current_page); // Actualizar currentPage local
        setLimitPage(page.limit); // Actualizar limitPage local

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['permissions'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar permisos');
                setLoading(false);
            },
        });
    };
    const handleNew = () => {
        setOpenModal(true);
        setPermisoState(null);
    };

    const handleView = () => {
        if (!permiso) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenViewModal(true);
    };
    const handleEdit = () => {
        if (!permiso) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        toast.info('Editando: ' + permiso.name);
        setOpenModal(true);
    };
    const handleDelete = () => {
        if (!permiso) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!permiso) return;
        destroy(destroyRoute(permiso.id).url, {
            onSuccess: () => {
                toast.success('Permiso eliminado correctamente');
                setOpenDeleteModal(false);
                setPermisoState(null);
            },
            onError: () => {
                toast.error('Error al eliminar el permiso');
            },
        });
    };

    const handleSave = () => {
        if (permiso) {
            patch(updateRoute(permiso.id).url, {
                onSuccess: () => {
                    toast.success('Permiso actualizado correctamente');
                    setOpenModal(false);
                    setPermisoState(null);
                },
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => {
                    toast.success('Permiso creado correctamente');
                    setOpenModal(false);
                    reset();
                },
            });
        }
    };

    const handleSelect = (permission: Permission) => {
        setPermisoState(permission);
    };

    useEffect(() => {
        setPermisosState(permissions.data);
        setLoading(false);
        // Solo actualizar desde props si no hay valores iniciales de URL
        if (!urlParams.get('page') && permissions.current_page) {
            setCurrentPage(permissions.current_page);
        }
        if (!urlParams.get('per_page') && permissions.per_page) {
            setLimitPage(permissions.per_page);
        }
    }, [permissions]);

    // Efecto para invocar handleSearch después de carga inicial
    useEffect(() => {
        // Solo ejecutar si no está cargando y hay datos de permisos
        if (!loading && permissions.data && permissions.data.length > 0) {
            handleSearch({
                current_page: currentPage,
                limit: limitPage,
                offset: (currentPage - 1) * limitPage,
                last_page: Math.ceil(
                    (permissions.recordsTotal || 0) / limitPage,
                ),
            });
        }
    }, [currentPage, limitPage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permisos" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Gestión de Permisos
                    </h2>
                </div>

                {/* Nueva implementación con DataTable */}
                <DataTable
                    columns={columns}
                    data={permisos}
                    loading={loading}
                    onRowClick={handleSelect}
                    selectedRow={permiso}
                    getRowId={(row) => row.id.toString()}
                    toolbar={{
                        paginate: true,
                        limit: limitPage,
                        search: true,
                        onLimitChange: (limit) => {
                            setLimitPage(limit);
                        },
                        onSearch: (value) => setSearchTerm(value),
                        buttons,
                    }}
                    pagination={{
                        totalRecords: permissions.recordsTotal,
                        currentPage: currentPage,
                        perPage: limitPage,
                        onPageChange: handleSearch,
                    }}
                />
                {/* Modal para ver detalle */}
                <Dialog
                    open={openViewModal}
                    onOpenChange={(open) => {
                        setOpenViewModal(open);
                        if (!open) setPermisoState(null);
                    }}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Detalle del Permiso</DialogTitle>
                            <DialogDescription>
                                Información del permiso seleccionado y roles
                                asignados.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger value="roles">Roles</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="py-4">
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            ID
                                        </Label>
                                        <span className="col-span-3">
                                            {permiso?.id}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Nombre
                                        </Label>
                                        <span className="col-span-3 font-medium">
                                            {permiso?.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Guard
                                        </Label>
                                        <span className="col-span-3">
                                            {permiso?.guard_name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Grupo
                                        </Label>
                                        <span className="col-span-3">
                                            {permiso?.group ?? 'Sin grupo'}
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="roles" className="py-4">
                                {permiso?.roles && permiso.roles.length > 0 ? (
                                    <ul className="space-y-2">
                                        {permiso.roles.map((role) => (
                                            <li
                                                key={role.id}
                                                className="flex items-center gap-2 rounded-md border p-2 text-sm shadow-sm"
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/30">
                                                    <span className="text-xs font-bold">
                                                        {role.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">
                                                        {role.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {role.guard_name}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                        Ningún rol tiene este permiso asignado.
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cerrar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* MoDal para EDitar */}
                <Dialog
                    open={openModal}
                    onOpenChange={(open) => {
                        setOpenModal(open);
                        if (!open) setPermisoState(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Permiso</DialogTitle>
                            <DialogDescription>
                                {permiso ? 'Editar' : 'Nuevo'} permiso
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="name"
                                label="Nombre del Permiso"
                                placeholder="ej. users.create"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                error={errors.name}
                                required
                            />
                            <FormField
                                name="guard_name"
                                label="Guard Name"
                                type="select"
                                value={data.guard_name}
                                onValueChange={(value) =>
                                    setData('guard_name', value)
                                }
                                error={errors.guard_name}
                                required
                                options={[
                                    { label: 'Web (Frontend)', value: 'web' },
                                    { label: 'API (Backend)', value: 'api' },
                                ]}
                            />
                            <FormField
                                name="group"
                                label="Grupo"
                                placeholder="ej. Seguridad"
                                value={data.group}
                                onChange={(e) =>
                                    setData('group', e.target.value)
                                }
                                error={errors.group}
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
                                        : 'Guardar Permiso'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal de eliminación */}
                <Dialog
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar Permiso</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar el permiso
                                "{permiso?.name}"? Esta acción no se puede
                                deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={processing}
                            >
                                {processing ? 'Eliminando...' : 'Eliminar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
