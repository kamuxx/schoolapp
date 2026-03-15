import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    BookOpenIcon, 
    ChevronDownIcon,
    GraduationCap, 
    RefreshCwIcon, 
    SaveIcon, 
    PlusIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem,
} from '@/components/ui/accordion';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Section {
    id: number;
    name: string;
}

interface Level {
    id: number;
    name: string;
    stage: string;
    school_level_id: number;
    sections: Section[];
}

interface Subject {
    id: number;
    subject?: {
        id: number;
        name: string;
    } | null;
}

interface Assignment {
    subject_id: number;
    section_id: number;
}

interface TeacherSubjectsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: number | null;
    teacherName: string;
}

export function TeacherSubjectsModal({ open, onOpenChange, employeeId, teacherName }: TeacherSubjectsModalProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [levels, setLevels] = useState<Level[]>([]);
    const [stages, setStages] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [subjectsByLevel, setSubjectsByLevel] = useState<Record<number, Subject[]>>({});
    const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
    const [initialAssignments, setInitialAssignments] = useState<Assignment[]>([]);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        if (open && employeeId) {
            fetchCatalog();
        } else {
            // Reset state
            setLevels([]);
            setSubjectsByLevel({});
            setSelectedAssignments([]);
            setInitialAssignments([]);
        }
    }, [open, employeeId]);

    const fetchCatalog = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/filiacion/carga-horaria/docente/${employeeId}/catalog`);
            if (response.status === 200) {
                const data = response.data;
                setStages(data.stages || []);
                setLevels(data.levels || []);
                setSubjectsByLevel(data.subjects_by_level || {});
                
                if (data.stages && data.stages.length > 0) {
                    setActiveTab(data.stages[0]);
                }

                const current = (data.current_assignments || []).map((a: any) => ({
                    subject_id: Number(a.subject_id),
                    section_id: Number(a.section_id)
                }));
                setSelectedAssignments(current);
                setInitialAssignments(current);
            }
        } catch (error) {
            toast.error('Error al cargar el catálogo de materias');
        } finally {
            setLoading(false);
        }
    };

    const isSelected = (subjectId: number, sectionId: number) => {
        return selectedAssignments.some(a => a.subject_id === subjectId && a.section_id === sectionId);
    };

    const toggleAssignment = (subjectId: number, sectionId: number) => {
        setSelectedAssignments(prev => {
            const index = prev.findIndex(a => a.subject_id === subjectId && a.section_id === sectionId);
            if (index !== -1) {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
            } else {
                return [...prev, { subject_id: subjectId, section_id: sectionId }];
            }
        });
    };

    const handleToggleLevel = (level: Level, checked: boolean) => {
        const levelSubjects = subjectsByLevel[level.school_level_id] || [];
        const sectionIds = level.sections.map(s => s.id);
        const subjectIds = levelSubjects.map(s => s.subject?.id).filter((id): id is number => id !== undefined && id !== null);

        console.log({checked});

        setSelectedAssignments(prev => {
            const filtered = prev.filter(a => 
                !(sectionIds.includes(a.section_id) && subjectIds.includes(a.subject_id))
            );

            console.log({prev});
            
            if (checked) {
                const newAssignments: Assignment[] = [];
                sectionIds.forEach(secId => {
                    subjectIds.forEach(subId => {
                        newAssignments.push({ subject_id: subId, section_id: secId });
                    });
                });
                return [...filtered, ...newAssignments];
            }
            return filtered;
        });
    };

    const handleToggleSubject = (subjectId: number, levelSections: Section[], checked: boolean) => {
        const sectionIds = levelSections.map(s => s.id);
        
        setSelectedAssignments(prev => {
            // Eliminar todas las secciones actuales para esta materia
            const filtered = prev.filter(a => !(a.subject_id === subjectId && sectionIds.includes(a.section_id)));
            
            if (checked) {
                // Agregar todas las secciones
                const newAssignments = sectionIds.map(secId => ({ subject_id: subjectId, section_id: secId }));
                return [...filtered, ...newAssignments];
            }
            return filtered;
        });
    };

    const handleSave = async () => {
        if (!employeeId) return;
        
        setSaving(true);
        try {
            const response = await axios.post('/filiacion/carga-horaria/sync', {
                employee_id: employeeId,
                assignments: selectedAssignments
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('Asignaciones actualizadas correctamente');
                onOpenChange(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error de red al guardar');
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = JSON.stringify(selectedAssignments.sort()) !== JSON.stringify(initialAssignments.sort());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpenIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Materias del Docente</DialogTitle>
                            <DialogDescription>
                                Gestione qué materias y paralelos dicta <strong>{teacherName}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-20">
                            <RefreshCwIcon className="h-8 w-8 animate-spin text-primary/20 mb-4" />
                            <p className="text-sm text-muted-foreground animate-pulse">Cargando catálogo educativo...</p>
                        </div>
                    ) : (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                            {stages.length > 1 && (
                                <div className="px-6 border-b bg-zinc-50/50">
                                    <TabsList className="h-12 w-full justify-start bg-transparent p-0 gap-6">
                                        {stages.map(stage => (
                                            <TabsTrigger 
                                                key={stage} 
                                                value={stage}
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary font-bold px-1 transition-all"
                                            >
                                                {stage}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            )}

                            <TabsContent value={activeTab} className="flex-1 overflow-hidden overflow-y-auto m-0 p-0 flex flex-col min-h-0">
                                <ScrollArea className="flex-1 h-full">
                                    <div className="p-6">
                                        <Accordion type="multiple" className="space-y-4 pb-4">
                                        {levels.filter(l => l.stage === activeTab).map(level => {
                                            const levelSubjects = subjectsByLevel[level.school_level_id] || [];
                                            const sectionIds = level.sections.map(s => s.id);
                                            const subjectIds = levelSubjects.map(s => s.subject?.id).filter((id): id is number => id !== undefined && id !== null);
                                            
                                            // Lógica más robusta para marcar/desmarcar
                                            const totalCombinations = levelSubjects.length * level.sections.length;
                                            const selectedForLevel = selectedAssignments.filter(a => 
                                                sectionIds.includes(a.section_id) && subjectIds.includes(a.subject_id)
                                            ).length;
                                            const allSelected = totalCombinations > 0 && selectedForLevel === totalCombinations;

                                            return (
                                                <AccordionItem 
                                                    key={level.id} 
                                                    value={`level-${level.id}`}
                                                    className="border rounded-xl bg-white shadow-sm overflow-hidden border-zinc-200"
                                                >
                                                    <div className="flex items-center px-4 hover:bg-zinc-50/50 transition-colors">
                                                        {/* Header y Trigger de Radix separados del Switch */}
                                                        <AccordionPrimitive.Header className="flex flex-1">
                                                            <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium outline-none hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                                                                        <GraduationCap className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-zinc-900 leading-none mb-1">{level.name}</h5>
                                                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
                                                                            {level.sections.length} Paralelos • {levelSubjects.length} Materias
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                                            </AccordionPrimitive.Trigger>
                                                        </AccordionPrimitive.Header>
                                                        {/* Switch completamente FUERA del Header de Radix */}
                                                        <div className="flex items-center gap-3 ml-4 border-l pl-4 py-2">
                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Todo el nivel</span>
                                                            <Switch onCheckedChange={(checked:boolean)=> {
                                                                handleToggleLevel(level, checked);
                                                            }}
                                                                className="data-[state=checked]:bg-emerald-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <AccordionContent className="p-4 pt-2 border-t border-zinc-100 bg-zinc-50/30">
                                                        <div className="space-y-4 pt-2">
                                                            {levelSubjects.length === 0 ? (
                                                                <div className="flex items-center justify-center py-6 text-xs text-muted-foreground italic">
                                                                    No hay materias configuradas para este nivel.
                                                                </div>
                                                            ) : (
                                                                levelSubjects.map(subject => {
                                                                    const realSubjectId = subject.subject?.id;
                                                                    if (!realSubjectId) return null;

                                                                    const subjectAllSelected = level.sections.length > 0 && level.sections.every(section => isSelected(realSubjectId, section.id));
                                                                    
                                                                    return (
                                                                        <div key={subject.id} className="bg-white rounded-lg border border-zinc-200 p-3 shadow-sm">
                                                                            <div className="flex items-center justify-between mb-3 border-b border-zinc-50 pb-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <BookOpenIcon className="h-3 w-3 text-primary/60" />
                                                                                    <span className="text-sm font-bold text-zinc-800">{subject.subject?.name || 'Materia sin nombre'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Todos</span>
                                                                                    <Switch 
                                                                                        checked={subjectAllSelected}
                                                                                        onCheckedChange={(checked) => handleToggleSubject(realSubjectId, level.sections, !!checked)}
                                                                                        className="scale-75 data-[state=checked]:bg-primary"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {level.sections.map(section => {
                                                                                    const active = isSelected(realSubjectId, section.id);
                                                                                    return (
                                                                                        <button
                                                                                            key={section.id}
                                                                                            type="button"
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault();
                                                                                                e.stopPropagation();
                                                                                                toggleAssignment(realSubjectId, section.id);
                                                                                            }}
                                                                                            className={`
                                                                                                group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all
                                                                                                ${active 
                                                                                                    ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                                                                                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100'
                                                                                                }
                                                                                            `}
                                                                                        >
                                                                                            <div className={`
                                                                                                w-2 h-2 rounded-full transition-colors
                                                                                                ${active ? 'bg-primary' : 'bg-zinc-300 group-hover:bg-zinc-400'}
                                                                                            `} />
                                                                                            {section.name}
                                                                                            {active && (
                                                                                                <div className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full p-0.5">
                                                                                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                                                                                </div>
                                                                                            )}
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                </div>
                            </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-zinc-50/50">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            {hasChanges && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Cambios pendientes
                                </Badge>
                            )}
                            {!hasChanges && !loading && (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Todo sincronizado
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                                Cerrar
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                disabled={saving || !hasChanges || loading}
                                className="bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-95"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
