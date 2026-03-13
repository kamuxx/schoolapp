<?php

namespace App\UseCases;

use App\Repositories\StudentRepository;
use App\Repositories\UserRepository;
use App\Repositories\GuardianRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class StudentUseCase
{
    public $studentRepository;
    public $userRepository;
    public $guardianRepository;

    public function __construct(
        StudentRepository $studentRepository,
        UserRepository $userRepository,
        GuardianRepository $guardianRepository
    ) {
        $this->studentRepository = $studentRepository;
        $this->userRepository = $userRepository;
        $this->guardianRepository = $guardianRepository;
    }

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
        if(!auth()->check()){
            throw new Exception("Sesion experidada, inicie sesion nuevamente");
        }
        
        Log::info('Iniciando proceso de creación de estudiante', ['data' => $data]);
        
        // Usar transacción para asegurar integridad
        return DB::transaction(function () use ($data) {
            // Verificar que el email no exista antes de crear
            if (isset($data['email'])) {
                $existingUser = $this->userRepository->findByEmail($data['email']);
                if ($existingUser) {
                    throw new Exception("El email {$data['email']} ya está registrado en el sistema");
                }
            }

            $user = auth()->user();
            $schoolId = $user->school_id;
            
            // Fallback para administradores si no tienen escuela asignada
            if (!$schoolId && $user->hasRole('super_admin')) {
                $firstSchool = \App\Models\School::first();
                if ($firstSchool) {
                    $schoolId = $firstSchool->id;
                    Log::info('Fallback: Usando primera escuela disponible para super_admin', ['school_id' => $schoolId]);
                }
            }

            Log::info('Usando school_id para el registro', ['school_id' => $schoolId]);
            
            if (!$schoolId) {
                throw new Exception("Su usuario no tiene una escuela asignada. Por favor, asigne una escuela a su perfil para continuar.");
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
                'is_active' => $data['is_active'] ?? true,
                'created_by' => auth()->id(),
            ];

            // Crear usuario para el estudiante si se proporciona email
            $user = null;
            if (isset($data['email']) && !empty($data['email'])) {
                // Generar contraseña temporal segura
                $tempPassword = $data['national_id_number'] ?? Str::random(8);
                $hashedPassword = Hash::make($tempPassword);
                
                $user = $this->userRepository->create([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'name' => trim($data['first_name'] . " " . $data['last_name']),
                    'email' => $data['email'],
                    'password' => $hashedPassword,
                    'school_id' => auth()->user()->school_id,
                    'is_active' => true,
                    'created_by' => auth()->id(),
                ]);

                // Asignar rol de estudiante
                $user->assignRole('estudiante');

                Log::info('Usuario creado para estudiante', ['user_id' => $user->id, 'email' => $data['email']]);
                // Vincular el usuario al estudiante
                $studentData['user_id'] = $user->id;
            }

            Log::info('Preparando registro de estudiante', ['student_data' => $studentData]);

            // Crear estudiante
            $student = $this->studentRepository->create($studentData);
            Log::info('Estudiante creado exitosamente', ['student_id' => $student->id]);

            // Crear representante principal
            Log::info('Creando representante', [
                'name' => $data['guardian_name'],
                'phone' => $data['guardian_phone']
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

            // Si se creó usuario, registrar log de seguridad
            if ($user) {
                Log::info('Usuario creado para estudiante', [
                    'student_id' => $student->id,
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'created_by' => auth()->id(),
                ]);
            }

            Log::info('Proceso de inscripción completado con éxito', ['student_id' => $student->id]);
            return $student;
        });
    }

    public function updateStudent(int $id, array $data)
    {
        $student = $this->studentRepository->find($id);
        
        if (!$student) {
            return null;
        }

        // Actualizar usuario usando repositorio
        $this->updateUser($student->user_id, $data);
        
        // Actualizar estudiante usando repositorio
        $this->updateStudentData($id, $data);
        
        // Actualizar o crear representante usando repositorio
        $this->updateOrCreateGuardian($student->id, $data);

        return $student->fresh();
    }

    private function updateUser(int $userId, array $data): void
    {
        $userData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
        ];

        $this->userRepository->update($userId, $userData);
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
