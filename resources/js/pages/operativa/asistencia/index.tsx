import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import { SaveIcon, RefreshCwIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { AppToolbar } from '@/components/app-toolbar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { store as storeRoute, index as indexRoute } from '@/routes/attendances';

interface Attendance {
    id: number;
    date: string;
    status: string;
    student?: {
        id: number;
        first_name: string;
        last_name: string;
        student_code: string;
    };
}
interface Section {
    id: number;
    name: string;
    level?: string;
}
interface Props {
    attendances: Attendance[];
    sections: Section[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Operativa', href: '/operativa' },
    { title: 'Asistencia Diaria', href: '/operativa/asistencia' },
];

export default function Attendances({ attendances, sections }: Props) {
    const [dataState, setDataState] = useState<Attendance[]>([]);
    const [sectionsState, setSectionsState] = useState<Section[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0],
    );
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        date: selectedDate,
        section_id: 0,
        records: [] as { student_id: number; status: string }[],
    });

    useEffect(() => {
        setSectionsState(sections);
    }, [sections]);
    useEffect(() => {
        setDataState(attendances);
    }, [attendances]);

    const buttons = [
        {
            label: 'Cargar',
            icon: <Icon iconNode={SaveIcon} className="h-5 w-5" />,
            variant: 'default' as const,
            onClick: handleSave,
        },
        {
            label: 'Actualizar',
            icon: <Icon iconNode={RefreshCwIcon} className="h-5 w-5" />,
            variant: 'outline' as const,
            onClick: loadData,
        },
    ];

    function loadData() {
        if (!selectedSection) return toast.error('Seleccione una sección');
        setLoading(true);
        router.get(
            indexRoute().url,
            { date: selectedDate, section_id: selectedSection },
            {
                only: ['attendances'],
                preserveState: true,
                onFinish: () => setLoading(false),
            },
        );
    }

    function handleStatusChange(studentId: number, status: string) {
        const records = [...data.records];
        const idx = records.findIndex((r) => r.student_id === studentId);
        if (idx >= 0) records[idx].status = status;
        else records.push({ student_id: studentId, status });
        setData('records', records);
    }

    function handleSave() {
        if (!selectedSection) return toast.error('Seleccione una sección');
        if (data.records.length === 0) return toast.error('No hay registros');
        setData({
            date: selectedDate,
            section_id: selectedSection,
            records: data.records,
        });
        post(storeRoute().url, {
            onSuccess: () => {
                toast.success('Guardado');
                reset();
            },
        });
    }

    const statusColors: Record<string, string> = {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        late: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asistencias" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">
                    Control de Asistencias
                </h2>

                <div className="flex items-end gap-4">
                    <div className="grid gap-1">
                        <Label>Fecha</Label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label>Sección</Label>
                        <select
                            value={selectedSection || ''}
                            onChange={(e) =>
                                setSelectedSection(Number(e.target.value))
                            }
                            className="min-w-[200px] rounded border px-3 py-2"
                        >
                            <option value="">Seleccionar...</option>
                            {sectionsState.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.level})
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={loadData} variant="outline">
                        Buscar
                    </Button>
                </div>

                <AppToolbar buttons={buttons} />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Estudiante</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-48 text-center"
                                    >
                                        <RefreshCwIcon className="h-5 w-5 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : dataState.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center"
                                    >
                                        Sin registros - Seleccione sección y
                                        fecha
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dataState.map((a, i) => (
                                    <TableRow
                                        key={a.id}
                                        className={
                                            i % 2 === 0
                                                ? 'bg-transparent'
                                                : 'bg-muted/30'
                                        }
                                    >
                                        <TableCell>
                                            {a.student?.student_code}
                                        </TableCell>
                                        <TableCell>
                                            {a.student?.first_name}{' '}
                                            {a.student?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${statusColors[a.status] || 'bg-gray-100'}`}
                                            >
                                                {a.status === 'present'
                                                    ? 'Presente'
                                                    : a.status === 'absent'
                                                      ? 'Ausente'
                                                      : 'Tardanza'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
