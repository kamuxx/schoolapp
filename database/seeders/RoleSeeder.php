<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

/**
 * RoleSeeder
 * 
 * Crea los 8 roles base del sistema escolar Multi-Tenant.
 * No asigna permisos, ya que eso podría escalarse con Filament Shield después.
 */
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Basados estrictamente en gemini.md
        $roles_mvp = [
            'super_admin',
            'admin',
            'director',
            'secretaria',
            'coordinador',
            'docente',
        ];

        // Planeados
        $roles_v2 = [
            'estudiante',
            'representante'
        ];

        $all_roles = array_merge($roles_mvp, $roles_v2);

        foreach ($all_roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web' // Usamos guard web nativo por ahora, Inertia y Filament pueden compartirlo.
            ]);
        }
    }
}
