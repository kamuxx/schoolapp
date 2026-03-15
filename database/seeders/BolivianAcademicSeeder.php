<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Level;
use App\Models\School;
use App\Models\SchoolLevel;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BolivianAcademicSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtener el colegio principal
        $school = School::firstOrCreate(
            ['slug' => 'colegio-experimental'],
            [
                'name' => 'Colegio Experimental',
                'country' => 'Bolivia',
                'academic_system' => 'trimestral',
                'educational_stages' => ['secundaria'],
                'logo_url' => 'https://ui-avatars.com/api/?name=Colegio+Experimental&background=random',
                'phone' => '+591 67890123',
                'address' => 'Av. Principal 123',
                'city' => 'Cochabamba',
                'is_active' => true,
                'max_capacity' => 480,
            ]
        );
        if (! $school) {
            return;
        }

        User::where('is_active', 1)->update(['school_id' => $school->id]);

        // 2. Obtener o crear el Año Académico
        $academicYear = AcademicYear::firstOrCreate(
            [
                'name' => date('Y'),
                'school_id' => $school->id,
            ],
            ['is_active' => true]
        );

        // 3. Catálogo de Materias por Etapa
        $materiasBolivia = [
            'primaria' => [
                ['name' => 'Comunicación y Lenguajes', 'short_name' => 'LENG'],
                ['name' => 'Matemática', 'short_name' => 'MAT'],
                ['name' => 'Ciencias Naturales', 'short_name' => 'C. NAT'],
                ['name' => 'Ciencias Sociales', 'short_name' => 'C. SOC'],
                ['name' => 'Artes Plásticas y Visuales', 'short_name' => 'ARTES'],
                ['name' => 'Educación Musical', 'short_name' => 'MÚSICA'],
                ['name' => 'Educación Física y Deportes', 'short_name' => 'ED. FÍSICA'],
                ['name' => 'Técnica Tecnológica', 'short_name' => 'TÉCNICA'],
                ['name' => 'Valores, Espiritualidad y Religiones', 'short_name' => 'RELIGIÓN'],
            ],
            'secundaria' => [
                ['name' => 'Comunicación y Lenguajes', 'short_name' => 'LENG'],
                ['name' => 'Matemática', 'short_name' => 'MAT'],
                ['name' => 'Biología - Geografía', 'short_name' => 'BIO-GEO'],
                ['name' => 'Física', 'short_name' => 'FIS'],
                ['name' => 'Química', 'short_name' => 'QUI'],
                ['name' => 'Ciencias Sociales', 'short_name' => 'C. SOC'],
                ['name' => 'Cosmovisiones, Filosofía y Sicología', 'short_name' => 'FILO'],
                ['name' => 'Artes Plásticas y Visuales', 'short_name' => 'ARTES'],
                ['name' => 'Educación Musical', 'short_name' => 'MÚSICA'],
                ['name' => 'Educación Física y Deportes', 'short_name' => 'ED. FÍSICA'],
                ['name' => 'Técnica Tecnológica General / Especializada', 'short_name' => 'T.T.'],
                ['name' => 'Valores, Espiritualidad y Religiones', 'short_name' => 'RELIGIÓN'],
                ['name' => 'Lengua Extranjera (Inglés)', 'short_name' => 'INGLÉS'],
            ],
        ];

        // 4. Vincular niveles del catálogo a la escuela (SchoolLevel)
        $activeStages = ['primaria', 'secundaria'];
        $catLevels = Level::whereIn('stage', $activeStages)->orderBy('order')->get();

        foreach ($catLevels as $lvl) {
            $schoolLevel = SchoolLevel::firstOrCreate([
                'school_id' => $school->id,
                'level_id' => $lvl->id,
                'academic_year_id' => $academicYear->id,
            ]);

            // 5. Asignar materias dinámicamente al nivel del plantel
            $levelSubjects = $materiasBolivia[$lvl->stage] ?? [];
            foreach ($levelSubjects as $matData) {
                $subject = Subject::updateOrCreate(
                    ['name' => $matData['name'], 'school_id' => $school->id],
                    ['short_name' => $matData['short_name']]
                );

                DB::table('school_subject_level')->updateOrInsert(
                    [
                        'school_id' => $school->id,
                        'school_level_id' => $schoolLevel->id,
                        'subject_id' => $subject->id,
                    ],
                    ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}
