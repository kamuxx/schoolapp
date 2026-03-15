<?php

namespace App\UseCases\CargaHoraria;

use App\Repositories\Contracts\CourseSubjectTeacherRepositoryInterface;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\Contracts\ScheduleBlockRepositoryInterface;
use App\Repositories\Contracts\SectionRepositoryInterface;
use App\Repositories\Contracts\SubjectRepositoryInterface;

class GetTeacherAssignmentsUseCase
{
    public function __construct(
        private EmployeeRepositoryInterface $employeeRepository,
        private CourseSubjectTeacherRepositoryInterface $assignmentRepository,
        private SectionRepositoryInterface $sectionRepository,
        private SubjectRepositoryInterface $subjectRepository,
        private ScheduleBlockRepositoryInterface $blockRepository
    ) {}

    /**
     * Ejecuta la lógica para obtener la carga académica y catálogos.
     */
    public function execute(array $data): array
    {
        $employeeId = $data['employee_id'];
        $employee = $this->employeeRepository->find($employeeId);

        if (! $employee) {
            throw new \Exception('Empleado no encontrado');
        }

        $schoolId = $employee->school_id;

        if (! $employee->user) {
            throw new \Exception('El docente no tiene un usuario asociado');
        }

        // 1. Asignaciones actuales (usando repositorio)
        $assignments = $this->assignmentRepository->getWorkloadByTeacher($employee->user->id);

        // 2. Datos para selectores (usando repositorios)
        $sections = $this->sectionRepository->getBySchool($schoolId)->map(function ($s) {
            if ($s->schoolLevel) {
                $s->setRelation('level', $s->schoolLevel->level);
                $s->unsetRelation('schoolLevel');
            }

            return $s;
        });

        $subjects = $this->subjectRepository->getBySchool($schoolId);
        $blocks = $this->blockRepository->getBySchool($schoolId);

        return [
            'employee' => $employee,
            'assignments' => $assignments,
            'sections' => $sections,
            'subjects' => $subjects,
            'blocks' => $blocks,
        ];
    }
}
