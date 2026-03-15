<?php

namespace App\UseCases;

use App\Events\SectionAutoCreated;
use App\Models\Enrollment;
use App\Models\SchoolLevel;
use App\Models\Section;
use App\Models\Student;
use App\Repositories\EnrollmentRepository;
use App\Repositories\LevelRepository;
use App\Repositories\SchoolRepository;
use Exception;

class EnrollmentUseCase
{
    public function __construct(
        private readonly EnrollmentRepository $enrollmentRepository,
        private readonly LevelRepository $levelRepository,
        private readonly SchoolRepository $schoolRepository,
    ) {}

    public function enrollStudent(Student $student, int $schoolLevelId): Enrollment
    {
        $schoolLevel = $this->levelRepository->find($schoolLevelId);

        if (! $schoolLevel) {
            throw new Exception('Nivel escolar no encontrado.');
        }

        $this->validateCapacity($schoolLevel);

        $section = $this->findOrCreateSection($schoolLevel);

        return $this->enrollmentRepository->create([
            'student_id' => $student->id,
            'section_id' => $section->id,
            'school_id' => $schoolLevel->school_id,
            'academic_year_id' => $schoolLevel->academic_year_id,
            'status' => Enrollment::STATUS_ACTIVE,
            'enrollment_date' => now(),
            'created_by' => auth()->id(),
        ]);
    }

    private function validateCapacity(SchoolLevel $schoolLevel): void
    {
        $school = $this->schoolRepository->find($schoolLevel->school_id);
        if (! $school) {
            throw new Exception('Escuela no encontrada.');
        }

        $level = $schoolLevel->level;
        if (! $level) {
            throw new Exception('Nivel no encontrado.');
        }

        $totalSchoolEnrollments = $this->enrollmentRepository
            ->getActiveBySchool($school->id)
            ->count();

        if ($school->max_capacity > 0 && $totalSchoolEnrollments >= $school->max_capacity) {
            throw new Exception("Capacidad maxima de la Unidad Educativa alcanzada ({$school->max_capacity}).");
        }

        $totalLevelEnrollments = $this->enrollmentRepository
            ->getActiveBySchoolLevel($schoolLevel->id)
            ->count();

        if ($level->max_capacity > 0 && $totalLevelEnrollments >= $level->max_capacity) {
            throw new Exception("Capacidad maxima para el nivel {$level->name} alcanzada ({$level->max_capacity}).");
        }
    }

    private function findOrCreateSection(SchoolLevel $schoolLevel): Section
    {
        $maxPerRoom = config('app.max_students_per_classroom', 40);

        $section = $this->enrollmentRepository->findSectionWithCapacity(
            $schoolLevel->id,
            $maxPerRoom
        );

        if ($section) {
            return $section;
        }

        return $this->createNewSection($schoolLevel);
    }

    private function createNewSection(SchoolLevel $schoolLevel): Section
    {
        $sectionsCount = $this->countExistingSections($schoolLevel->id);
        $nextLetter = $this->getNextSectionLetter($sectionsCount);

        $section = $this->enrollmentRepository->createSection([
            'school_id' => $schoolLevel->school_id,
            'school_level_id' => $schoolLevel->id,
            'name' => $nextLetter,
            'created_by' => auth()->id(),
        ]);

        event(new SectionAutoCreated($section));

        return $section;
    }

    private function countExistingSections(int $schoolLevelId): int
    {
        return \App\Models\Section::where('school_level_id', $schoolLevelId)
            ->whereNull('deleted_at')
            ->count();
    }

    private function getNextSectionLetter(int $currentCount): string
    {
        $alphabet = range('A', 'Z');

        return $alphabet[$currentCount] ?? 'Seccion '.($currentCount + 1);
    }
}
