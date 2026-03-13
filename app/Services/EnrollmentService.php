<?php

namespace App\Services;

use App\Models\School;
use App\Models\Level;
use App\Models\SchoolLevel;
use App\Models\Section;
use App\Models\Enrollment;
use App\Models\Student;
use App\Events\SectionAutoCreated;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * Servicio encargado de la lógica de negocio para inscripciones.
 * Implementa validaciones jerárquicas de capacidad (Escuela -> Nivel -> Sección).
 */
class EnrollmentService
{
    /**
     * Inscribe a un estudiante en un nivel/grado para un año académico específico.
     * Maneja automáticamente la asignación de sección y el desborde (Paralelo B/C).
     */
    public function enroll(Student $student, SchoolLevel $schoolLevel): Enrollment
    {
        return DB::transaction(function () use ($student, $schoolLevel) {
            
            $this->validateHierarchicalCapacity($schoolLevel);

            $section = $this->findOrCreateOpportuneSection($schoolLevel);

            return Enrollment::create([
                'student_id' => $student->id,
                'section_id' => $section->id,
                'school_id' => $schoolLevel->school_id,
                'academic_year_id' => $schoolLevel->academic_year_id,
                'status' => Enrollment::STATUS_ACTIVE,
                'enrollment_date' => now(),
            ]);
        });
    }

    /**
     * Valida que no se exceda la capacidad global del colegio ni la del nivel.
     */
    protected function validateHierarchicalCapacity(SchoolLevel $schoolLevel): void
    {
        /** @var School $school */
        $school = $schoolLevel->school;
        /** @var Level $level */
        $level = $schoolLevel->level;

        // 1. Validar Capacidad Global de la Escuela
        $totalSchoolEnrollments = Enrollment::where('school_id', $school->id)
            ->where('status', Enrollment::STATUS_ACTIVE)
            ->count();

        if ($school->max_capacity > 0 && $totalSchoolEnrollments >= $school->max_capacity) {
            throw new Exception("Capacidad máxima de la Unidad Educativa alcanzada ({$school->max_capacity}).");
        }

        // 2. Validar Capacidad del Nivel/Grado
        $totalLevelEnrollments = Enrollment::whereHas('section', function($q) use ($schoolLevel) {
                $q->where('school_level_id', $schoolLevel->id);
            })
            ->where('status', Enrollment::STATUS_ACTIVE)
            ->count();

        if ($level->max_capacity > 0 && $totalLevelEnrollments >= $level->max_capacity) {
            throw new Exception("Capacidad máxima para el nivel {$level->name} alcanzada ({$level->max_capacity}).");
        }
    }

    /**
     * Busca una sección con cupo o crea una nueva si el nivel lo permite.
     */
    protected function findOrCreateOpportuneSection(SchoolLevel $schoolLevel): Section
    {
        $maxPerRoom = config('app.max_section_capacity', env('MAX_SECTION_CAPACITY', 40));

        // 1. Buscar seccion existente con cupo
        $sections = $schoolLevel->sections()->withCount(['enrollments' => function($q) {
            $q->where('status', Enrollment::STATUS_ACTIVE);
        }])->get();

        foreach ($sections as $section) {
            if ($section->enrollments_count < $maxPerRoom) {
                return $section;
            }
        }

        // 2. Si llegamos aquí, todas las existentes están llenas.
        return $this->autoCreateNextSection($schoolLevel, $sections->count());
    }

    /**
     * Crea automáticamente el siguiente paralelo (A -> B -> C...).
     */
    protected function autoCreateNextSection(SchoolLevel $schoolLevel, int $currentCount): Section
    {
        $alphabet = range('A', 'Z');
        $nextName = $alphabet[$currentCount] ?? "Sección " . ($currentCount + 1);

        $section = Section::create([
            'school_id' => $schoolLevel->school_id,
            'school_level_id' => $schoolLevel->id,
            'name' => $nextName,
            'created_by' => auth()->id(),
        ]);

        // Disparar evento para que el sistema reaccione (logística, notificaciones, etc.)
        event(new SectionAutoCreated($section));

        return $section;
    }
}
