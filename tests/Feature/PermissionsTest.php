<?php

use App\Models\User;
use App\Models\Permission;
use Illuminate\Foundation\Testing\DatabaseTransactions;

uses(DatabaseTransactions::class);

beforeEach(function () {
    // Setup a user with 'super_admin' role or permissions to access the module
    $this->user = User::factory()->create([
        'email' => 'sa@schoolapp.com',
    ]);
    // Assigning super_admin role manually if Spatie Permission is configured this way
    \Spatie\Permission\Models\Role::create(['name' => 'super_admin']);
    $this->user->assignRole('super_admin');
});

test('can view permissions list', function () {
    $response = $this->actingAs($this->user)->get('/config/permisos');
    
    $response->assertStatus(200);
});

test('can create a permission', function () {
    $response = $this->actingAs($this->user)->post('/config/permisos', [
        'name' => 'test.permission',
        'guard_name' => 'web',
        'group' => 'Testing',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Permiso creado correctamente.');
    $this->assertDatabaseHas('permissions', ['name' => 'test.permission']);
});

test('can update a permission', function () {
    $permission = \Spatie\Permission\Models\Permission::create([
        'name' => 'old.permission',
        'guard_name' => 'web'
    ]);

    $response = $this->actingAs($this->user)->patch('/config/permisos/' . $permission->id, [
        'name' => 'updated.permission',
        'guard_name' => 'web',
        'group' => 'Testing',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Permiso actualizado correctamente.');
    $this->assertDatabaseHas('permissions', ['name' => 'updated.permission']);
});

test('can delete a permission', function () {
    $permission = \Spatie\Permission\Models\Permission::create([
        'name' => 'to_be_deleted.permission',
        'guard_name' => 'web'
    ]);

    $response = $this->actingAs($this->user)->delete('/config/permisos/' . $permission->id);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Permiso eliminado correctamente.');
    $this->assertSoftDeleted('permissions', ['name' => 'to_be_deleted.permission']);
});
