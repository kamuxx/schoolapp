import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Calendar, Layers, Info } from 'lucide-react';

interface Section {
    id: number;
    name: string;
    students_count: number;
}

interface LevelDetails {
    id: number;
    level_name: string;
    stage: string;
    academic_year: string;
    sections: Section[];
}

interface LevelShowModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    level: LevelDetails | null;
}

export function LevelShowModal({ open, onOpenChange, level }: LevelShowModalProps) {
    if (!level) return null;

    const totalStudents = level.sections.reduce((acc, s) => acc + s.students_count, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full lg:max-w-3xl overflow-hidden p-0 border-none bg-white shadow-2xl">
                <div className="flex h-full flex-col md:flex-row">
                    {/* Lateral: Perfil del Nivel */}
                    <div className="flex flex-col items-center bg-zinc-50 p-8 text-center md:w-1/3 border-r border-zinc-100">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white ring-1 ring-zinc-200/50">
                                <GraduationCap className="h-16 w-16 text-blue-600" />
                            </div>
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-[10px] px-3 font-black uppercase tracking-widest whitespace-nowrap shadow-lg">
                                {level.stage}
                            </Badge>
                        </div>
                        
                        <div className="mt-8 space-y-2">
                            <h2 className="text-2xl font-black text-zinc-900 leading-tight tracking-tight">
                                {level.level_name}
                            </h2>
                            <p className="text-zinc-500 text-sm font-bold flex items-center justify-center gap-1.5 bg-zinc-100/50 py-1 px-3 rounded-full">
                                <Calendar className="h-3.5 w-3.5" />
                                {level.academic_year}
                            </p>
                        </div>

                        <div className="mt-8 flex w-full flex-col gap-3 border-t border-zinc-200/60 pt-8">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-400 font-bold uppercase tracking-tighter">Estado</span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    Activo
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-400 font-bold uppercase tracking-tighter">Tipo</span>
                                <span className="font-bold text-zinc-700">Formativo</span>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Principal */}
                    <div className="flex-1 p-8 bg-white">
                        <DialogHeader className="mb-8 p-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Info className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Información Institucional</span>
                            </div>
                            <DialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">Detalles del Nivel</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">Gestión de secciones y población estudiantil</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8">
                            {/* Resumen */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center space-y-1 transition-all hover:bg-zinc-50">
                                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-tighter">Total Alumnos</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-zinc-900 tracking-tighter">{totalStudents}</span>
                                        <Users className="h-4 w-4 text-blue-500" />
                                    </div>
                                </div>
                                <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center space-y-1 transition-all hover:bg-zinc-50">
                                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-tighter">Paralelos</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-zinc-900 tracking-tighter">{level.sections.length}</span>
                                        <Layers className="h-4 w-4 text-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Listado de Secciones */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                        Secciones y Carga
                                    </h3>
                                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md uppercase">
                                        {level.sections.length} Registradas
                                    </span>
                                </div>
                                
                                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {level.sections.map((section) => (
                                        <div 
                                            key={section.id} 
                                            className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 transition-all hover:shadow-md hover:border-blue-200 hover:translate-x-1"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                    {section.name}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900 tracking-tight">Paralelo {section.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className="h-1 w-1 rounded-full bg-zinc-300" />
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Sección Institucional</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                <Users className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-500" />
                                                <span className="text-sm font-black text-zinc-900 group-hover:text-blue-700">{section.students_count}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {level.sections.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
                                            <Layers className="h-8 w-8 text-zinc-300 mb-2" />
                                            <p className="text-xs font-bold text-zinc-400 uppercase">Sin secciones configuradas</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-zinc-100 pt-6 flex justify-end">
                             <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em]">SchoolApp Engine v1.0</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
