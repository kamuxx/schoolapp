import { Head, Link } from '@inertiajs/react';
import { CalendarRange, Clock, ArrowLeft, BookOpenIcon, UserCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Employee {
    id: number;
    employee_code: string;
    professional_title?: string;
    photo_path?: string;
    user?: { first_name: string; last_name: string; email: string };
}

interface TeacherAssignment {
    id: number;
    subject: { id: number; name: string };
    section: { id: number; name: string; students_count?: number; level?: { id: number; name: string } };
    schedules: {
        id: number;
        day_of_week: number;
        schedule_block: { id: number; start_time: string; end_time: string; name: string };
    }[];
}

interface Props {
    employee: Employee;
    assignments: TeacherAssignment[];
}

const daysOfWeek = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
];

export default function ShowTeacherWorkload({ employee, assignments }: Props) {
    const teacherName = `${employee.user?.first_name || ''} ${employee.user?.last_name || ''}`;
    const initials = `${employee.user?.first_name?.charAt(0) || ''}${employee.user?.last_name?.charAt(0) || ''}`;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Filiación', href: '/filiacion' },
        { title: 'Docentes', href: '/filiacion/docentes' },
        { title: 'Carga Horaria', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Carga Horaria - ${teacherName}`} />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Detalle de Carga Horaria</h2>
                        <p className="text-muted-foreground">Vista detallada de las materias y horarios asignados al docente.</p>
                    </div>
                    <Link 
                        href="/filiacion/docentes" 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Docentes
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta del Docente */}
                    <Card className="md:col-span-1 border-l-4 border-l-blue-600 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserCircle className="h-5 w-5" />
                                Información del Docente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <Avatar className="h-24 w-24 border-2 border-primary/10 shadow-sm">
                                    <AvatarImage
                                        src={employee.photo_path ? `/storage/${employee.photo_path}` : ''}
                                        alt={teacherName}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{teacherName}</h3>
                                    <Badge variant="outline" className="font-mono text-xs">{employee.employee_code}</Badge>
                                    <p className="text-sm text-muted-foreground">{employee.professional_title || 'Docente'}</p>
                                    <p className="text-xs text-muted-foreground">{employee.user?.email}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{assignments.length}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Asignaciones</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {assignments.reduce((total, a) => total + a.schedules.length, 0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Horas/Clase</p>
                                </div>
                                <div className="col-span-2 pt-4">
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {/* Usamos un Set para contar estudiantes únicos si el docente tiene varias materias en la misma sección */}
                                        {[...new Set(assignments.map(a => a.section.id))].reduce((total, sectionId) => {
                                            const section = assignments.find(a => a.section.id === sectionId)?.section;
                                            return total + (section?.students_count || 0);
                                        }, 0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Estudiantes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de Asignaciones */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpenIcon className="h-5 w-5" />
                                Materias Asignadas
                            </CardTitle>
                            <CardDescription>
                                Un vistazo rápido a todas las materias que imparte este docente por sección.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assignments.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Materia</TableHead>
                                                <TableHead>Nivel / Sección</TableHead>
                                                <TableHead className="text-center">Estudiantes</TableHead>
                                                <TableHead className="text-center">Bloques Horarios</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {assignments.map((assignment) => (
                                                <TableRow key={assignment.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                                {assignment.subject.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            {assignment.subject.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold">{assignment.section.level?.name}</span>
                                                            <span className="text-xs text-muted-foreground">Sección: {assignment.section.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                            {assignment.section.students_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary" className="px-2.5 py-0.5">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {assignment.schedules.length}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
                                    <CalendarRange className="h-10 w-10 text-zinc-400 mb-3" />
                                    <p className="text-sm font-medium text-zinc-900">Sin carga horaria</p>
                                    <p className="text-xs text-zinc-500 mt-1 max-w-[250px]">
                                        Este docente no tiene materias ni horarios asignados en este momento.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    {/* Horarios Detallados */}
                    {assignments.length > 0 && (
                        <Card className="md:col-span-3 shadow-sm border-t-4 border-t-emerald-500">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarRange className="h-5 w-5" />
                                    Horario Detallado
                                </CardTitle>
                                <CardDescription>
                                    Distribución semanal de las clases del docente.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {assignments.map((assignment) => (
                                        <div key={`schedule-${assignment.id}`} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm bg-card hover:border-emerald-200 transition-colors">
                                            <div className="flex items-center justify-between pb-2 border-b">
                                                <h4 className="font-semibold text-sm line-clamp-1" title={assignment.subject.name}>
                                                    {assignment.subject.name}
                                                </h4>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                                                    {assignment.section.level?.name} - {assignment.section.name}
                                                </Badge>
                                            </div>
                                            
                                            {assignment.schedules.length > 0 ? (
                                                <div className="pt-2 space-y-2">
                                                    {assignment.schedules.map((schedule) => {
                                                        const dayName = daysOfWeek.find(d => d.id === schedule.day_of_week)?.name || 'Día ' + schedule.day_of_week;
                                                        return (
                                                            <div key={schedule.id} className="flex items-center justify-between text-xs bg-muted/50 px-2 py-1.5 rounded">
                                                                <span className="font-medium">{dayName}</span>
                                                                <div className="flex items-center text-muted-foreground gap-1.5">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    <span>{schedule.schedule_block.start_time.substring(0, 5)} - {schedule.schedule_block.end_time.substring(0, 5)}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="py-4 text-center">
                                                    <span className="text-xs text-muted-foreground italic">Sin horarios definidos</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
