<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

/**
 * PermissionSeeder
 * 
 * Genera el catálogo completo de permisos del sistema cruzando las Entidades 
 * de negocio (SaaS LATAM) con las acciones estándar que expone Filament Shield.
 * Adicionalmente, ata todos los permisos generados al rol `super_admin`.
 */
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiamos caché de Spatie para evitar bugs de registro
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Acciones estándar (CRUD) que Filament Shield detecta y usa
        $actions = [
            'view_any',
            'view',
            'create',
            'update',
            'delete',
            'delete_any',
            'force_delete',
            'force_delete_any',
            'restore',
            'restore_any',
            'replicate',
            'reorder',
        ];

        // Todas las entidades core del sistema definidas en la arquitectura
        $entities = [
            'school',
            'user',
            'academic_year',
            'term',
            'level',
            'section',
            'subject',
            'student',
            'enrollment',
            'course_subject_teacher',
            'incident_type',
            'incident',
            'attendance',
            'evaluation_activity',
            'grade',
            // Spatie
            'role',
            'permission',
        ];

        $permissionsToInsert = [];

        // Permisos de sistema / Filament específicos
        $permissionsToInsert[] = ['name' => 'view_shield', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()];
        $permissionsToInsert[] = ['name' => 'page_ShieldSettingsPage', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()];
        $permissionsToInsert[] = ['name' => 'widget_AccountWidget', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()];
        $permissionsToInsert[] = ['name' => 'widget_FilamentInfoWidget', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()];

        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissionsToInsert[] = [
                    'name' => "{$action}_{$entity}",
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Inserción en bloque masiva optimizada (insertOrIgnore previene duplicados)
        foreach (array_chunk($permissionsToInsert, 100) as $chunk) {
            Permission::insertOrIgnore($chunk);
        }

        // Otorgar acceso absoluto al Super Admin como base operativa de Filament
        $superAdmin = Role::where('name', 'super_admin')->first();
        if ($superAdmin) {
            $superAdmin->givePermissionTo(Permission::all());
        }
    }
}
