<?php

namespace App\Http\Controllers;

use App\Models\CourseSubjectTeacher;
use App\Models\CourseSubjectTeacherSchedule;
use App\Models\Employee;
use App\Models\ScheduleBlock;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CargaHorariaController extends Controller
{
    /**
     * Obtiene los datos necesarios para la gestión de carga horaria de un docente.
     */
    public function getTeacherAssignments(int $employeeId)
    {
        $employee = Employee::with('user')->findOrFail($employeeId);
        $schoolId = $employee->school_id;

        // Asignaciones actuales del docente
        $assignments = CourseSubjectTeacher::where('teacher_id', $employee->user_id)
            ->with(['subject', 'section.level', 'schedules.scheduleBlock'])
            ->get();

        // Datos para los selectores
        $sections = Section::with('level')->where('school_id', $schoolId)->get();
        $subjects = Subject::where('school_id', $schoolId)->get();
        $blocks = ScheduleBlock::where('school_id', $schoolId)->orderBy('sort_order')->get();

        return response()->json([
            'employee' => $employee,
            'assignments' => $assignments,
            'sections' => $sections,
            'subjects' => $subjects,
            'blocks' => $blocks,
        ]);
    }

    /**
     * Guarda o actualiza una asignación de materia y su horario.
     */
    public function storeAssignment(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'required|exists:sections,id',
            'schedules' => 'array',
            'schedules.*.day_of_week' => 'required|integer|min:1|max:7',
            'schedules.*.schedule_block_id' => 'required|exists:schedule_blocks,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $schoolId = auth()->user()->school_id;

            // 1. Crear o actualizar la asignación base
            $assignment = CourseSubjectTeacher::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'teacher_id' => $validated['teacher_id'],
                    'subject_id' => $validated['subject_id'],
                    'section_id' => $validated['section_id'],
                ],
                [
                    'updated_by' => auth()->id(),
                ]
            );

            if (!$assignment->wasRecentlyCreated) {
                // Si ya existía, limpiamos el horario previo para sobrescribir
                $assignment->schedules()->delete();
            } else {
                $assignment->created_by = auth()->id();
                $assignment->save();
            }

            // 2. Guardar el nuevo horario
            if (!empty($validated['schedules'])) {
                foreach ($validated['schedules'] as $sched) {
                    $assignment->schedules()->create([
                        'school_id' => $schoolId,
                        'day_of_week' => $sched['day_of_week'],
                        'schedule_block_id' => $sched['schedule_block_id'],
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            return response()->json([
                'message' => 'Carga horaria guardada correctamente',
                'assignment' => $assignment->load(['subject', 'section.level', 'schedules.scheduleBlock']),
            ]);
        });
    }

    /**
     * Obtiene el catálogo completo de materias y secciones disponibles para un docente,
     * organizados por nivel, incluyendo las asignaciones actuales.
     */
    public function getCatalogForTeacher(int $employeeId)
    {
        $employee = Employee::with('user', 'school')->findOrFail($employeeId);
        $schoolId = $employee->school_id;
        $educationalStages = $employee->school->educational_stages ?? [];

        // 1. Obtener Niveles con sus Secciones (Paralelos)
        $levels = \App\Models\SchoolLevel::with(['level', 'sections'])
            ->where('school_id', $schoolId)
            ->get()
            ->map(function ($sl) {
                return [
                    'id' => $sl->level->id,
                    'name' => $sl->level->name,
                    'stage' => $sl->level->stage,
                    'school_level_id' => $sl->id,
                    'sections' => $sl->sections->map(fn($s) => [
                        'id' => $s->id,
                        'name' => $s->name
                    ])
                ];
            })
            ->filter(function($l) use ($educationalStages) {
                // Solo incluir niveles que pertenezcan a las etapas configuradas de la escuela
                return in_array($l['stage'], $educationalStages);
            })
            ->values();

        // 2. Obtener Materias asignadas a esos niveles en esta escuela
        $subjectsByLevel = \App\Models\SchoolSubjectLevel::with('subject')
            ->where('school_id', $schoolId)
            ->where('is_active', true)
            ->get()
            ->groupBy('school_level_id');

        // 3. Asignaciones actuales del docente
        $currentAssignments = CourseSubjectTeacher::where('teacher_id', $employee->user_id)
            ->where('school_id', $schoolId)
            ->get(['id', 'subject_id', 'section_id']);

        return response()->json([
            'stages' => $educationalStages,
            'levels' => $levels,
            'subjects_by_level' => $subjectsByLevel,
            'current_assignments' => $currentAssignments,
        ]);
    }

    /**
     * Sincroniza masivamente las asignaciones de un docente.
     */
    public function syncTeacherAssignments(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'assignments' => 'array',
            'assignments.*.subject_id' => 'required|exists:subjects,id',
            'assignments.*.section_id' => 'required|exists:sections,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $employee = Employee::findOrFail($validated['employee_id']);
            $schoolId = auth()->user()->school_id;
            $teacherId = $employee->user_id;

            // 1. Obtener IDs de las asignaciones enviadas para identificar qué mantener/crear
            $newAssignments = collect($validated['assignments']);
            
            // 2. Eliminar (soft delete) asignaciones que NO están en la nueva lista
            // Solo para este docente y esta escuela
            $currentIds = CourseSubjectTeacher::where('teacher_id', $teacherId)
                ->where('school_id', $schoolId)
                ->get();

            foreach ($currentIds as $current) {
                $exists = $newAssignments->contains(function ($item) use ($current) {
                    return $item['subject_id'] == $current->subject_id && $item['section_id'] == $current->section_id;
                });

                if (!$exists) {
                    $current->delete(); // Soft delete
                }
            }

            // 3. Crear o restaurar las enviadas
            foreach ($newAssignments as $item) {
                CourseSubjectTeacher::withTrashed()->updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'teacher_id' => $teacherId,
                        'subject_id' => $item['subject_id'],
                        'section_id' => $item['section_id'],
                    ],
                    [
                        'deleted_at' => null, // Restaurar si estaba borrado
                        'updated_by' => auth()->id(),
                    ]
                );
            }

            return response()->json(['message' => 'Carga académica actualizada correctamente']);
        });
    }

    /**
     * Elimina una asignación completa.
     */
    public function destroyAssignment(int $id)
    {
        $assignment = CourseSubjectTeacher::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Asignación eliminada']);
    }
}
