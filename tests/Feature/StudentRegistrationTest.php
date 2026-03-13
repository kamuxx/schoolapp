<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class StudentRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear roles necesarios
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'estudiante', 'guard_name' => 'web']);
        
        // Crear escuela
        $this->school = School::create([
            'name' => 'Escuela Test',
            'slug' => 'escuela-test',
            'is_active' => true,
        ]);
        
        // Crear usuario administrador
        $this->admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'school_id' => $this->school->id,
            'is_active' => true,
        ]);
        $this->admin->assignRole('admin');
    }

    public function test_student_registration_creates_user_when_email_provided()
    {
        $this->actingAs($this->admin);

        $studentData = [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan.perez@test.com',
            'student_code' => 'STU001',
            'gender' => 'Masculino',
            'guardian_name' => 'María Pérez',
            'guardian_phone' => '123456789',
            'guardian_relationship' => 'Madre',
            'national_id_number' => '12345678',
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Estudiante inscrito exitosamente.');

        // Verificar que el estudiante fue creado
        $this->assertDatabaseHas('students', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'student_code' => 'STU001',
            'school_id' => $this->school->id,
        ]);

        // Verificar que el usuario fue creado
        $this->assertDatabaseHas('users', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan.perez@test.com',
            'school_id' => $this->school->id,
        ]);

        // Verificar que el usuario tiene el rol de estudiante
        $student = Student::where('student_code', 'STU001')->first();
        $user = $student->user;
        $this->assertTrue($user->hasRole('estudiante'));

        // Verificar que el representante fue creado
        $this->assertDatabaseHas('guardians', [
            'student_id' => $student->id,
            'name' => 'María Pérez',
            'phone' => '123456789',
            'relationship' => 'Madre',
            'is_main' => true,
            'is_emergency' => true,
        ]);
    }

    public function test_student_registration_without_email_creates_student_only()
    {
        $this->actingAs($this->admin);

        $studentData = [
            'first_name' => 'Ana',
            'last_name' => 'Gómez',
            'student_code' => 'STU002',
            'gender' => 'Femenino',
            'guardian_name' => 'Carlos Gómez',
            'guardian_phone' => '987654321',
            'guardian_relationship' => 'Padre',
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Estudiante inscrito exitosamente.');

        // Verificar que el estudiante fue creado
        $this->assertDatabaseHas('students', [
            'first_name' => 'Ana',
            'last_name' => 'Gómez',
            'student_code' => 'STU002',
            'school_id' => $this->school->id,
        ]);

        // Verificar que no se creó usuario
        $this->assertDatabaseMissing('users', [
            'first_name' => 'Ana',
            'last_name' => 'Gómez',
        ]);

        // Verificar que el representante fue creado
        $student = Student::where('student_code', 'STU002')->first();
        $this->assertDatabaseHas('guardians', [
            'student_id' => $student->id,
            'name' => 'Carlos Gómez',
            'phone' => '987654321',
            'relationship' => 'Padre',
        ]);
    }

    public function test_student_registration_fails_with_duplicate_email()
    {
        $this->actingAs($this->admin);

        // Crear un usuario existente con el email
        User::create([
            'first_name' => 'Existente',
            'last_name' => 'Usuario',
            'name' => 'Existente Usuario',
            'email' => 'existente@test.com',
            'password' => Hash::make('password'),
            'school_id' => $this->school->id,
        ]);

        $studentData = [
            'first_name' => 'Nuevo',
            'last_name' => 'Estudiante',
            'email' => 'existente@test.com', // Email duplicado
            'student_code' => 'STU003',
            'gender' => 'Masculino',
            'guardian_name' => 'Padre Test',
            'guardian_phone' => '555555555',
            'guardian_relationship' => 'Padre',
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        // Los errores de validación se guardan en session con clave 'errors'
        $response->assertSessionHasErrors(['email' => 'Este correo ya está registrado.']);

        // Verificar que no se creó el estudiante
        $this->assertDatabaseMissing('students', [
            'student_code' => 'STU003',
        ]);
    }

    public function test_student_registration_requires_authentication()
    {
        $studentData = [
            'first_name' => 'No',
            'last_name' => 'Autenticado',
            'email' => 'noauth@test.com',
            'student_code' => 'STU004',
            'gender' => 'Masculino',
            'guardian_name' => 'Representante',
            'guardian_phone' => '111111111',
            'guardian_relationship' => 'Padre',
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect('/login');
    }
}
