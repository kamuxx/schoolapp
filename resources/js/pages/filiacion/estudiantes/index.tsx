import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
    AlertCircle,
    EyeIcon,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/datatable';
import { FormField } from '@/components/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
    index as indexRoute,
} from '@/routes/students/index';
import type { Page } from '@/types/page';

interface Guardian {
    id: number;
    name: string;
    phone: string;
    relationship: string;
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    student_code: string;
    national_id_type?: string;
    birth_date?: string;
    national_id_number?: string;
    blood_type?: string;
    address?: string;
    city?: string;
    gender?: string;
    photo_path?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_relationship?: string;
    is_active: boolean;
    main_guardian?: Guardian;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}

type Responselist = {
    data: Student[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    students: Responselist;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Filiación', href: '/filiacion' },
    { title: 'Estudiantes', href: '/filiacion/estudiantes' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Students({ students }: Props) {
    const [studentsState, setStudentsState] = useState<Student[]>(
        students.data,
    );
    const [selected, setSelected] = useState<Student | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        students.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        students.per_page || initialPerPage,
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
        student_code: '',
        birth_date: '',
        national_id_number: '',
        blood_type: '',
        address: '',
        city: '',
        gender: '',
        photo_path: '',
        photo: null as File | null,
        guardian_name: '',
        guardian_phone: '',
        guardian_relationship: '',
        is_active: true,
    });

    useEffect(() => {
        if (selected) {
            setData({
                first_name: selected.first_name,
                last_name: selected.last_name,
                email: selected.user?.email || '',
                student_code: selected.student_code,
                birth_date: selected.birth_date || '',
                national_id_number: selected.national_id_number || '',
                blood_type: selected.blood_type || '',
                address: selected.address || '',
                city: selected.city || '',
                gender: selected.gender || '',
                photo_path: selected.photo_path || '',
                national_id_type: selected.national_id_type || 'CI',
                photo: null,
                guardian_name:
                    selected.main_guardian?.name ||
                    selected.guardian_name ||
                    '',
                guardian_phone:
                    selected.main_guardian?.phone ||
                    selected.guardian_phone ||
                    '',
                guardian_relationship:
                    selected.main_guardian?.relationship ||
                    selected.guardian_relationship ||
                    '',
                is_active: selected.is_active,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [selected]);

    useEffect(() => {
        setStudentsState(students.data);
        setLoading(false);
        if (!urlParams.get('page') && students.current_page) {
            setCurrentPage(students.current_page);
        }
        if (!urlParams.get('per_page') && students.per_page) {
            setLimitPage(students.per_page);
        }
    }, [students]);

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
                        (students.recordsTotal || 0) / limitPage,
                    ),
                });
            },
        },
        {
            label: 'Ver',
            icon: (
                <Icon
                    iconNode={EyeIcon}
                    className="h-5 w-5 text-blue-500"
                />
            ),
            variant: 'outline',
            onClick: () =>
                selected
                    ? setOpenViewModal(true)
                    : toast.error('Seleccione un registro para continuar'),
        },
        {
            label: 'Nuevo',
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

    const columns: ColumnDef<Student>[] = [
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
            accessorKey: 'student_code',
            header: 'Código',
            cell: ({ row }) => {
                return (
                    <div className="font-mono text-xs italic">
                        {row.getValue('student_code') || '-'}
                    </div>
                );
            },
        },
        {
            accessorKey: 'first_name',
            header: 'Nombre',
            cell: ({ row }) => {
                const student = row.original;
                const initials = `${student.first_name?.charAt(0) || ''}${student.last_name?.charAt(0) || ''}`;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                            <AvatarImage
                                src={
                                    student.photo_path
                                        ? `/storage/${student.photo_path}`
                                        : ''
                                }
                                alt={student.first_name}
                            />
                            <AvatarFallback className="bg-indigo-100 font-bold text-indigo-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {student.first_name} {student.last_name}
                            </span>
                            <span className="text-[10px] leading-none tracking-widest text-muted-foreground uppercase">
                                Estudiante
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'national_id_number',
            header: 'CI',
            cell: ({ row }) => {
                return (
                    <div className="text-sm font-medium">
                        {row.getValue('national_id_number') || '-'}
                    </div>
                );
            },
        },
        {
            accessorKey: 'city',
            header: 'Ciudad',
            cell: ({ row }) => {
                return (
                    <div className="text-xs text-muted-foreground">
                        {row.getValue('city') || '-'}
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
                        {isActive ? 'Activo' : 'Inactivo'}
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
        setStudentsState([]);
        setLoading(true);

        // Debounce solo para búsqueda
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (students.recordsTotal || 0) / limitPage,
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

        setStudentsState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['students'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar estudiantes');
                setLoading(false);
            },
        });
    }, [limitPage]);

    const handleSearch = (page: Page) => {
        setStudentsState([]);
        setLoading(true);
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['students'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar estudiantes');
                setLoading(false);
            },
        });
    };

    const handleSelect = (student: Student) => {
        setSelected(student);
    };

    const handleSave = () => {
        if (
            !data.first_name ||
            !data.last_name ||
            !data.email ||
            !data.student_code ||
            !data.gender
        ) {
            toast.error('Por favor complete todos los campos obligatorios (*)');
            return;
        }

        const url = selected ? updateRoute(selected.id).url : storeRoute().url;

        if (selected) {
            post(url, {
                _method: 'patch',
                onSuccess: () => {
                    toast.success('Actualizado');
                    setOpenModal(false);
                    setSelected(null);
                    reset();
                },
            } as any);
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Creado');
                    setOpenModal(false);
                    setSelected(null);
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estudiantes" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Estudiantes</h2>
                <DataTable
                    columns={columns}
                    data={studentsState}
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
                        totalRecords: students.recordsTotal,
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
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Ficha de Inscripción</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar' : 'Nueva'} ficha de
                                estudiante
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general">
                                    General
                                </TabsTrigger>
                                <TabsTrigger value="location">
                                    Ubicación
                                </TabsTrigger>
                                <TabsTrigger value="guardian">
                                    Representante
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="general"
                                className="space-y-4 py-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="first_name"
                                        label="Nombres"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.first_name}
                                        required
                                    />
                                    <FormField
                                        name="last_name"
                                        label="Apellidos"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        error={errors.last_name}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="email"
                                        label="Correo Electrónico"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        error={errors.email}
                                        required
                                    />
                                    <FormField
                                        name="student_code"
                                        label="Código (RUDE)"
                                        value={data.student_code}
                                        onChange={(e) =>
                                            setData(
                                                'student_code',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.student_code}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="national_id_number"
                                        label="Nro. Documento (CI)"
                                        value={data.national_id_number}
                                        onChange={(e) =>
                                            setData(
                                                'national_id_number',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.national_id_number}
                                    />
                                    <FormField
                                        name="birth_date"
                                        label="Fecha de Nacimiento"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) =>
                                            setData(
                                                'birth_date',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.birth_date}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="gender"
                                        label="Género"
                                        type="select"
                                        value={data.gender}
                                        onValueChange={(v) =>
                                            setData('gender', v)
                                        }
                                        options={[
                                            {
                                                label: 'Masculino',
                                                value: 'Masculino',
                                            },
                                            {
                                                label: 'Femenino',
                                                value: 'Femenino',
                                            },
                                            { label: 'Otro', value: 'Otro' },
                                        ]}
                                        error={errors.gender}
                                        required
                                    />
                                    <FormField
                                        name="blood_type"
                                        label="Tipo de Sangre"
                                        value={data.blood_type}
                                        onChange={(e) =>
                                            setData(
                                                'blood_type',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.blood_type}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="photo"
                                        label="Foto del Estudiante"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: any) => {
                                            const file = e.target.files?.[0];
                                            if (
                                                file &&
                                                file.size > 2 * 1024 * 1024
                                            ) {
                                                toast.error(
                                                    'La foto no debe pesar más de 2MB',
                                                );
                                                e.target.value = '';
                                                return;
                                            }
                                            setData('photo', file || null);
                                        }}
                                        error={errors.photo}
                                        description="Seleccione un archivo de imagen"
                                    />
                                    {data.photo_path && !data.photo && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Ya tiene una foto cargada
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="location"
                                className="space-y-4 py-4"
                            >
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
                                    name="address"
                                    label="Dirección de Domicilio"
                                    type="textarea"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    error={errors.address}
                                />
                            </TabsContent>

                            <TabsContent
                                value="guardian"
                                className="space-y-4 py-4"
                            >
                                <FormField
                                    name="guardian_name"
                                    label="Nombre del Representante"
                                    value={data.guardian_name}
                                    onChange={(e) =>
                                        setData('guardian_name', e.target.value)
                                    }
                                    error={errors.guardian_name}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="guardian_phone"
                                        label="Teléfono de Contacto"
                                        type="tel"
                                        value={data.guardian_phone}
                                        onChange={(e) =>
                                            setData(
                                                'guardian_phone',
                                                e.target.value,
                                            )
                                        }
                                        error={errors.guardian_phone}
                                    />
                                    <FormField
                                        name="guardian_relationship"
                                        label="Parentesco"
                                        type="select"
                                        value={data.guardian_relationship}
                                        onValueChange={(v) =>
                                            setData('guardian_relationship', v)
                                        }
                                        options={[
                                            { label: 'Padre', value: 'Padre' },
                                            { label: 'Madre', value: 'Madre' },
                                            {
                                                label: 'Tutor Legal',
                                                value: 'Tutor',
                                            },
                                            { label: 'Otro', value: 'Otro' },
                                        ]}
                                        error={errors.guardian_relationship}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

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
                                        validación. Por favor, revise los campos
                                        resaltados.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!Object.keys(errors).length && (
                                <p className="flex items-center px-1 text-[10px] text-muted-foreground">
                                    <span className="mr-1.5 font-bold text-red-600">
                                        *
                                    </span>
                                    Por favor complete todos los campos
                                    obligatorios para guardar la ficha.
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
                                        : 'Guardar Ficha'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal para ver */}
                <Dialog
                    open={openViewModal}
                    onOpenChange={(o) => {
                        setOpenViewModal(o);
                        if (!o) setSelected(null);
                    }}
                >
                    <DialogContent className="w-full lg:max-w-3xl overflow-hidden p-0">
                        {selected && (
                            <div className="flex h-full flex-col md:flex-row">
                                {/* Lateral: Perfil */}
                                <div className="flex flex-col items-center bg-zinc-50 p-8 text-center md:w-1/3">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                        <AvatarImage
                                            src={selected.photo_path ? `/storage/${selected.photo_path}` : ''}
                                            alt={selected.first_name}
                                        />
                                        <AvatarFallback className="bg-indigo-100 text-3xl font-bold text-indigo-700">
                                            {selected.first_name?.charAt(0)}{selected.last_name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="mt-4 text-xl font-bold text-zinc-900">
                                        {selected.first_name} {selected.last_name}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                                        {selected.student_code}
                                    </p>
                                    
                                    <div className="mt-6 flex w-full flex-col gap-2 border-t pt-6">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Género</span>
                                            <span className="font-semibold">{selected.gender}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Sangre</span>
                                            <span className="font-semibold text-red-600">{selected.blood_type || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Estado</span>
                                            <span className={`font-semibold ${selected.is_active ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                                {selected.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido Principal */}
                                <div className="flex-1 p-8">
                                    <DialogHeader className="mb-6">
                                        <DialogTitle className="text-2xl font-bold text-zinc-900">Ficha del Estudiante</DialogTitle>
                                        <DialogDescription>Información detallada y contactos</DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-8">
                                        {/* Datos Personales */}
                                        <section>
                                            <h4 className="mb-4 flex items-center text-sm font-bold text-zinc-900 uppercase tracking-wider">
                                                <span className="mr-2 h-4 w-1 bg-blue-500"></span>
                                                Información Personal
                                            </h4>
                                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-zinc-400 capitalize">Correo Electrónico</p>
                                                    <p className="font-medium break-words">{selected.user?.email || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-zinc-400 capitalize">Cédula de Identidad</p>
                                                    <p className="font-medium">{selected.national_id_number || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-zinc-400 capitalize">Fecha de Nacimiento</p>
                                                    <p className="font-medium">
                                                        {selected.birth_date
                                                            ? new Date(
                                                                  selected.birth_date +
                                                                      'T00:00:00',
                                                              ).toLocaleDateString(
                                                                  'es-ES',
                                                              )
                                                            : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-zinc-400 capitalize">Ciudad</p>
                                                    <p className="font-medium">{selected.city || '-'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-zinc-400 capitalize">Dirección</p>
                                                    <p className="font-medium">{selected.address || '-'}</p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Representante Legal */}
                                        <section className="rounded-xl bg-blue-50/50 p-6 ring-1 ring-blue-100">
                                            <h4 className="mb-4 flex items-center text-sm font-bold text-blue-900 uppercase tracking-wider">
                                                <Icon iconNode={EyeIcon} className="mr-2 h-4 w-4" />
                                                Representante Legal
                                            </h4>
                                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-blue-500/70 capitalize">Nombre Completo</p>
                                                    <p className="font-bold text-blue-900">{selected.main_guardian?.name || selected.guardian_name || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-500/70 capitalize">Parentesco</p>
                                                    <p className="font-bold text-blue-900">{selected.main_guardian?.relationship || selected.guardian_relationship || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-500/70 capitalize">Teléfono</p>
                                                    <p className="font-bold text-blue-900">{selected.main_guardian?.phone || selected.guardian_phone || '-'}</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <DialogFooter className="mt-8 border-t pt-6">
                                        <DialogClose asChild>
                                            <Button variant="outline" className="px-8 capitalize">Cerrar Ficha</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar</DialogTitle>
                            <DialogDescription>
                                ¿Eliminar a "{selected?.first_name || ''}{' '}
                                {selected?.last_name || ''}"?
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
