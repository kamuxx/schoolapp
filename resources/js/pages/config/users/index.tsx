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
import { useEffect, useState, useRef } from 'react'; // hooks
import { toast } from 'sonner';
import { AppPagination } from '@/components/app-pagination';
import { AppToolbar } from '@/components/app-toolbar';
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
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/form-field';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
} from '@/routes/users';
import { DataTable } from '@/components/datatable';
import type { BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types';
import type { Page } from '@/types/page';
import { PayloadSearch } from '@/types/page';
import { useUsers, type User } from '@/hooks/use-users';

interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
}

interface RoleItem {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles?: RoleItem[];
    permissions?: PermissionItem[];
}

interface GroupedPermissions {
    [key: string]: PermissionItem[];
}

type Responselist = {
    data: User[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    users: Responselist;
    roles: RoleItem[];
    permissions: GroupedPermissions;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/config' },
    { title: 'Usuarios', href: '/config/usuarios' },
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

export default function Users({ users, roles, permissions }: Props) {
    const {
        users: usersState,
        setUsers: setUsersState,
        loading,
        fetch,
        changePage,
        changeLimit,
        setLoading
    } = useUsers(users.data);
    const [rolesState, setRolesState] = useState<RoleItem[]>([]);
    const [permissionsState, setPermissionsState] =
        useState<GroupedPermissions>({});
    const [user, setUserState] = useState<User | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewModal, setOpenViewModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    

    // Obtener página inicial de URL params solo en primera carga
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        users.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        users.per_page || initialPerPage,
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
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        is_active: true,
        roles: [] as number[],
        permissions: [] as number[],
    });

    useEffect(() => {
        setRolesState(roles);
    }, [roles]);

    useEffect(() => {
        setPermissionsState(permissions);
    }, [permissions]);

    useEffect(() => {
        setUsersState(users.data);
        setLoading(false);
        // Solo actualizar desde props si no hay valores iniciales de URL
        if (!urlParams.get('page') && users.current_page) {
            setCurrentPage(users.current_page);
        }
        if (!urlParams.get('per_page') && users.per_page) {
            setLimitPage(users.per_page);
        }
    }, [users]);

    useEffect(() => {
        if (user) {
            const userRoles = user.roles?.map((r) => r.id) || [];
            const userPerms = user.permissions?.map((p) => p.id) || [];
            setData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: '',
                is_active: user.is_active,
                roles: userRoles,
                permissions: userPerms,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [user]);

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
            label: 'Nuevo Usuario',
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
    const columns: ColumnDef<User>[] = [
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
            accessorKey: 'first_name',
            header: 'Nombre',
            cell: ({ row }) => {
                const firstName = row.getValue('first_name') as string;
                const lastName = (row.original as User).last_name;
                return (
                    <div className="text-sm font-semibold">
                        {firstName} {lastName}
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                return (
                    <div className="text-sm text-muted-foreground">
                        {row.getValue('email')}
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
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wider ring-1 ring-inset ${
                            isActive
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-red-600/20'
                        }`}
                    >
                        {isActive ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = (row.original as User).roles || [];
                if (roles.length === 0) {
                    return (
                        <span className="text-sm text-muted-foreground">-</span>
                    );
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.slice(0, 2).map((role) => (
                            <span
                                key={role.id}
                                className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-600/20"
                            >
                                {role.name}
                            </span>
                        ))}
                        {roles.length > 2 && (
                            <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-600/20">
                                +{roles.length - 2}
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

    // Handler para paginación
    const handlePageChange = (page: Page) => {
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);
        changePage(page.current_page, page.limit);
    };

    // Sincronizar página actual con props
    useEffect(() => {
        if (!urlParams.get('page') && users.current_page) {
            setCurrentPage(users.current_page);
        }
        if (!urlParams.get('per_page') && users.per_page) {
            setLimitPage(users.per_page);
        }
    }, [users]);
    const handleNew = () => {
        setOpenModal(true);
        setUserState(null);
    };

    const handleView = () => {
        if (!user) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenViewModal(true);
    };
    const handleEdit = () => {
        if (!user) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        toast.info('Editando: ' + user.first_name + ' ' + user.last_name);
        setOpenModal(true);
    };
    const handleDelete = () => {
        if (!user) {
            toast.error('Debe seleccionar un registro para continuar');
            return;
        }
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!user) return;
        destroy(destroyRoute(user.id).url, {
            onSuccess: () => {
                toast.success('Usuario eliminado correctamente');
                setOpenDeleteModal(false);
                setUserState(null);
            },
            onError: () => {
                toast.error('Error al eliminar el usuario');
            },
        });
    };

    const handleRoleToggle = (roleId: number, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleId]);
        } else {
            setData(
                'roles',
                data.roles.filter((id) => id !== roleId),
            );
        }
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

    const handleSave = () => {
        if (user) {
            patch(updateRoute(user.id).url, {
                onSuccess: () => {
                    toast.success('Usuario actualizado correctamente');
                    setOpenModal(false);
                    setUserState(null);
                },
            });
        } else {
            post(storeRoute().url, {
                onSuccess: () => {
                    toast.success('Usuario creado correctamente');
                    setOpenModal(false);
                    reset();
                },
            });
        }
    };

    const handleSelect = (userItem: User) => {
        setUserState(userItem);
    };

    const renderPermissionGroup = (
        moduleName: string,
        perms: PermissionItem[],
        selectedIds: number[],
        disabled: boolean = false,
        onToggle?: (id: number, checked: boolean) => void,
    ) => {
        if (perms.length === 0) return null;

        const selectedCount = perms.filter((p) =>
            selectedIds.includes(p.id),
        ).length;
        const isComplete = selectedCount === perms.length;
        const isPartial = selectedCount > 0 && selectedCount < perms.length;

        return (
            <div key={moduleName} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={isComplete}
                            onCheckedChange={(checked) => {
                                if (onToggle) {
                                    const moduleIds = perms.map((p) => p.id);
                                    if (checked) {
                                        const newPerms = [
                                            ...new Set([
                                                ...selectedIds,
                                                ...moduleIds,
                                            ]),
                                        ];
                                        moduleIds.forEach((id) =>
                                            onToggle(id, true),
                                        );
                                    } else {
                                        moduleIds.forEach((id) =>
                                            onToggle(id, false),
                                        );
                                    }
                                }
                            }}
                            disabled={disabled}
                            id={`module-${moduleName}`}
                        />
                        <Label
                            htmlFor={`module-${moduleName}`}
                            className="font-medium"
                        >
                            {moduleName || 'Sin módulo'}
                        </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {selectedCount}/{perms.length}
                    </span>
                </div>

                <div className="mt-2 space-y-2 border-l-2 border-muted pl-4">
                    {perms.map((perm) => {
                        const hasPermission = selectedIds.includes(perm.id);
                        return (
                            <div
                                key={perm.id}
                                className="flex items-center justify-between"
                            >
                                <Label
                                    className={`text-sm ${
                                        hasPermission
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {perm.name}
                                </Label>
                                <Switch
                                    checked={hasPermission}
                                    onCheckedChange={(checked) => {
                                        if (onToggle) {
                                            onToggle(perm.id, checked);
                                        }
                                    }}
                                    disabled={disabled}
                                    id={`perm-${perm.id}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderRoleGroup = (
        roleList: RoleItem[],
        selectedIds: number[],
        disabled: boolean = false,
        onToggle?: (id: number, checked: boolean) => void,
    ) => {
        if (roleList.length === 0) return null;

        return (
            <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                    <Label className="font-medium">Roles</Label>
                    <span className="text-xs text-muted-foreground">
                        ({selectedIds.length}/{roleList.length} seleccionados)
                    </span>
                </div>
                <div className="space-y-2">
                    {roleList.map((role) => {
                        const hasRole = selectedIds.includes(role.id);
                        return (
                            <div
                                key={role.id}
                                className="flex items-center justify-between"
                            >
                                <Label
                                    className={`text-sm ${
                                        hasRole
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {role.name}
                                </Label>
                                <Switch
                                    checked={hasRole}
                                    onCheckedChange={(checked) => {
                                        if (onToggle) {
                                            onToggle(role.id, checked);
                                        }
                                    }}
                                    disabled={disabled}
                                    id={`role-${role.id}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Gestión de Usuarios
                    </h2>
                </div>

                {/* Nueva implementación con DataTable */}
                <DataTable
                    columns={columns}
                    data={usersState}
                    loading={loading}
                    onRowClick={handleSelect}
                    selectedRow={user}
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
                        totalRecords: users.recordsTotal,
                        currentPage: currentPage,
                        perPage: limitPage,
                        onPageChange: handlePageChange,
                    }}
                />

                {/* Modal para ver Detalle de Usuario */}
                <Dialog
                    open={openViewModal}
                    onOpenChange={(open) => {
                        setOpenViewModal(open);
                        if (!open) setUserState(null);
                    }}
                >
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalle del Usuario</DialogTitle>
                            <DialogDescription>
                                Información del usuario seleccionado, roles y
                                permisos.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger value="roles">Roles</TabsTrigger>
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
                                            {user?.id}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Nombre
                                        </Label>
                                        <span className="col-span-3 font-medium">
                                            {user?.first_name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Apellido
                                        </Label>
                                        <span className="col-span-3">
                                            {user?.last_name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Email
                                        </Label>
                                        <span className="col-span-3">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-semibold text-muted-foreground">
                                            Estado
                                        </Label>
                                        <span className="col-span-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    user?.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {user?.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="roles"
                                className="max-h-[400px] overflow-y-auto py-4"
                            >
                                {renderRoleGroup(
                                    rolesState,
                                    user?.roles?.map((r) => r.id) || [],
                                    true,
                                )}
                            </TabsContent>

                            <TabsContent
                                value="permissions"
                                className="max-h-[400px] overflow-y-auto py-4"
                            >
                                <div className="space-y-4">
                                    {Object.entries(permissionsState).map(
                                        ([moduleName, perms]) =>
                                            renderPermissionGroup(
                                                moduleName,
                                                perms,
                                                user?.permissions?.map(
                                                    (p) => p.id,
                                                ) || [],
                                                true,
                                            ),
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cerrar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal para Crear / Editar Usuario */}
                <Dialog
                    open={openModal}
                    onOpenChange={(open) => {
                        setOpenModal(open);
                        if (!open) setUserState(null);
                    }}
                >
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Usuario</DialogTitle>
                            <DialogDescription>
                                {user ? 'Editar' : 'Nuevo'} usuario, roles y
                                permisos
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="first_name"
                                label="Nombre"
                                placeholder="ej. Juan"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                error={errors.first_name}
                                required
                            />
                            <FormField
                                name="last_name"
                                label="Apellido"
                                placeholder="ej. Pérez"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                error={errors.last_name}
                                required
                            />
                            <FormField
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="juan@ejemplo.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                error={errors.email}
                                required
                            />
                            <FormField
                                name="password"
                                label={user ? 'Nueva Contraseña' : 'Contraseña'}
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                error={errors.password}
                                required={!user}
                            />

                            <div className="mt-4">
                                <Label className="text-base font-semibold">
                                    Roles y Permisos
                                </Label>
                                <Tabs
                                    defaultValue="roles"
                                    className="mt-3 w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="roles">
                                            Roles
                                        </TabsTrigger>
                                        <TabsTrigger value="permissions">
                                            Permisos Directos
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="roles"
                                        className="max-h-[300px] overflow-y-auto py-4"
                                    >
                                        {renderRoleGroup(
                                            rolesState,
                                            data.roles,
                                            false,
                                            handleRoleToggle,
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="permissions"
                                        className="max-h-[300px] overflow-y-auto py-4"
                                    >
                                        <div className="space-y-4">
                                            {Object.entries(
                                                permissionsState,
                                            ).map(([moduleName, perms]) =>
                                                renderPermissionGroup(
                                                    moduleName,
                                                    perms,
                                                    data.permissions,
                                                    false,
                                                    handlePermissionToggle,
                                                ),
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
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
                                        : 'Guardar Usuario'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal para Eliminar Usuario */}
                <Dialog
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar Usuario</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar el usuario
                                "{user?.first_name} {user?.last_name}"? Esta
                                acción no se puede deshacer.
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
