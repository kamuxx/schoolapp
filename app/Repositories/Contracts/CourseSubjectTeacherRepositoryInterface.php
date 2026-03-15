<?php

namespace App\Repositories\Contracts;

interface CourseSubjectTeacherRepositoryInterface
{
    /**
     * Obtiene los IDs de las asignaciones actuales de un docente en una escuela.
     */
    public function getCurrentAssignments(int $teacherId, int $schoolId);

    /**
     * Elimina lógicamente una asignación.
     */
    public function delete(int $id): bool;

    /**
     * Obtiene la carga horaria completa de un docente incluyendo relaciones y conteos.
     */
    public function getWorkloadByTeacher(int $teacherUserId): \Illuminate\Support\Collection;

    /**
     * Crea o restaura una asignación de docente a curso/materia.
     */
    public function updateOrCreateAssignment(int $schoolId, int $teacherId, int $subjectId, int $sectionId, int $updatedBy): void;
}
