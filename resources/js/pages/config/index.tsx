import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, RefreshCwIcon, Trash2Icon, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyRoute,
    update as updateRoute,
    store as storeRoute,
    index as indexRoute,
} from '@/routes/academic-years';
import type { BreadcrumbItem } from '@/types';

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    school?: { id: number; name: string };
}
interface Props {
    academicYears: AcademicYear[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/config' },
    { title: 'Gestión Académica', href: '/config/gestion' },
    { title: 'Años Escolares', href: '/config/anios-escolares' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function AcademicYears({ academicYears }: Props) {
    const [dataState, setDataState] = useState<AcademicYear[]>([]);
    const [selected, setSelected] = useState<AcademicYear | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

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
        start_date: '',
        end_date: '',
        is_active: true,
    });

    useEffect(() => {
        if (selected) {
            setData({
                name: selected.name,
                start_date: selected.start_date,
                end_date: selected.end_date,
                is_active: selected.is_active,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [selected]);

    const buttons: ToolButtonOptions[] = [
        {
            label: 'Actualizar',
            icon: <Icon iconNode={RefreshCwIcon} className="h-5 w-5" />,
            variant: 'outline',
            onClick: () =>
                router.get(
                    indexRoute().url,
                    { search: '' },
                    { only: ['academicYears'], preserveState: true },
                ),
        },
        {
            label: 'Nuevo',
            icon: <Icon iconNode={PlusIcon} className="h-5 w-5" />,
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
                    : toast.error('Seleccione un registro'),
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
                    : toast.error('Seleccione un registro'),
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(
            () =>
                router.get(
                    indexRoute().url,
                    { search: searchTerm },
                    { only: ['academicYears'], preserveState: true },
                ),
            500,
        );
        return () => clearTimeout(timer);
    }, [searchTerm]);

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

    const confirmDelete = () =>
        selected && destroy(destroyRoute(selected.id).url, {
            onSuccess: () => {
                toast.success('Eliminado');
                setOpenDelete(false);
                setSelected(null);
            },
        });

    useEffect(() => {
        setDataState(academicYears);
    }, [academicYears]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Años Escolares" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Años Escolares</h2>
                <AppToolbar
                    search
                    onSearch={setSearchTerm}
                    buttons={buttons}
                />
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Inicio</TableHead>
                                <TableHead>Fin</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataState.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        Sin registros
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dataState.map((item, i) => (
                                    <TableRow
                                        key={item.id}
                                        onClick={() => setSelected(item)}
                                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === item.id ? 'bg-blue-500/20 ring-1 ring-blue-400 font-bold' : i % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}`}
                                    >
                                        <TableCell className="font-medium text-muted-foreground w-12 text-xs">{item.id}</TableCell>
                                        <TableCell className="font-semibold">{item.name}</TableCell>
                                        <TableCell className="text-sm">{item.start_date}</TableCell>
                                        <TableCell className="text-sm">{item.end_date}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    item.is_active 
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                                                        : 'bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-600/10'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${item.is_active ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
                                                {item.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog
                    open={openModal}
                    onOpenChange={(o) => {
                        setOpenModal(o);
                        if (!o) setSelected(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Año Escolar</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar' : 'Nuevo'} año escolar
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                name="name"
                                label="Nombre"
                                placeholder="2026"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                error={errors.name}
                                required
                            />
                            <FormField
                                name="start_date"
                                label="Fecha Inicio"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                                error={errors.start_date}
                                required
                            />
                            <FormField
                                name="end_date"
                                label="Fecha Fin"
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                                error={errors.end_date}
                                required
                            />
                        </div>
                        <div className="mt-6 flex flex-col gap-4 border-t pt-5">
                            {(Object.keys(errors).length > 0) && (
                                <Alert variant="destructive" className="bg-red-50/50 border-red-100 py-3 animate-in fade-in slide-in-from-top-2">
                                    <Icon iconNode={AlertCircle} className="h-4 w-4" />
                                    <AlertDescription className="text-[0.75rem] font-medium">
                                        Se encontraron {Object.keys(errors).length} errores de validación.
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {!Object.keys(errors).length && (
                                <p className="text-[10px] text-muted-foreground flex items-center px-1">
                                    <span className="text-red-600 font-bold mr-1.5">*</span> 
                                    Por favor complete todos los campos obligatorios para guardar.
                                </p>
                            )}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => reset()}>
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={processing}
                                    className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all active:scale-95 px-6"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Año'}
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
