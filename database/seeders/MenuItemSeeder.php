<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Siembra los módulos del sistema SchoolApp extraídos del PRD (gemini.md).
 * Estructura jerárquica: Módulo Raíz → Opciones de menú.
 *
 * Roles disponibles: super_admin, admin, director, secretaria, coordinador, docente
 */
class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiamos sin disparar eventos de BD para respetar la FK auto-referencial
        DB::statement('PRAGMA foreign_keys = OFF;');
        DB::table('menu_items')->truncate();
        DB::statement('PRAGMA foreign_keys = ON;');

        // ───────────────────────────────────────────────────────────────
        // SEMANA 1 — Módulo Institucional
        // ───────────────────────────────────────────────────────────────
        $institucional = DB::table('menu_items')->insertGetId([
            'parent_id'  => null,
            'label'      => 'Institucional',
            'path'       => null,
            'icon'       => 'Building2',
            'roles'      => json_encode(['super_admin', 'admin']),
            'sort_order' => 10,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('menu_items')->insert([
            [
                'parent_id'  => $institucional,
                'label'      => 'Perfil Escolar',
                'path'       => '/institucional/perfil',
                'icon'       => 'Landmark',
                'roles'      => json_encode(['super_admin', 'admin']),
                'sort_order' => 11,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $institucional,
                'label'      => 'Niveles y Paralelos',
                'path'       => '/institucional/niveles',
                'icon'       => 'Layers',
                'roles'      => json_encode(['super_admin', 'admin']),
                'sort_order' => 12,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $institucional,
                'label'      => 'Materias',
                'path'       => '/institucional/materias',
                'icon'       => 'BookMarked',
                'roles'      => json_encode(['super_admin', 'admin']),
                'sort_order' => 13,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ───────────────────────────────────────────────────────────────
        // SEMANA 2 — Módulo Filiativo
        // ───────────────────────────────────────────────────────────────
        $filiativo = DB::table('menu_items')->insertGetId([
            'parent_id'  => null,
            'label'      => 'Filiación',
            'path'       => null,
            'icon'       => 'Users',
            'roles'      => json_encode(['super_admin', 'admin', 'secretaria']),
            'sort_order' => 20,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('menu_items')->insert([
            [
                'parent_id'  => $filiativo,
                'label'      => 'Estudiantes',
                'path'       => '/filiacion/estudiantes',
                'icon'       => 'UserRound',
                'roles'      => json_encode(['super_admin', 'admin', 'secretaria', 'coordinador']),
                'sort_order' => 21,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $filiativo,
                'label'      => 'Docentes',
                'path'       => '/filiacion/docentes',
                'icon'       => 'UserCog',
                'roles'      => json_encode(['super_admin', 'admin', 'secretaria']),
                'sort_order' => 22,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $filiativo,
                'label'      => 'Carga Horaria',
                'path'       => '/filiacion/carga-horaria',
                'icon'       => 'CalendarRange',
                'roles'      => json_encode(['super_admin', 'admin', 'coordinador']),
                'sort_order' => 23,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $filiativo,
                'label'      => 'Evaluaciones Dimensionales',
                'path'       => '/filiacion/evaluaciones',
                'icon'       => 'ListChecks',
                'roles'      => json_encode(['super_admin', 'admin', 'coordinador', 'docente']),
                'sort_order' => 24,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ───────────────────────────────────────────────────────────────
        // SEMANA 3 — Módulo Operativo
        // ───────────────────────────────────────────────────────────────
        $operativo = DB::table('menu_items')->insertGetId([
            'parent_id'  => null,
            'label'      => 'Operativa',
            'path'       => null,
            'icon'       => 'Activity',
            'roles'      => json_encode(['super_admin', 'admin', 'director', 'coordinador', 'docente']),
            'sort_order' => 30,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('menu_items')->insert([
            [
                'parent_id'  => $operativo,
                'label'      => 'Dashboard',
                'path'       => '/dashboard',
                'icon'       => 'LayoutGrid',
                'roles'      => json_encode(['super_admin', 'admin', 'director', 'coordinador', 'docente', 'secretaria']),
                'sort_order' => 31,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $operativo,
                'label'      => 'Asistencia Diaria',
                'path'       => '/operativa/asistencia',
                'icon'       => 'ClipboardCheck',
                'roles'      => json_encode(['docente', 'coordinador']),
                'sort_order' => 32,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $operativo,
                'label'      => 'Cuadro de Honor',
                'path'       => '/operativa/cuadro-honor',
                'icon'       => 'Trophy',
                'roles'      => json_encode(['super_admin', 'admin', 'director', 'coordinador', 'secretaria']),
                'sort_order' => 33,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $operativo,
                'label'      => 'Centralizador',
                'path'       => '/operativa/centralizador',
                'icon'       => 'BarChart3',
                'roles'      => json_encode(['super_admin', 'admin', 'director', 'coordinador']),
                'sort_order' => 34,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ───────────────────────────────────────────────────────────────
        // SEMANA 4 — Módulo Certificación
        // ───────────────────────────────────────────────────────────────
        $certificacion = DB::table('menu_items')->insertGetId([
            'parent_id'  => null,
            'label'      => 'Certificación',
            'path'       => null,
            'icon'       => 'FileCheck2',
            'roles'      => json_encode(['super_admin', 'admin', 'director', 'secretaria']),
            'sort_order' => 40,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('menu_items')->insert([
            [
                'parent_id'  => $certificacion,
                'label'      => 'Boletines',
                'path'       => '/certificacion/boletines',
                'icon'       => 'FileText',
                'roles'      => json_encode(['super_admin', 'admin', 'director', 'secretaria']),
                'sort_order' => 41,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $certificacion,
                'label'      => 'Reportes Ministerio',
                'path'       => '/certificacion/ministerio',
                'icon'       => 'Scroll',
                'roles'      => json_encode(['super_admin', 'admin', 'director']),
                'sort_order' => 42,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ───────────────────────────────────────────────────────────────
        // Módulo de Configuración (Super Admin / Admin)
        // ───────────────────────────────────────────────────────────────
        $config = DB::table('menu_items')->insertGetId([
            'parent_id'  => null,
            'label'      => 'Configuración',
            'path'       => null,
            'icon'       => 'Settings',
            'roles'      => json_encode(['super_admin', 'admin']),
            'sort_order' => 90,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('menu_items')->insert([
            [
                'parent_id'  => $config,
                'label'      => 'Gestión de Escuelas',
                'path'       => '/config/escuelas',
                'icon'       => 'School',
                'roles'      => json_encode(['super_admin']),
                'sort_order' => 91,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $config,
                'label'      => 'Usuarios y Roles',
                'path'       => '/config/usuarios',
                'icon'       => 'ShieldCheck',
                'roles'      => json_encode(['super_admin', 'admin']),
                'sort_order' => 92,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'parent_id'  => $config,
                'label'      => 'Gestión Académica',
                'path'       => '/config/gestion',
                'icon'       => 'CalendarDays',
                'roles'      => json_encode(['super_admin', 'admin']),
                'sort_order' => 93,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
