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
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { AppPagination } from '@/components/app-pagination';
import { AppToolbar } from '@/components/app-toolbar';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/form-field';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
} from '@/routes/roles';
import { PaginatedData } from '@/types';
import type { Page } from '@/types/page';
import { PayloadSearch } from '@/types/page';
import { Switch } from '@/components/ui/switch';
import { useRoles, type Role } from '@/hooks/use-roles';

interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: PermissionItem[];
}

interface GroupedPermissions {
    [key: string]: PermissionItem[];
}

type Responselist = {
    data: Role[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    roles: Responselist;
    permissions: GroupedPermissions;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/config' },
    { title: 'Roles', href: '/config/roles' },
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

export default function Roles({ roles, permissions }: Props) {
    const {
        roles: rolesState,
        setRoles: setRolesState,
        loading,
        fetch,
        changePage,
        changeLimit,
    } = useRoles(roles.data);
    const [permissionsState, setPermissionsState] =
        useState<GroupedPermissions>({});
    const [role, setRoleState] = useState<Role | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewModal, setOpenViewModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    // Obtener página inicial de URL params solo en primera carga
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        roles.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        roles.per_page || initialPerPage,
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
        permissions: [] as number[],
    });

    useEffect(() => {
        if (role) {
            const rolePermissions = role.permissions?.map((p) => p.id) || [];
            setData({
                name: role.name,
                guard_name: role.guard_name,
                permissions: rolePermissions,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [role]);

    useEffect(() => {
        setPermissionsState(permissions);
    }, [permissions]);

    // Sincronizar página actual con props cuando Inertia actualiza datos
    useEffect(() => {
        if (!urlParams.get('page') && roles.current_page) {
            setCurrentPage(roles.current_page);
        }
        if (!urlParams.get('per_page') && roles.per_page) {
            setLimitPage(roles.per_page);
        }
    }, [roles]);

    // Debounced search

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
                fetch({
                    search: searchTerm,
                    page: currentPage,
                    per_page: limitPage,
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
            label: 'Nuevo Rol',
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
    const columns: ColumnDef<Role>[] = [
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
            header: 'Guard',
            cell: ({ row }) => {
                const guardName = row.getValue('guard_name') as string;
                return (
                    <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wider ring-1 ring-inset ${
                            guardName === 'web'
                                ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                                : 'bg-purple-50 text-purple-700 ring-purple-600/20'
                        }`}
                    >
                        {guardName.toUpperCase()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'permissions',
            header: 'Permisos',
            cell: ({ row }) => {
                const permissions = (row.original as Role).permissions || [];
                if (permissions.length === 0) {
                    return (
                        <span className="text-sm text-muted-foreground">-</span>
                    );
                }
                return (
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-green-600/20">
                            {permissions.length} permisos
                        </span>
                        {permissions.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{permissions.length - 3} más
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    // Debounced search optimizado
    const [searchTerm, setSearchTerm] = useState('');
    const isFirstRender = useRef(true);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Efecto para búsqueda con debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const delayDebounceFn = setTimeout(
            () => fetch({ search: searchTerm, page: 1, per_page: limitPage }),
            searchTerm ? 150 : 0,
        );

        searchTimeoutRef.current = delayDebounceFn;

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Efecto para cambio de página
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        changePage(currentPage, limitPage);
    }, [currentPage]);

    // Efecto para cambio de límite - ir a página 1
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        changeLimit(limitPage);
    }, [limitPage]);

    // Handler para paginación (cuando se hace clic en botones de página)
    const handlePageChange = (page: Page) => {
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);
        changePage(page.current_page, page.limit);
    };

    const handleNew = () => {
        setOpenModal(true);
        setRoleState(null);
    };

    const handleView = () => {
        if (!role) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenViewModal(true);
    };
    const handleEdit = () => {
        if (!role) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        toast.info('Editando: ' + role.name);
        setOpenModal(true);
    };
    const handleDelete = () => {
        if (!role) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!role) return;
        destroy(destroyRoute(role.id).url, {
            onSuccess: () => {
                toast.success('Rol eliminado correctamente');
                setOpenDeleteModal(false);
                setRoleState(null);
            },
            onError: () => {
                toast.error('Error al eliminar el rol');
            },
        });
    };

    const handleModuleToggle = (moduleName: string, checked: boolean) => {
        const modulePermissions = permissionsState[moduleName] || [];
        const moduleIds = modulePermissions.map((p) => p.id);

        if (checked) {
            const newPermissions = [
                ...new Set([...data.permissions, ...moduleIds]),
            ];
            setData('permissions', newPermissions);
        } else {
            const newPermissions = data.permissions.filter(
                (id) => !moduleIds.includes(id),
            );
            setData('permissions', newPermissions);
        }
    };

    const handlePermissionToggle = (permissionId: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((id) => id !== permissionId),
            );
        }
    };

    const isModuleComplete = (moduleName: string): boolean => {
        const modulePermissions = permissionsState[moduleName] || [];
        const moduleIds = modulePermissions.map((p) => p.id);
        return (
            moduleIds.length > 0 &&
            moduleIds.every((id) => data.permissions.includes(id))
        );
    };

    const isModulePartial = (moduleName: string): boolean => {
        const modulePermissions = permissionsState[moduleName] || [];
        const moduleIds = modulePermissions.map((p) => p.id);
        const selectedCount = moduleIds.filter((id) =>
            data.permissions.includes(id),
        ).length;
        return selectedCount > 0 && selectedCount < moduleIds.length;
    };

    const handleSave = () => {
        if (role) {
            patch(updateRoute(role.id).url, {
                onSuccess: () => {
                    toast.success('Rol actualizado correctamente');
                    setOpenModal(false);
                    setRoleState(null);
                },
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => {
                    toast.success('Rol creado correctamente');
                    setOpenModal(false);
                    reset();
                },
            });
        }
    };

    const handleSelect = (roleItem: Role) => {
        setRoleState(roleItem);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Gestión de Roles
                    </h2>
                </div>

                {/* Nueva implementación con DataTable */}
                <DataTable
                    columns={columns}
                    data={rolesState}
                    loading={loading}
                    onRowClick={handleSelect}
                    selectedRow={role}
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
                        totalRecords: roles.recordsTotal,
                        currentPage: currentPage,
                        perPage: limitPage,
                        onPageChange: handlePageChange,
                    }}
                />

                <Dialog
                    open={openViewModal}
                    onOpenChange={(open) => {
                        setOpenViewModal(open);
                        if (!open) setRoleState(null);
                    }}
                >
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalle del Rol</DialogTitle>
                            <DialogDescription>
                                Información del rol seleccionado y permisos
                                asignados.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger value="permissions">
                                    Permisos
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="py-4">
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            ID
                                        </Label>
                                        <span className="col-span-3">
                                            {role?.id}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Nombre
                                        </Label>
                                        <span className="col-span-3 font-medium">
                                            {role?.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Guard
                                        </Label>
                                        <span className="col-span-3">
                                            {role?.guard_name}
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="permissions"
                                className="max-h-[400px] overflow-y-auto py-4"
                            >
                                {role?.permissions &&
                                role.permissions.length > 0 ? (
                                    <div className="space-y-4">
                                        {Object.entries(permissionsState).map(
                                            ([moduleName, perms]) => {
                                                const modulePerms =
                                                    perms.filter((p) =>
                                                        role.permissions?.some(
                                                            (rp) =>
                                                                rp.id === p.id,
                                                        ),
                                                    );
                                                if (modulePerms.length === 0)
                                                    return null;

                                                return (
                                                    <div
                                                        key={moduleName}
                                                        className="rounded-lg border p-3"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Label className="text-sm font-medium">
                                                                {moduleName ||
                                                                    'Sin módulo'}
                                                            </Label>
                                                            <span className="text-xs text-muted-foreground">
                                                                (
                                                                {
                                                                    modulePerms.length
                                                                }
                                                                /{perms.length})
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 space-y-2 border-l-2 border-muted pl-3">
                                                            {perms.map(
                                                                (perm) => {
                                                                    const hasPermission =
                                                                        role.permissions?.some(
                                                                            (
                                                                                p,
                                                                            ) =>
                                                                                p.id ===
                                                                                perm.id,
                                                                        );
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                perm.id
                                                                            }
                                                                            className="flex items-center justify-between"
                                                                        >
                                                                            <Label
                                                                                className={`text-sm ${
                                                                                    hasPermission
                                                                                        ? 'text-foreground'
                                                                                        : 'text-muted-foreground'
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    perm.name
                                                                                }
                                                                            </Label>
                                                                            <Switch
                                                                                checked={
                                                                                    hasPermission
                                                                                }
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                        Ningún permiso asignado a este rol.
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

                <Dialog
                    open={openModal}
                    onOpenChange={(open) => {
                        setOpenModal(open);
                        if (!open) setRoleState(null);
                    }}
                >
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Rol</DialogTitle>
                            <DialogDescription>
                                {role ? 'Editar' : 'Nuevo'} rol y permisos
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="name"
                                label="Nombre del Rol"
                                placeholder="ej. Administrador"
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

                            <div className="mt-4">
                                <Label className="text-base font-semibold">
                                    Permisos
                                </Label>
                                <div className="mt-3 space-y-4">
                                    {Object.entries(permissionsState).map(
                                        ([moduleName, perms]) => (
                                            <div
                                                key={moduleName}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={isModuleComplete(
                                                                moduleName,
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleModuleToggle(
                                                                    moduleName,
                                                                    checked,
                                                                )
                                                            }
                                                            id={`module-${moduleName}`}
                                                        />
                                                        <Label
                                                            htmlFor={`module-${moduleName}`}
                                                            className="font-medium"
                                                        >
                                                            {moduleName ||
                                                                'Sin módulo'}
                                                        </Label>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {perms.length} permisos
                                                    </span>
                                                </div>

                                                {perms.length > 0 && (
                                                    <div className="mt-3 ml-6 space-y-2 border-l-2 border-muted pl-4">
                                                        {perms.map((perm) => (
                                                            <div
                                                                key={perm.id}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <Label
                                                                    htmlFor={`perm-${perm.id}`}
                                                                    className="text-sm text-muted-foreground"
                                                                >
                                                                    {perm.name}
                                                                </Label>
                                                                <Switch
                                                                    checked={data.permissions.includes(
                                                                        perm.id,
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        handlePermissionToggle(
                                                                            perm.id,
                                                                            checked,
                                                                        )
                                                                    }
                                                                    id={`perm-${perm.id}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
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
                                        : 'Guardar Rol'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar Rol</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar el rol "
                                {role?.name}"? Esta acción no se puede deshacer.
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
