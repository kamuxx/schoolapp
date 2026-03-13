<?php

use App\Models\User;
use App\Models\School;
use App\Models\Level;
use App\Models\EducationalStage;
use App\Models\AcademicYear;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Spatie\Permission\Models\Role;

uses(DatabaseTransactions::class);

beforeEach(function () {
    if (!Role::where('name', 'super_admin')->exists()) {
        Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
    }

    $this->school = School::firstOrCreate([
        'name' => 'Default School',
        'slug' => 'default-school',
        'is_active' => true
    ]);

    $this->saUser = User::factory()->create([
        'email' => 'sa_test@schoolapp.com',
        'school_id' => null
    ]);
    $this->saUser->assignRole('super_admin');

    $this->adminUser = clone User::factory()->create([
        'email' => 'admin_test@schoolapp.com',
    ]);
    $this->adminUser->assignRole('admin');
});

test('super admin can access levels page without throwing school relation errors', function () {
    $response = $this->actingAs($this->saUser)->get('/institucional/niveles');
    
    $response->assertStatus(200);
    $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
        ->component('institucional/niveles/index')
        ->has('levels')
        ->has('educationalStages')
        ->has('academicYears')
    );
});

test('school admin can access levels page without throwing school relation errors', function () {
    // Nos aseguramos de que el admin tenga un school_id asignado para la prueba
    if (!$this->adminUser->school_id) {
        $school = School::firstOrCreate([
            'name' => 'Admin School Test',
            'slug' => 'admin-school-test',
            'is_active' => true
        ]);
        $this->adminUser->update(['school_id' => $school->id]);
    }

    $response = $this->actingAs($this->adminUser)->get('/institucional/niveles');
    
    $response->assertStatus(200);
    $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
        ->component('institucional/niveles/index')
        ->has('levels')
        ->has('educationalStages')
        ->has('academicYears')
    );
});

test('it filters levels correctly by assigned school', function () {
    // Asegurarnos de tener 2 escuelas
    $school1 = School::firstOrCreate(['name' => 'School 1', 'slug' => 's1']);
    $school2 = School::firstOrCreate(['name' => 'School 2', 'slug' => 's2']);
    
    $academicYear = AcademicYear::firstOrCreate([
        'school_id' => $school1->id,
        'name' => '2026',
        'is_active' => true
    ]);

    $stage = EducationalStage::firstOrCreate(['name' => 'Primaria']);
    $school1->educationalStages()->syncWithoutDetaching([$stage->id]);
    
    // Crear nivel en School 1
    $levelSchool1 = Level::create([
        'school_id' => $school1->id,
        'name' => 'Nivel 1 S1',
        'educational_stage_id' => $stage->id,
        'academic_year_id' => $academicYear->id
    ]);

    // Asignar Admin a School 1
    $this->adminUser->update(['school_id' => $school1->id]);

    $response = $this->actingAs($this->adminUser)->get('/institucional/niveles');
    $response->assertStatus(200);
    
    $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
        ->where('levels.0.name', 'Nivel 1 S1')
    );
});
