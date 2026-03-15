<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Level;
use App\Models\School;
use App\Models\SchoolLevel;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StudentRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected $school;

    protected $admin;

    protected $schoolLevel;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'estudiante', 'guard_name' => 'web']);

        $this->school = School::create([
            'name' => 'Escuela Test',
            'slug' => 'escuela-test',
            'is_active' => true,
            'max_capacity' => 1000,
        ]);

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

        $level = Level::create([
            'name' => '1ro Primaria',
            'slug' => '1ro-primaria',
            'stage' => 'Primaria',
            'order' => 1,
            'max_capacity' => 200,
        ]);

        $academicYear = AcademicYear::create([
            'school_id' => $this->school->id,
            'name' => '2025',
            'start_date' => '2025-01-01',
            'end_date' => '2025-12-31',
            'is_active' => true,
        ]);

        $this->schoolLevel = SchoolLevel::create([
            'school_id' => $this->school->id,
            'level_id' => $level->id,
            'academic_year_id' => $academicYear->id,
            'is_active' => true,
        ]);

        Section::create([
            'school_id' => $this->school->id,
            'school_level_id' => $this->schoolLevel->id,
            'name' => 'A',
        ]);
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
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Estudiante inscrito exitosamente.');

        $this->assertDatabaseHas('students', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'student_code' => 'STU001',
            'school_id' => $this->school->id,
        ]);

        $this->assertDatabaseHas('users', [
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan.perez@test.com',
            'school_id' => $this->school->id,
        ]);

        $student = Student::where('student_code', 'STU001')->first();
        $user = $student->user;
        $this->assertTrue($user->hasRole('estudiante'));

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
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Estudiante inscrito exitosamente.');

        $this->assertDatabaseHas('students', [
            'first_name' => 'Ana',
            'last_name' => 'Gómez',
            'student_code' => 'STU002',
            'school_id' => $this->school->id,
        ]);

        $this->assertDatabaseMissing('users', [
            'first_name' => 'Ana',
            'last_name' => 'Gómez',
        ]);

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
            'email' => 'existente@test.com',
            'student_code' => 'STU003',
            'gender' => 'Masculino',
            'guardian_name' => 'Padre Test',
            'guardian_phone' => '555555555',
            'guardian_relationship' => 'Padre',
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['email' => 'Este correo ya está registrado.']);

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
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect('/login');
    }

    public function test_student_auto_enrolled_in_section()
    {
        $this->actingAs($this->admin);

        $studentData = [
            'first_name' => 'Auto',
            'last_name' => 'Enroll',
            'student_code' => 'STU005',
            'gender' => 'Masculino',
            'guardian_name' => 'Tutor Test',
            'guardian_phone' => '222222222',
            'guardian_relationship' => 'Tutor',
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $student = Student::where('student_code', 'STU005')->first();

        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'school_id' => $this->school->id,
            'status' => 'active',
        ]);
    }

    public function test_new_section_created_when_capacity_reached()
    {
        $this->actingAs($this->admin);

        $section = Section::where('school_level_id', $this->schoolLevel->id)->first();

        for ($i = 1; $i <= 40; $i++) {
            $student = Student::create([
                'school_id' => $this->school->id,
                'first_name' => 'Student'.$i,
                'last_name' => 'Test',
                'student_code' => 'STU'.str_pad($i, 3, '0', STR_PAD_LEFT),
                'gender' => 'Masculino',
                'condition' => 'nuevo',
                'created_by' => $this->admin->id,
            ]);

            \App\Models\Enrollment::create([
                'school_id' => $this->school->id,
                'student_id' => $student->id,
                'section_id' => $section->id,
                'academic_year_id' => $this->schoolLevel->academic_year_id,
                'status' => 'active',
                'created_by' => $this->admin->id,
            ]);
        }

        $this->assertDatabaseHas('sections', [
            'school_level_id' => $this->schoolLevel->id,
            'name' => 'A',
        ]);

        $this->assertEquals(40, $section->enrollments()->where('status', 'active')->count());

        $studentData = [
            'first_name' => 'Overflow',
            'last_name' => 'Student',
            'student_code' => 'STU999',
            'gender' => 'Masculino',
            'guardian_name' => 'Tutor Overflow',
            'guardian_phone' => '999999999',
            'guardian_relationship' => 'Tutor',
            'condition' => 'nuevo',
            'school_level_id' => $this->schoolLevel->id,
        ];

        $response = $this->post('/filiacion/estudiantes', $studentData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Estudiante inscrito exitosamente.');

        $this->assertDatabaseHas('sections', [
            'school_level_id' => $this->schoolLevel->id,
            'name' => 'B',
        ]);
    }
}
