import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import { SaveIcon, RefreshCwIcon, UploadIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { store as storeRoute, index as indexRoute } from '@/routes/grades';
import type { BreadcrumbItem } from '@/types';

interface Activity {
    id: number;
    dimension: string;
    description: string;
    max_score: number;
}
interface Grade {
    student_id: number;
    student_name: string;
    student_code: string;
    activity_id: number;
    score: number | null;
}
interface Section {
    id: number;
    name: string;
    level?: string;
}
interface Term {
    id: number;
    name: string;
    academic_year?: string;
}
interface Props {
    sections: Section[];
    terms: Term[];
    activities: Activity[];
    grades: Grade[];
    filters: { section_id?: number; term_id?: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gestión Escolar', href: '/gestion-escolar' },
    { title: 'Notas', href: '/gestion-escolar/notas' },
];

export default function Grades({
    sections,
    terms,
    activities,
    grades,
    filters,
}: Props) {
    const [sectionsState, setSectionsState] = useState<Section[]>([]);
    const [termsState, setTermsState] = useState<Term[]>([]);
    const [activitiesState, setActivitiesState] = useState<Activity[]>([]);
    const [selectedSection, setSelectedSection] = useState<number | null>(
        filters.section_id || null,
    );
    const [selectedTerm, setSelectedTerm] = useState<number | null>(
        filters.term_id || null,
    );
    const [matrix, setMatrix] = useState<
        Record<number, Record<number, number>>
    >({});
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { post, processing } = useForm({
        grades: [] as {
            student_id: number;
            evaluation_activity_id: number;
            score: number;
        }[],
    });

    useEffect(() => {
        setSectionsState(sections);
    }, [sections]);
    useEffect(() => {
        setTermsState(terms);
    }, [terms]);
    useEffect(() => {
        setActivitiesState(activities);
    }, [activities]);

    useEffect(() => {
        const newMatrix: Record<number, Record<number, number>> = {};
        grades.forEach((g) => {
            if (!newMatrix[g.student_id]) newMatrix[g.student_id] = {};
            newMatrix[g.student_id][g.activity_id] = g.score || 0;
        });
        setMatrix(newMatrix);
    }, [grades]);

    const students = [
        ...new Map(
            grades.map((g) => [
                g.student_id,
                {
                    id: g.student_id,
                    name: g.student_name,
                    code: g.student_code,
                },
            ]),
        ).values(),
    ];

    const buttons = [
        {
            label: 'Guardar',
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
        if (!selectedSection || !selectedTerm)
            return toast.error('Seleccione sección y período');
        setLoading(true);
        router.get(
            indexRoute().url,
            { section_id: selectedSection, term_id: selectedTerm },
            {
                only: ['activities', 'grades'],
                preserveState: true,
                onFinish: () => setLoading(false),
            },
        );
    }

    function handleScoreChange(
        studentId: number,
        activityId: number,
        value: string,
    ) {
        const numValue = parseFloat(value) || 0;
        setMatrix((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], [activityId]: numValue },
        }));
        setHasChanges(true);
    }

    function handleSave() {
        const gradesList: {
            student_id: number;
            evaluation_activity_id: number;
            score: number;
        }[] = [];
        Object.entries(matrix).forEach(([studentId, activities]) => {
            Object.entries(activities).forEach(([activityId, score]) => {
                gradesList.push({
                    student_id: Number(studentId),
                    evaluation_activity_id: Number(activityId),
                    score,
                });
            });
        });

        post(storeRoute().url, {
            data: { grades: gradesList },
            onSuccess: () => {
                toast.success('Notas guardadas');
                setHasChanges(false);
            },
        });
    }

    const getScore = (studentId: number, activityId: number) =>
        matrix[studentId]?.[activityId] ?? '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notas" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Gestión de Notas</h2>

                <div className="flex items-end gap-4">
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
                    <div className="grid gap-1">
                        <Label>Período</Label>
                        <select
                            value={selectedTerm || ''}
                            onChange={(e) =>
                                setSelectedTerm(Number(e.target.value))
                            }
                            className="min-w-[200px] rounded border px-3 py-2"
                        >
                            <option value="">Seleccionar...</option>
                            {termsState.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({t.academic_year})
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={loadData} variant="outline">
                        Cargar
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <AppToolbar buttons={buttons} />
                    {hasChanges && (
                        <span className="text-sm text-amber-600">
                            • Cambios sin guardar
                        </span>
                    )}
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[100px]">
                                    Código
                                </TableHead>
                                <TableHead className="min-w-[200px]">
                                    Estudiante
                                </TableHead>
                                {activitiesState.map((a) => (
                                    <TableHead
                                        key={a.id}
                                        className="min-w-[80px] text-center"
                                    >
                                        <div className="text-xs">
                                            {a.dimension}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {a.description}
                                        </div>
                                        <div className="text-[10px] font-bold">
                                            / {a.max_score}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={2 + activitiesState.length}
                                        className="h-48 text-center"
                                    >
                                        <RefreshCwIcon className="h-5 w-5 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={2 + activitiesState.length}
                                        className="h-24 text-center"
                                    >
                                        Sin datos - Seleccione sección y período
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((s, i) => (
                                    <TableRow
                                        key={s.id}
                                        className={
                                            i % 2 === 0
                                                ? 'bg-transparent'
                                                : 'bg-muted/30'
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            {s.code}
                                        </TableCell>
                                        <TableCell>{s.name}</TableCell>
                                        {activitiesState.map((a) => (
                                            <TableCell
                                                key={a.id}
                                                className="p-1"
                                            >
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={a.max_score}
                                                    step="0.01"
                                                    value={getScore(s.id, a.id)}
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            s.id,
                                                            a.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded border px-1 py-1 text-center text-sm focus:ring-2 focus:ring-blue-500"
                                                />
                                            </TableCell>
                                        ))}
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
