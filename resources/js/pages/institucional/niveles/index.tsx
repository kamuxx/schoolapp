import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, RefreshCwIcon, Trash2Icon, AlertCircle, EyeIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/datatable';
import type { ColumnDef } from '@tanstack/react-table';
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
    index as indexRoute,
    store as storeRoute,
    update as updateRoute,
    show as showRoute
} from '@/routes/levels';
import { LevelShowModal } from './partials/LevelShowModal';
import type { BreadcrumbItem } from '@/types';

interface Section {
    id: number;
    name: string;
}

interface Level {
    id: number;
    level_id: number; // ID de la relación polimórfica/asociativa
    name: string;
    stage: string;
    educational_stage_id: number;
    academic_year_id: number;
    educational_stage_name?: string;
    academic_year_name?: string;
    sections: Section[];
}

interface IdName {
    id: number;
    name: string;
}

interface Props {
    levels: Level[];
    catalogLevels: { id: number; name: string }[];
    academicYears: IdName[];
    educationalStages: any[]; // Recibido del controlador aunque esté vacío
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Institucional', href: '/institucional/perfil' },
    { title: 'Niveles', href: '/institucional/niveles' },
];

type ToolButtonOptions = {
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: () => void;
};

export default function Levels({ levels, catalogLevels, academicYears, educationalStages }: Props) {
    const [selected, setSelected] = useState<Level | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [levelToShow, setLevelToShow] = useState<any>(null);
    
    // Parallels management
    const [parallelsCount, setParallelsCount] = useState(1);

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
        level_id: '',
        academic_year_id: (academicYears.find(y => true)?.id || '').toString(),
        parallels: [{ name: 'A' }],
    });

    useEffect(() => {
        if (selected) {
            setData({
                level_id: selected.level_id?.toString() || '',
                academic_year_id: selected.academic_year_id.toString(),
                parallels: selected.sections.map(s => ({ name: s.name })), 
            });
            setParallelsCount(selected.sections?.length || 1);
        } else {
            reset();
            setParallelsCount(1);
        }
        clearErrors();
    }, [selected]);

    // Update parallels dynamically (corregido y simplificado)
    useEffect(() => {
        if (selected) return; 

        const count = Math.max(1, parallelsCount);
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const newParallels = Array.from({ length: count }, (_, i) => ({
            name: i < alphabet.length ? alphabet[i] : `Sección ${i+1}`
        }));
        
        setData('parallels', newParallels);
    }, [parallelsCount, selected]);

    const buttons: ToolButtonOptions[] = [
        {
            label: 'Actualizar',
            icon: <Icon iconNode={RefreshCwIcon} className="h-5 w-5" />,
            variant: 'outline',
            onClick: () =>
                router.get(
                    indexRoute().url,
                    {},
                    { only: ['levels'], preserveState: true },
                ),
        },
        {
            label: 'Configurar Nivel',
            icon: <Icon iconNode={PlusIcon} className="h-5 w-5" />,
            variant: 'outline',
            onClick: () => {
                setSelected(null);
                setOpenModal(true);
            },
        },
        {
            label: 'Ver Ficha',
            icon: <Icon iconNode={EyeIcon} className="h-5 w-5 text-blue-600" />,
            variant: 'outline',
            onClick: () => {
                if (!selected) return toast.error('Seleccione un nivel');
                fetchShow(selected.id);
            }
        },
        // ... (resto de botones omitidos por brevedad pero se mantienen)
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
                selected ? setOpenModal(true) : toast.error('Seleccione un nivel'),
        },
        {
            label: 'Eliminar',
            icon: (
                <Icon iconNode={Trash2Icon} className="h-5 w-5 text-red-400" />
            ),
            variant: 'outline',
            onClick: () =>
                selected ? setOpenDelete(true) : toast.error('Seleccione un nivel'),
        },
    ];

    const columns: ColumnDef<Level>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue('id')}</span>,
            size: 50,
        },
        {
            accessorKey: 'name',
            header: 'Nivel (Grado)',
            cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
        },
        {
            accessorKey: 'educational_stage_name',
            header: 'Etapa Educativa',
            cell: ({ row }) => <span className="text-sm">{row.getValue('educational_stage_name') || '-'}</span>,
        },
        {
            accessorKey: 'academic_year_name',
            header: 'Año Académico',
            cell: ({ row }) => <span className="text-sm">{row.getValue('academic_year_name') || '-'}</span>,
        },
        {
            accessorKey: 'sections',
            header: 'Paralelos',
            cell: ({ row }) => (
                <div className="flex gap-1.5 flex-wrap">
                    {row.original.sections?.map(s => (
                        <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 shadow-sm transition-all hover:scale-105">
                            {s.name}
                        </span>
                    ))}
                </div>
            ),
        }
    ];

    const handleSave = () => {
        const action = selected ? patch : post;
        const url = selected ? updateRoute(selected.id).url : storeRoute().url;
        
        action(url, {
            onSuccess: () => {
                toast.success(selected ? 'Nivel actualizado' : 'Nivel y paralelos creados');
                setOpenModal(false);
                setSelected(null);
                reset();
            },
        });
    };

    const fetchShow = async (id: number) => {
        try {
            const response = await fetch(showRoute(id).url);
            const detail = await response.json();
            setLevelToShow(detail);
            setOpenShow(true);
        } catch (error) {
            toast.error('Error al cargar detalle');
        }
    };

    const confirmDelete = () => {
        if(!selected) return;
        
        destroy(destroyRoute(selected.id).url, {
            onSuccess: () => {
                toast.success('Nivel eliminado');
                setOpenDelete(false);
                setSelected(null);
            },
        });
    }

    const addParallel = () => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nextIndex = data.parallels.length;
        const nextName = nextIndex < alphabet.length ? alphabet[nextIndex] : `Sección ${nextIndex + 1}`;
        setData('parallels', [...data.parallels, { name: nextName }]);
    };

    const removeParallel = (index: number) => {
        const newParallels = data.parallels.filter((_, i) => i !== index);
        setData('parallels', newParallels);
    };

    const yearOptions = academicYears.map(ay => ({ value: ay.id.toString(), label: ay.name }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Niveles y Paralelos" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Gestión de Niveles y Paralelos</h2>
                
                <DataTable
                    columns={columns}
                    data={levels}
                    onRowClick={(row) => setSelected(row)}
                    selectedRow={selected}
                    toolbar={{
                        search: true,
                        buttons: buttons
                    }}
                />

                {/* MODAL CREAR / EDITAR */}
                <Dialog
                    open={openModal}
                    onOpenChange={(o) => {
                        setOpenModal(o);
                        if (!o) setSelected(null);
                    }}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Nivel / Grado</DialogTitle>
                            <DialogDescription>
                                {selected ? 'Editar nivel' : 'Crear nuevo nivel y sus secciones (paralelos)'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                            <FormField
                                name="level_id"
                                type="select"
                                label="Seleccionar Nivel del Catálogo"
                                value={data.level_id}
                                options={catalogLevels.map(cl => ({ value: cl.id.toString(), label: cl.name }))}
                                onChange={(e) => setData('level_id', e.target.value)}
                                error={errors.level_id}
                                required
                                disabled={!!selected} // No permitimos cambiar el nivel base una vez configurado
                            />
                            
                            <div className="grid grid-cols-1">
                                <FormField
                                    name="academic_year_id"
                                    type="select"
                                    label="Año Académico"
                                    value={data.academic_year_id}
                                    options={academicYears.map(ay => ({ value: ay.id.toString(), label: ay.name }))}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    error={errors.academic_year_id}
                                    required
                                />
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-zinc-700 font-mono tracking-tighter uppercase underline underline-offset-4 decoration-blue-500/30">
                                        Gestión de Paralelos (Secciones)
                                    </h3>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={addParallel}
                                        className="h-7 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
                                    >
                                        <PlusIcon className="h-3 w-3 mr-1" /> Agregar
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {data.parallels?.map((p, index) => (
                                        <div key={index} className="relative group animate-in fade-in zoom-in-95 duration-200">
                                            <FormField
                                                name={`parallels_${index}`}
                                                label={`Paralelo ${index + 1}`}
                                                value={p.name}
                                                onChange={(e) => {
                                                    const newParallels = [...data.parallels];
                                                    newParallels[index].name = e.target.value.toUpperCase();
                                                    setData('parallels', newParallels);
                                                }}
                                                error={errors[`parallels.${index}.name` as keyof typeof errors]}
                                            />
                                            {data.parallels.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeParallel(index)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-3 bg-zinc-50 p-2 rounded border border-zinc-100 italic">
                                    Puede editar los nombres de los paralelos o agregar/quitar secciones según la necesidad del año académico.
                                </p>
                            </div>
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
                                    {processing ? 'Guardando...' : 'Guardar Nivel'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
                
                <LevelShowModal 
                    open={openShow} 
                    onOpenChange={setOpenShow} 
                    level={levelToShow} 
                />

                {/* MODAL ELIMINAR */}
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar Nivel</DialogTitle>
                            <DialogDescription>
                                ¿Está seguro de eliminar el nivel "{selected?.name}" y todas sus secciones asociadas? Esta acción no se puede deshacer.
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
