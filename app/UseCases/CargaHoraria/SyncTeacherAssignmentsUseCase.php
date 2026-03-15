<?php

namespace App\UseCases\CargaHoraria;

use App\Repositories\Contracts\CourseSubjectTeacherRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SyncTeacherAssignmentsUseCase
{
    public function __construct(
        private CourseSubjectTeacherRepositoryInterface $repository
    ) {}

    /**
     * Sincroniza (agrega y borra lógicamente) las asignaciones de materias de un docente.
     *
     * @param  array  $dto  Datos validados (employee_id, assignments array)
     * @param  int  $schoolId  ID de la escuela
     * @param  int  $teacherId  User ID del docente
     * @param  int|null  $updatedBy  User ID de quien actualiza
     */
    public function execute(array $dto, int $schoolId, int $teacherId, ?int $updatedBy): void
    {
        DB::transaction(function () use ($dto, $schoolId, $teacherId, $updatedBy) {
            $newAssignments = collect($dto['assignments'] ?? []);

            // 1. Obtener las asignaciones actuales usando el repositorio
            $currentAssignments = $this->repository->getCurrentAssignments($teacherId, $schoolId);

            // 2. Eliminar (soft delete) las que están en DB pero no llegaron en la petición
            foreach ($currentAssignments as $current) {
                // Verificar si esta combinación (materia-sección) existe en el nuevo arreglo
                $exists = $newAssignments->contains(function ($item) use ($current) {
                    return $item['subject_id'] == $current->subject_id && $item['section_id'] == $current->section_id;
                });

                if (! $exists) {
                    $this->repository->delete($current->id);
                }
            }

            // 3. Crear o restaurar las que sí vinieron en la petición
            foreach ($newAssignments as $item) {
                $this->repository->updateOrCreateAssignment(
                    $schoolId,
                    $teacherId,
                    $item['subject_id'],
                    $item['section_id'],
                    $updatedBy ?? 0
                );
            }
        });
    }
}
