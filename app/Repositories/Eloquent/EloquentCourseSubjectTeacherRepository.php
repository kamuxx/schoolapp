<?php

namespace App\Repositories\Eloquent;

use App\Models\CourseSubjectTeacher;
use App\Repositories\Contracts\CourseSubjectTeacherRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentCourseSubjectTeacherRepository implements CourseSubjectTeacherRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function getCurrentAssignments(int $teacherId, int $schoolId)
    {
        return CourseSubjectTeacher::where('teacher_id', $teacherId)
            ->where('school_id', $schoolId)
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getWorkloadByTeacher(int $teacherUserId): Collection
    {
        return CourseSubjectTeacher::where('teacher_id', $teacherUserId)
            ->with(['subject', 'section.schoolLevel.level', 'schedules.scheduleBlock'])
            ->get()
            ->map(function ($a) {
                if ($a->section && $a->section->schoolLevel) {
                    $a->section->setRelation('level', $a->section->schoolLevel->level);
                    // Añadir conteo de estudiantes (Lógica de dominio delegada)
                    $a->section->students_count = $a->section->getActiveEnrollments()->count();
                    $a->section->unsetRelation('schoolLevel');
                }

                return $a;
            });
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): bool
    {
        $assignment = CourseSubjectTeacher::find($id);

        if (! $assignment) {
            return false;
        }

        return $assignment->delete();
    }

    /**
     * {@inheritDoc}
     */
    public function updateOrCreateAssignment(int $schoolId, int $teacherId, int $subjectId, int $sectionId, int $updatedBy): void
    {
        CourseSubjectTeacher::withTrashed()->updateOrCreate(
            [
                'school_id' => $schoolId,
                'teacher_id' => $teacherId,
                'subject_id' => $subjectId,
                'section_id' => $sectionId,
            ],
            [
                'deleted_at' => null, // Restaurar del soft-delete si es necesario
                'updated_by' => $updatedBy,
            ]
        );
    }
}
