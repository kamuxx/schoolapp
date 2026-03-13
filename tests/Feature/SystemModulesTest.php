<?php

use App\Models\User;
use App\Models\School;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Spatie\Permission\Models\Role;

uses(DatabaseTransactions::class);

beforeEach(function () {
    if (!Role::where('name', 'super_admin')->exists()) {
        Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
    }

    $this->school = School::firstOrCreate([
        'name' => 'Default School Test',
        'slug' => 'default-school-test',
        'is_active' => true
    ]);

    $this->saUser = User::factory()->create([
        'email' => 'sa_system_test@schoolapp.com',
        'school_id' => null
    ]);
    $this->saUser->assignRole('super_admin');

    $this->adminUser = User::factory()->create([
        'email' => 'admin_system_test@schoolapp.com',
        'school_id' => $this->school->id,
    ]);
    $this->adminUser->assignRole('admin');
});

$modules = [
    '/institucional/materias',
    '/institucional/niveles',
    '/filiacion/docentes',
    '/filiacion/estudiantes',
    '/operativa/asistencia',
    '/operativa/incidencias',
    '/operativa/notas',
    '/config/permisos',
    '/config/roles',
    '/config/usuarios',
    '/config/escuelas',
    '/config/anios-escolares',
];

foreach ($modules as $module) {
    test("super admin can access $module", function () use ($module) {
        $response = $this->actingAs($this->saUser)->get($module);
        $response->assertStatus(200);
    });

    test("school admin can access $module", function () use ($module) {
        $response = $this->actingAs($this->adminUser)->get($module);
        $response->assertStatus(200);
    });
}
