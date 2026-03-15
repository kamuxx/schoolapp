import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import type { ColumnDef } from '@tanstack/react-table';
import {
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
    AlertCircle,
    CalendarRange,
    Clock,
    X,
    EyeIcon,
    BookOpenIcon,
    GraduationCap,
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { TeacherSubjectsModal } from './partials/TeacherSubjectsModal';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
    index as indexRoute,
} from '@/routes/employees/index';
import type { Page } from '@/types/page';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    employee_code: string;
    national_id_type?: string;
    national_id_number?: string;
    birth_date?: string;
    phone?: string;
    address?: string;
    gender?: string;
    photo_path?: string;
    professional_title?: string;
    hire_date?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    is_active: boolean;
    user?: { id: number; first_name: string; last_name: string; email: string };
}

interface TeacherAssignment {
    id: number;
    subject_id: number;
    section_id: number;
    subject: { id: number; name: string };
    section: { id: number; name: string; level?: { id: number; name: string } };
    schedules: {
        id: number;
        day_of_week: number;
        schedule_block_id: number;
        schedule_block: { id: number; start_time: string; end_time: string; name: string };
    }[];
}

interface CargaHorariaData {
    assignments: TeacherAssignment[];
    sections: { id: number; name: string; level: { id: number; name: string } }[];
    subjects: { id: number; name: string }[];
    blocks: { id: number; name: string; start_time: string; end_time: string }[];
}

type Responselist = {
    data: Employee[];
    recordsFiltered: number;
    recordsTotal: number;
    current_page?: number;
    per_page?: number;
};

interface Props {
    employees: Responselist;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Filiación', href: '/filiacion' },
    { title: 'Docentes', href: '/filiacion/docentes' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Employees({ employees }: Props) {
    const [employeesState, setEmployeesState] = useState<Employee[]>(
        employees.data,
    );
    const [selected, setSelected] = useState<Employee | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [ openModal, setOpenModal ] = useState<boolean>(false)
    const [ isViewing , setIsViewing  ] = useState<boolean>(false)
    
    // Carga Horaria State
    const [cargaData, setCargaData] = useState<CargaHorariaData | null>(null);
    const [loadingCarga, setLoadingCarga] = useState(false);
    const [selectedTab, setSelectedTab] = useState('general');
    const [newAssignment, setNewAssignment] = useState({
        subject_id: '',
        section_id: '',
        schedules: [] as { day_of_week: number; schedule_block_id: number }[],
    });
    const [tempSchedule, setTempSchedule] = useState({
        day_of_week: '',
        schedule_block_id: '',
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get('page') || '1', 10);
    const initialPerPage = parseInt(urlParams.get('per_page') || '10', 10);

    const [currentPage, setCurrentPage] = useState<number>(
        employees.current_page || initialPage,
    );
    const [limitPage, setLimitPage] = useState<number>(
        employees.per_page || initialPerPage,
    );
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openSubjectsModal, setOpenSubjectsModal] = useState(false);

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
        employee_code: '',
        national_id_type: 'CI',
        national_id_number: '',
        birth_date: '',
        gender: '',
        phone: '',
        address: '',
        photo: null as File | null,
        photo_path: '',
        professional_title: '',
        hire_date: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        is_active: true,
        user_id: 0,
    });

    useEffect(() => {
        if (selected) {
            setData({
                first_name: selected.user?.first_name || '',
                last_name: selected.user?.last_name || '',
                email: selected.user?.email || '',
                employee_code: selected.employee_code,
                national_id_type: selected.national_id_type || 'CI',
                national_id_number: selected.national_id_number || '',
                birth_date: selected.birth_date
                    ? selected.birth_date.split('T')[0]
                    : '',
                gender: selected.gender || '',
                phone: selected.phone || '',
                address: selected.address || '',
                photo: null,
                photo_path: selected.photo_path || '',
                professional_title: selected.professional_title || '',
                hire_date: selected.hire_date
                    ? selected.hire_date.split('T')[0]
                    : '',
                emergency_contact_name: selected.emergency_contact_name || '',
                emergency_contact_phone: selected.emergency_contact_phone || '',
                is_active: selected.is_active,
                user_id: selected.user?.id || 0,
            });
        } else {
            reset();
        }
        clearErrors();
        
        if (selected) {
            fetchCargaHoraria(selected.id);
        } else {
            setCargaData(null);
        }
    }, [selected]);

    const fetchCargaHoraria = async (employeeId: number) => {
        setLoadingCarga(true);
        try {
            const response = await axios.get(`/filiacion/carga-horaria/docente/${employeeId}/assignments`);
            if (response.status === 200) {
                const data = response.data;
                setCargaData(data);
            }
        } catch (error) {
            toast.error('Error al cargar asignaciones');
        } finally {
            setLoadingCarga(false);
        }
    };

    const handleAddAssignment = async () => {
        if (!newAssignment.subject_id || !newAssignment.section_id || !selected) {
            toast.error('Seleccione materia y sección');
            return;
        }

        try {
            const response = await axios.post('/filiacion/carga-horaria/asignar', {
                teacher_id: selected.user?.id,
                subject_id: newAssignment.subject_id,
                section_id: newAssignment.section_id,
                schedules: newAssignment.schedules,
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('Asignación guardada');
                fetchCargaHoraria(selected.id);
                setNewAssignment({ subject_id: '', section_id: '', schedules: [] });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error de red al asignar');
        }
    };

    const handleDeleteAssignment = async (assignmentId: number) => {
        try {
            const response = await axios.delete(`/filiacion/carga-horaria/eliminar/${assignmentId}`);

            if (response.status === 200 || response.status === 204) {
                toast.success('Asignación eliminada');
                if (selected) fetchCargaHoraria(selected.id);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al eliminar asignación');
        }
    };

    const daysOfWeek = [
        { id: 1, name: 'Lunes' },
        { id: 2, name: 'Martes' },
        { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' },
        { id: 5, name: 'Viernes' },
        { id: 6, name: 'Sábado' },
    ];

    useEffect(() => {
        setEmployeesState(employees.data);
        setLoading(false);
        if (!urlParams.get('page') && employees.current_page) {
            setCurrentPage(employees.current_page);
        }
        if (!urlParams.get('per_page') && employees.per_page) {
            setLimitPage(employees.per_page);
        }
    }, [employees]);

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
                        (employees.recordsTotal || 0) / limitPage,
                    ),
                });
            },
        },
        {
            label: 'Nuevo',
            icon: (
                <Icon iconNode={PlusIcon} className="h-5 w-5 text-blue-500" />
            ),
            variant: 'outline',
            onClick: () => {
                setOpenModal(true);
                setIsViewing(false);
                setSelected(null);
            },
        },
        {
            label: 'Ver',
            icon: <Icon iconNode={EyeIcon} className="h-5 w-5 text-blue-500" />,
            variant: 'outline',
            onClick: () => {
                if (selected) {
                    setOpenViewModal(true);
                } else {
                    toast.error('Seleccione un docente');
                }
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
                if (selected) {
                    setIsViewing(false);
                    setOpenModal(true);
                } else {
                    toast.error('Seleccione un registro para continuar');
                }
            },
        },
        {
            label: 'Asignar Materias',
            icon: (
                <Icon
                    iconNode={BookOpenIcon}
                    className="h-5 w-5 text-emerald-600"
                />
            ),
            variant: 'outline',
            onClick: () => {
                if (selected) {
                    setOpenSubjectsModal(true);
                } else {
                    toast.error('Seleccione un docente');
                }
            },
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

    const columns: ColumnDef<Employee>[] = [
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
            accessorKey: 'employee_code',
            header: 'Código',
            cell: ({ row }) => {
                return (
                    <div className="font-mono text-xs">
                        {row.getValue('employee_code')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'first_name',
            header: 'Nombre',
            cell: ({ row }) => {
                const employee = row.original;
                const initials = `${employee.user?.first_name?.charAt(0) || ''}${employee.user?.last_name?.charAt(0) || ''}`;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                            <AvatarImage
                                src={
                                    employee.photo_path
                                        ? `/storage/${employee.photo_path}`
                                        : ''
                                }
                                alt={employee.user?.first_name}
                            />
                            <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {employee.user?.first_name}{' '}
                                {employee.user?.last_name}
                            </span>
                            <span className="text-[10px] leading-none tracking-widest text-muted-foreground uppercase">
                                {employee.professional_title || 'Personal'}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                return (
                    <div className="text-sm">
                        {row.getValue('email') || '-'}
                    </div>
                );
            },
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) => {
                return (
                    <div className="text-sm font-medium">
                        {row.getValue('phone') ?? '-'}
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
        setEmployeesState([]);
        setLoading(true);

        // Debounce solo para búsqueda
        const delayDebounceFn = setTimeout(
            () => {
                handleSearch({
                    current_page: 1,
                    limit: limitPage,
                    offset: 0,
                    last_page: Math.ceil(
                        (employees.recordsTotal || 0) / limitPage,
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

        setEmployeesState([]);
        setLoading(true);

        const payload = {
            search: searchTerm,
            page: 1,
            per_page: limitPage,
        };

        router.get(indexRoute().url, payload, {
            only: ['employees'],
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar docentes');
                setLoading(false);
            },
        });
    }, [limitPage]);

    const handleSearch = (page: Page) => {
        setEmployeesState([]);
        setLoading(true);
        setCurrentPage(page.current_page);
        setLimitPage(page.limit);

        const payload = {
            search: searchTerm,
            page: page.current_page,
            per_page: page.limit,
        };

        router.get(indexRoute().url, payload, {
            only: ['employees'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
            onError: () => {
                toast.error('Error al cargar docentes');
                setLoading(false);
            },
        });
    };

    const handleSelect = (employee: Employee) => {
        setSelected(employee);
    };

    const handleSave = () => {
        if (
            !data.first_name ||
            !data.last_name ||
            !data.email ||
            !data.employee_code ||
            !data.gender ||
            !data.national_id_number
        ) {
            toast.error(
                'Por favor complete todos los campos obligatorios (*) incluyendo el Género y Nro. Documento',
            );
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
            <Head title="Docentes" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Docentes</h2>
                <DataTable
                    columns={columns}
                    data={employeesState}
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
                        totalRecords: employees.recordsTotal,
                        currentPage: currentPage,
                        perPage: limitPage,
                        onPageChange: handleSearch,
                    }}
                />

                {/* Modal para Crear / Editar Docente */}
                <Dialog
                    open={openModal}
                    onOpenChange={(o) => {
                        setOpenModal(o);
                        if (!o) {
                            setSelected(null);
                            setIsViewing(false);
                        }
                    }}
                >
                    <DialogContent className="flex max-h-[75dvh] w-full flex-col overflow-hidden p-4 sm:max-h-[85vh] sm:max-w-5xl sm:p-6">
                        <DialogHeader>
                            <DialogTitle>
                                Ficha del Docente / Personal
                            </DialogTitle>
                            <DialogDescription>
                                {isViewing
                                    ? 'Ver detalles'
                                    : selected
                                      ? 'Editar'
                                      : 'Nuevo'}{' '}
                                registro de personal
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs
                            defaultValue="general"
                            className="flex h-full min-h-0 w-full flex-col"
                        >
                            <TabsList className="grid w-full shrink-0 grid-cols-2">
                                <TabsTrigger value="general">
                                    Datos Personales
                                </TabsTrigger>
                                <TabsTrigger value="work">
                                    Datos Laborales
                                </TabsTrigger>
                                <TabsTrigger value="subjects">
                                    Materias y Horario
                                </TabsTrigger>
                            </TabsList>

                            <div className="min-h-0 flex-1 overflow-y-auto px-1">
                                <TabsContent
                                    value="general"
                                    className="mt-0 space-y-4 py-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
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
                                            disabled={isViewing}
                                            name="last_name"
                                            label="Apellidos"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.last_name}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
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
                                            disabled={isViewing}
                                            name="employee_code"
                                            label="Código de Empleado"
                                            value={data.employee_code}
                                            onChange={(e) =>
                                                setData(
                                                    'employee_code',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.employee_code}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
                                            name="national_id_type"
                                            label="Tipo Documento"
                                            type="select"
                                            value={data.national_id_type}
                                            onValueChange={(v) =>
                                                setData('national_id_type', v)
                                            }
                                            options={[
                                                {
                                                    label: 'Cédula Identidad (CI)',
                                                    value: 'CI',
                                                },
                                                {
                                                    label: 'Pasaporte',
                                                    value: 'PASAPORTE',
                                                },
                                                { label: 'RUT', value: 'RUT' },
                                                { label: 'DNI', value: 'DNI' },
                                            ]}
                                            error={errors.national_id_type}
                                            required
                                        />
                                        <FormField
                                            disabled={isViewing}
                                            name="national_id_number"
                                            label="Nro. Documento"
                                            value={data.national_id_number}
                                            onChange={(e) =>
                                                setData(
                                                    'national_id_number',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.national_id_number}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
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
                                                    value: 'M',
                                                },
                                                {
                                                    label: 'Femenino',
                                                    value: 'F',
                                                },
                                                { label: 'Otro', value: 'O' },
                                            ]}
                                            error={errors.gender}
                                            required
                                        />
                                        <FormField
                                            disabled={isViewing}
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
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
                                            name="phone"
                                            label="Teléfono"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            error={errors.phone}
                                        />
                                        <FormField
                                            disabled={isViewing}
                                            name="photo"
                                            label="Foto del Personal"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e: any) => {
                                                const file =
                                                    e.target.files?.[0];
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
                                        />
                                        {data.photo_path && !data.photo && (
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                Ya tiene una foto cargada
                                            </div>
                                        )}
                                    </div>
                                    <FormField
                                        disabled={isViewing}
                                        name="address"
                                        label="Dirección"
                                        type="textarea"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        error={errors.address}
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="work"
                                    className="mt-0 space-y-4 py-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
                                            name="emergency_contact_name"
                                            label="Contacto de Emergencia"
                                            value={data.emergency_contact_name}
                                            onChange={(e) =>
                                                setData(
                                                    'emergency_contact_name',
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                errors.emergency_contact_name
                                            }
                                            required
                                        />
                                        <FormField
                                            disabled={isViewing}
                                            name="emergency_contact_phone"
                                            label="Teléfono de Emergencia"
                                            type="tel"
                                            value={data.emergency_contact_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'emergency_contact_phone',
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                errors.emergency_contact_phone
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            disabled={isViewing}
                                            name="professional_title"
                                            label="Título Profesional / Especialidad"
                                            value={data.professional_title}
                                            onChange={(e) =>
                                                setData(
                                                    'professional_title',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.professional_title}
                                            placeholder="Ej. Lic. en Educación Primaria"
                                        />
                                        <FormField
                                            disabled={isViewing}
                                            name="hire_date"
                                            label="Fecha de Ingreso / Contratación"
                                            type="date"
                                            value={data.hire_date}
                                            onChange={(e) =>
                                                setData(
                                                    'hire_date',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.hire_date}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 py-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                            disabled={isViewing}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                        />
                                        <label
                                            htmlFor="is_active"
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Personal en Activo
                                        </label>
                                    </div>
                                </TabsContent>

                                <TabsContent value="subjects" className="mt-0 space-y-6 py-4">
                                    {!selected ? (
                                        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-500">
                                            <Icon iconNode={AlertCircle} className="mb-2 h-8 w-8 opacity-20" />
                                            <p className="text-sm">Guarde el docente antes de asignar materias</p>
                                        </div>
                                    ) : loadingCarga ? (
                                        <div className="flex h-40 items-center justify-center">
                                            <RefreshCwIcon className="h-8 w-8 animate-spin text-primary/20" />
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Formulario de Asignación */}
                                            {!isViewing && (
                                                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                                                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                                                        <Icon iconNode={PlusIcon} className="h-4 w-4 text-emerald-500" />
                                                        Nueva Asignación
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                        <FormField
                                                            label="Sección / Nivel"
                                                            type="select"
                                                            value={newAssignment.section_id}
                                                            onValueChange={(v) => setNewAssignment({ ...newAssignment, section_id: v })}
                                                            options={cargaData?.sections.map(s => ({
                                                                label: `${s.level.name} - ${s.name}`,
                                                                value: s.id.toString()
                                                            })) || []}
                                                        />
                                                        <FormField
                                                            label="Materia"
                                                            type="select"
                                                            value={newAssignment.subject_id}
                                                            onValueChange={(v) => setNewAssignment({ ...newAssignment, subject_id: v })}
                                                            options={cargaData?.subjects.map(s => ({
                                                                label: s.name,
                                                                value: s.id.toString()
                                                            })) || []}
                                                        />
                                                        <div className="flex items-end">
                                                            <Button 
                                                                onClick={handleAddAssignment}
                                                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                                disabled={!newAssignment.section_id || !newAssignment.subject_id}
                                                            >
                                                                Asignar Materia
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Selector de Horario para la Nueva Asignación */}
                                                    <div className="mt-4 border-t pt-4">
                                                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-3">
                                                            Definir Horario (Opcional)
                                                        </span>
                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                            <FormField
                                                                label="Día"
                                                                type="select"
                                                                value={tempSchedule.day_of_week}
                                                                onValueChange={(v) => setTempSchedule({ ...tempSchedule, day_of_week: v })}
                                                                options={daysOfWeek.map(d => ({ label: d.name, value: d.id.toString() }))}
                                                            />
                                                            <FormField
                                                                label="Bloque Horario"
                                                                type="select"
                                                                value={tempSchedule.schedule_block_id}
                                                                onValueChange={(v) => setTempSchedule({ ...tempSchedule, schedule_block_id: v })}
                                                                options={cargaData?.blocks.map(b => ({ label: `${b.name} (${b.start_time.substring(0,5)})`, value: b.id.toString() })) || []}
                                                            />
                                                            <div className="flex items-end">
                                                                <Button 
                                                                    type="button"
                                                                    variant="outline"
                                                                    className="w-full border-dashed"
                                                                    disabled={!tempSchedule.day_of_week || !tempSchedule.schedule_block_id}
                                                                    onClick={() => {
                                                                        const day = parseInt(tempSchedule.day_of_week);
                                                                        const blockId = parseInt(tempSchedule.schedule_block_id);
                                                                        
                                                                        if (newAssignment.schedules.some(s => s.day_of_week === day && s.schedule_block_id === blockId)) {
                                                                            toast.error('Este horario ya está agregado');
                                                                            return;
                                                                        }

                                                                        setNewAssignment({
                                                                            ...newAssignment,
                                                                            schedules: [...newAssignment.schedules, { day_of_week: day, schedule_block_id: blockId }]
                                                                        });
                                                                        setTempSchedule({ day_of_week: '', schedule_block_id: '' });
                                                                    }}
                                                                >
                                                                    <PlusIcon className="mr-2 h-4 w-4" /> Agregar Horario
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Lista de Horarios Pendientes */}
                                                        {newAssignment.schedules.length > 0 && (
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                {newAssignment.schedules.map((s, idx) => {
                                                                    const dayName = daysOfWeek.find(d => d.id === s.day_of_week)?.name;
                                                                    const block = cargaData?.blocks.find(b => b.id === s.schedule_block_id);
                                                                    return (
                                                                        <div key={idx} className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 border border-zinc-200">
                                                                            <span>{dayName}: {block?.name}</span>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const updatedSchedules = [...newAssignment.schedules];
                                                                                    updatedSchedules.splice(idx, 1);
                                                                                    setNewAssignment({ ...newAssignment, schedules: updatedSchedules });
                                                                                }}
                                                                                className="ml-1 text-zinc-400 hover:text-red-500"
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Listado de Asignaciones */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                                                    Materias Asignadas
                                                </h4>
                                                {cargaData?.assignments.length === 0 ? (
                                                    <p className="py-4 text-center text-xs text-muted-foreground italic">
                                                        No hay materias asignadas a este docente.
                                                    </p>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        {cargaData?.assignments.map((assignment) => (
                                                            <div key={assignment.id} className="group relative flex flex-col rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-primary/30 hover:shadow-md">
                                                                {!isViewing && (
                                                                    <button
                                                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                                                        className="absolute -top-2 -right-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition-transform hover:scale-110 group-hover:flex"
                                                                    >
                                                                        <Icon iconNode={X} className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-bold text-zinc-900">{assignment.subject.name}</span>
                                                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                                            {assignment.section.level?.name} - {assignment.section.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <Icon iconNode={Clock} className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 flex flex-wrap gap-1">
                                                                    {assignment.schedules.length > 0 ? (
                                                                        assignment.schedules.map(s => (
                                                                            <span key={s.id} className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600">
                                                                                {daysOfWeek.find(d => d.id === s.day_of_week)?.name.substring(0,3)}: {s.schedule_block.name}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-[10px] text-muted-foreground italic">Sin horario definido</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>

                        <div className="mt-4 flex shrink-0 flex-col gap-4 border-t pt-4">
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
                            <DialogFooter className="mt-2 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={() => reset()}
                                    >
                                        {isViewing ? 'Cerrar' : 'Cancelar'}
                                    </Button>
                                </DialogClose>
                                {!isViewing && (
                                    <Button
                                        onClick={handleSave}
                                        disabled={processing}
                                        className="w-full bg-zinc-900 px-6 text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95 sm:w-auto"
                                    >
                                        {processing
                                            ? 'Guardando...'
                                            : 'Guardar Ficha'}
                                    </Button>
                                )}
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal para ver Ficha de Detalles */}
                <Dialog
                    open={openViewModal}
                    onOpenChange={(o) => {
                        setOpenViewModal(o);
                        if (!o) setSelected(null);
                    }}
                >
                    <DialogContent className="w-full lg:max-w-5xl overflow-hidden p-0">
                        {selected && (
                            <div className="flex h-full flex-col md:flex-row max-h-[90vh]">
                                {/* Lateral: Perfil y Datos Personales (Franja Gris) */}
                                <div className="flex flex-col bg-zinc-50 p-8 md:w-1/3 overflow-y-auto border-r border-zinc-100">
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                            <AvatarImage
                                                src={selected.photo_path ? `/storage/${selected.photo_path}` : ''}
                                                alt={selected.first_name}
                                            />
                                            <AvatarFallback className="bg-indigo-100 text-3xl font-bold text-indigo-700">
                                                {selected.user?.first_name?.charAt(0)}{selected.user?.last_name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="mt-4 text-xl font-bold text-zinc-900">
                                            {selected.user?.first_name} {selected.user?.last_name}
                                        </h3>
                                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">
                                            {selected.employee_code}
                                        </p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 uppercase">
                                            {selected.professional_title || 'Docente'}
                                        </span>
                                    </div>

                                    <div className="mt-8 space-y-6">
                                        {/* Información de Contacto en el Lateral */}
                                        <section>
                                            <h4 className="mb-4 flex items-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                                Información Personal
                                            </h4>
                                            <div className="space-y-4 text-sm">
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</p>
                                                    <p className="font-medium text-zinc-700 break-all">{selected.user?.email || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Identificación</p>
                                                    <p className="font-medium text-zinc-700">{selected.national_id_type}: {selected.national_id_number || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Teléfono</p>
                                                    <p className="font-medium text-zinc-700">{selected.phone || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">F. Nacimiento</p>
                                                    <p className="font-medium text-zinc-700">{selected.birth_date ? new Date(selected.birth_date).toLocaleDateString() : '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Género</p>
                                                    <p className="font-medium text-zinc-700">{selected.gender === 'M' ? 'Masculino' : selected.gender === 'F' ? 'Femenino' : 'Otro'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Dirección</p>
                                                    <p className="font-medium text-zinc-700 leading-relaxed">{selected.address || '-'}</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="rounded-xl bg-indigo-50/50 p-4 border border-indigo-100">
                                            <h4 className="mb-2 text-[10px] font-bold text-indigo-900/60 uppercase tracking-wider">
                                                Datos Laborales
                                            </h4>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Estado</span>
                                                    <span className={`font-bold ${selected.is_active ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                                        {selected.is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Ingreso</span>
                                                    <span className="font-bold text-zinc-700">{selected.hire_date ? new Date(selected.hire_date).toLocaleDateString() : '-'}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="rounded-xl bg-amber-50/50 p-4 border border-amber-100">
                                            <h4 className="mb-2 text-[10px] font-bold text-amber-900/60 uppercase tracking-wider">
                                                Emergencia
                                            </h4>
                                            <div className="space-y-2 text-xs">
                                                <p className="font-bold text-amber-900">{selected.emergency_contact_name || '-'}</p>
                                                <p className="text-amber-800">{selected.emergency_contact_phone || '-'}</p>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Contenido Principal (Tabs a la Derecha) */}
                                <div className="flex-1 flex flex-col p-8 bg-white overflow-hidden">
                                    <DialogHeader className="mb-6 flex-shrink-0">
                                        <DialogTitle className="text-2xl font-bold text-zinc-900">Ficha del Docente</DialogTitle>
                                        <DialogDescription>Gestión de carga académica y actividades</DialogDescription>
                                    </DialogHeader>

                                    {loadingCarga ? (
                                        <div className="flex flex-1 items-center justify-center">
                                            <RefreshCwIcon className="h-10 w-10 animate-spin text-indigo-200" />
                                        </div>
                                    ) : (
                                        <Tabs defaultValue="materias" className="flex-1 flex flex-col overflow-hidden">
                                            <TabsList className="grid w-full bg-zinc-100 p-1 mb-6 rounded-lg h-auto" style={{
                                                gridTemplateColumns: cargaData?.assignments.length ? '1fr 1fr' : '1fr'
                                            }}>
                                                <TabsTrigger value="materias" className="py-2.5 text-xs font-bold uppercase tracking-wider">Materias a impartir</TabsTrigger>
                                                {cargaData && cargaData?.assignments.length > 0 && (
                                                    <TabsTrigger value="carga" className="py-2.5 text-xs font-bold uppercase tracking-wider">Carga Horaria</TabsTrigger>
                                                )}
                                            </TabsList>

                                            <div className="flex-1 overflow-y-auto pr-2">
                                                <TabsContent value="materias" className="mt-0 focus-visible:ring-0">
                                                    {cargaData?.assignments.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                                                            <BookOpenIcon className="h-12 w-12 text-zinc-200 mb-4" />
                                                            <p className="text-sm text-zinc-400 font-medium italic">Sin materias asignadas</p>
                                                        </div>
                                                    ) : (
                                                        <Accordion type="multiple" className="space-y-4">
                                                            {Array.from(new Set(cargaData?.assignments.map(a => a.section.level?.id))).map(levelId => {
                                                                const level = cargaData?.assignments.find(a => a.section.level?.id === levelId)?.section.level;
                                                                const levelAssignments = cargaData?.assignments.filter(a => a.section.level?.id === levelId);
                                                                
                                                                return (
                                                                    <AccordionItem key={levelId} value={`level-${levelId}`} className="border rounded-2xl px-4 bg-white shadow-sm overflow-hidden border-zinc-100">
                                                                        <AccordionTrigger className="hover:no-underline py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                                    <Icon iconNode={GraduationCap} className="h-4 w-4" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Nivel / Grado</p>
                                                                                    <h5 className="font-bold text-zinc-900 leading-none">{level?.name}</h5>
                                                                                </div>
                                                                                <span className="ml-4 px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded-full">
                                                                                    {levelAssignments?.length} Materias
                                                                                </span>
                                                                            </div>
                                                                        </AccordionTrigger>
                                                                        <AccordionContent className="pb-4 pt-2">
                                                                            <div className="space-y-2">
                                                                                {levelAssignments?.map((assignment) => (
                                                                                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 border border-zinc-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="h-8 w-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                                                                                <BookOpenIcon className="h-4 w-4" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-sm font-bold text-zinc-800">{assignment.subject.name}</p>
                                                                                                <p className="text-[10px] text-zinc-500 font-medium italic">{assignment.section.name}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-4">
                                                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase group-hover:text-indigo-400 transition-colors hidden sm:inline">Asignación Activa</span>
                                                                                            <Switch 
                                                                                                defaultChecked={true} 
                                                                                                className="data-[state=checked]:bg-indigo-600"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                );
                                                            })}
                                                        </Accordion>
                                                    )}
                                                </TabsContent>

                                                {cargaData && cargaData.assignments && cargaData.assignments.length > 0 && (
                                                    <TabsContent value="carga" className="mt-0 focus-visible:ring-0">
                                                        <div className="space-y-6">
                                                            {daysOfWeek.map(day => {
                                                                const daySchedules = cargaData?.assignments?.flatMap(a => 
                                                                    a.schedules.filter(s => s.day_of_week === day.id).map(s => ({...s, subject: a.subject}))
                                                                ).sort((a,b) => a.schedule_block.start_time.localeCompare(b.schedule_block.start_time));

                                                                if (daySchedules && daySchedules.length > 0) {
                                                                    return (
                                                                        <div key={day.id} className="relative pl-6 border-l-2 border-indigo-100 ml-2 py-2">
                                                                            <div className="absolute top-0 -left-2 h-4 w-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm ring-1 ring-indigo-500/20"></div>
                                                                            <h6 className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">{day.name}</h6>
                                                                            <div className="space-y-3">
                                                                                {daySchedules.map((s, idx) => (
                                                                                    <div key={idx} className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 hover:bg-white hover:shadow-sm transition-all">
                                                                                        <div className="text-[10px] font-bold text-zinc-400 min-w-[70px]">
                                                                                            {s.schedule_block.start_time.substring(0,5)} - {s.schedule_block.end_time.substring(0,5)}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <p className="text-xs font-bold text-zinc-800">{s.subject.name}</p>
                                                                                            <p className="text-[9px] text-zinc-500">{s.schedule_block.name}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    </TabsContent>
                                                )}
                                            </div>
                                        </Tabs>
                                    )}
                                    <div className="mt-8 flex justify-end gap-3 flex-shrink-0 border-t pt-6">
                                        <DialogClose asChild>
                                            <Button variant="ghost" className="px-6 font-semibold text-zinc-500 hover:bg-zinc-50">Cerrar</Button>
                                        </DialogClose>
                                        <Button 
                                            onClick={() => {
                                                setOpenViewModal(false);
                                                setIsViewing(false);
                                                setOpenModal(true);
                                            }}
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 px-8 font-semibold transition-all active:scale-95"
                                        >
                                            <PencilIcon className="mr-2 h-4 w-4" /> Editar Docente
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Modal para eliminar */}
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar</DialogTitle>
                            <DialogDescription>
                                ¿Eliminar a "{selected?.user?.first_name}{' '}
                                {selected?.user?.last_name}"?
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

                {/* Modal para Asignar Materias Masivamente */}
                <TeacherSubjectsModal 
                    open={openSubjectsModal}
                    onOpenChange={setOpenSubjectsModal}
                    employeeId={selected?.id || null}
                    teacherName={`${selected?.user?.first_name || ''} ${selected?.user?.last_name || ''}`}
                />
            </div>
        </AppLayout>
    );
}
