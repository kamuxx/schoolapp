<?php

namespace App\UseCases;

use App\Repositories\GuardianRepository;
use App\Repositories\LevelRepository;
use App\Repositories\SchoolRepository;
use App\Repositories\StudentRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentUseCase
{
    public function __construct(
        private readonly StudentRepository $studentRepository,
        private readonly GuardianRepository $guardianRepository,
        private readonly EnrollmentUseCase $enrollmentUseCase,
        private readonly SchoolRepository $school_repository,
        private readonly LevelRepository $levelRepository,
    ) {}

    public function listStudents(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->studentRepository->search($filters, $perPage, $offset);
    }

    public function createStudent(array $data)
    {
        if (! auth()->check()) {
            throw new Exception('Sesion experidada, inicie sesion nuevamente');
        }

        Log::info('Iniciando proceso de creación de estudiante', ['data' => $data]);

        return DB::transaction(function () use ($data) {
            $user = auth()->user();
            $schoolId = $user->school_id;

            if (! $schoolId && $user->isSuperAdmin()) {
                $firstSchool = $this->school_repository->first();
                if ($firstSchool) {
                    $schoolId = $firstSchool->id;
                    Log::info('Fallback: Usando primera escuela disponible para super_admin', ['school_id' => $schoolId]);
                }
            }

            Log::info('Usando school_id para el registro', ['school_id' => $schoolId]);

            if (! $schoolId && ! $user->hasAnyRoles(['super_admin', 'admin'])) {
                throw new Exception('Su usuario no tiene una escuela asignada. Por favor, asigne una escuela a su perfil para continuar.');
            }

            // Preparar datos del estudiante
            $studentData = [
                'school_id' => $schoolId,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'birth_date' => $data['birth_date'] ?? null,
                'national_id_type' => $data['national_id_type'] ?? null,
                'national_id_number' => $data['national_id_number'] ?? null,
                'student_code' => $data['student_code'],
                'blood_type' => $data['blood_type'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'gender' => $data['gender'],
                'photo_path' => $data['photo_path'] ?? null,
                'condition' => $data['condition'] ?? 'nuevo',
                'is_active' => $data['is_active'] ?? true,
                'created_by' => auth()->id(),
            ];

            Log::info('Preparando registro de estudiante', ['student_data' => $studentData]);

            // Crear estudiante
            $student = $this->studentRepository->create($studentData);
            Log::info('Estudiante creado exitosamente', ['student_id' => $student->id]);

            // Proceso de Inscripción Automática
            if (isset($data['school_level_id'])) {
                $this->enrollmentUseCase->enrollStudent($student, $data['school_level_id']);
                Log::info('Estudiante inscrito en sección automáticamente', [
                    'student_id' => $student->id,
                    'school_level_id' => $data['school_level_id'],
                ]);
            }

            // Crear representante principal
            Log::info('Creando representante', [
                'name' => $data['guardian_name'],
                'phone' => $data['guardian_phone'],
            ]);
            $this->guardianRepository->create([
                'student_id' => $student->id,
                'name' => $data['guardian_name'],
                'phone' => $data['guardian_phone'],
                'relationship' => $data['guardian_relationship'],
                'is_main' => true,
                'is_emergency' => true,
                'created_by' => auth()->id(),
            ]);

            Log::info('Proceso de inscripción completado con éxito', ['student_id' => $student->id]);

            return $student;
        });
    }

    public function updateStudent(int $id, array $data)
    {
        $student = $this->studentRepository->find($id);

        if (! $student) {
            return null;
        }

        // Actualizar estudiante
        $this->updateStudentData($id, $data);

        // Actualizar o crear representante
        $this->updateOrCreateGuardian($student->id, $data);

        return $student->fresh();
    }

    private function updateStudentData(int $studentId, array $data): void
    {
        $studentData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'birth_date' => $data['birth_date'] ?? null,
            'national_id_type' => $data['national_id_type'] ?? null,
            'national_id_number' => $data['national_id_number'] ?? null,
            'student_code' => $data['student_code'],
            'blood_type' => $data['blood_type'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'gender' => $data['gender'],
            'photo_path' => $data['photo_path'] ?? null,
            'condition' => $data['condition'] ?? 'nuevo',
            'is_active' => $data['is_active'] ?? true,
            'updated_by' => auth()->id(),
        ];

        $this->studentRepository->update($studentId, $studentData);
    }

    private function updateOrCreateGuardian(int $studentId, array $data): void
    {
        $guardianData = [
            'name' => $data['guardian_name'],
            'phone' => $data['guardian_phone'],
            'relationship' => $data['guardian_relationship'],
            'updated_by' => auth()->id(),
        ];

        $mainGuardian = $this->guardianRepository->findMainByStudent($studentId);

        if ($mainGuardian) {
            $this->guardianRepository->update($mainGuardian->id, $guardianData);
        } else {
            $newGuardianData = array_merge($guardianData, [
                'student_id' => $studentId,
                'is_main' => true,
                'is_emergency' => true,
                'created_by' => auth()->id(),
            ]);

            $this->guardianRepository->create($newGuardianData);
        }
    }

    public function deleteStudent(int $id)
    {
        return $this->studentRepository->delete($id);
    }
}
