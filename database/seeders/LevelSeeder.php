<?php

namespace Database\Seeders;

use App\Models\Level;
use App\Models\School;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

// use App\Models\EducationalStage;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * En este seeder inyectamos las Etapas Educativas y los niveles oficiales
     * correspondientes al sistema educativo boliviano (Ley Avelino Siñani).
     */
    public function run(): void
    {
        // 1. Asegurar que existe al menos un Colegio base
        $school = School::firstOrCreate(
            ['slug' => 'default-school'],
            [
                'name'            => 'Colegio Principal',
                'country'         => 'Bolivia',
                'academic_system' => 'trimestral',
                'educational_stages' => ['secundaria'],
                'is_active'       => true,
                'max_capacity'    => 480,
                'created_by'      => 1,
            ]
        );

        // 2. Asegurar que existe un Año Académico vigente
        $academicYear = AcademicYear::firstOrCreate(
            [
                'name'      => date('Y'),
                'school_id' => $school->id,
            ],
            [
                'is_active'  => true,
            ]
        );

        $nivelesBolivia = [
            // Inicial
            ['name' => '1ra Sección Inicial', 'slug' => '1ra-seccion-inicial', 'stage' => 'inicial', 'order' => 10],
            ['name' => '2da Sección Inicial', 'slug' => '2da-seccion-inicial', 'stage' => 'inicial', 'order' => 20],
            
            // Primaria
            ['name' => '1ro Primaria', 'slug' => '1ro-primaria', 'stage' => 'primaria', 'order' => 110],
            ['name' => '2do Primaria', 'slug' => '2do-primaria', 'stage' => 'primaria', 'order' => 120],
            ['name' => '3ro Primaria', 'slug' => '3ro-primaria', 'stage' => 'primaria', 'order' => 130],
            ['name' => '4to Primaria', 'slug' => '4to-primaria', 'stage' => 'primaria', 'order' => 140],
            ['name' => '5to Primaria', 'slug' => '5to-primaria', 'stage' => 'primaria', 'order' => 150],
            ['name' => '6to Primaria', 'slug' => '6to-primaria', 'stage' => 'primaria', 'order' => 160],
            
            // Secundaria
            ['name' => '1ro Secundaria', 'slug' => '1ro-secundaria', 'stage' => 'secundaria', 'order' => 210],
            ['name' => '2do Secundaria', 'slug' => '2do-secundaria', 'stage' => 'secundaria', 'order' => 220],
            ['name' => '3ro Secundaria', 'slug' => '3ro-secundaria', 'stage' => 'secundaria', 'order' => 230],
            ['name' => '4to Secundaria', 'slug' => '4to-secundaria', 'stage' => 'secundaria', 'order' => 240],
            ['name' => '5to Secundaria', 'slug' => '5to-secundaria', 'stage' => 'secundaria', 'order' => 250],
            ['name' => '6to Secundaria', 'slug' => '6to-secundaria', 'stage' => 'secundaria', 'order' => 260],
        ];

        foreach ($nivelesBolivia as $n) {
            Level::updateOrCreate(
                ['slug' => $n['slug']],
                [
                    'name' => $n['name'],
                    'stage' => $n['stage'],
                    'order' => $n['order'],
                    'is_active' => true,
                    'max_capacity' => floor($school->max_capacity / 6),
                ]
            );
        }
    }
}
