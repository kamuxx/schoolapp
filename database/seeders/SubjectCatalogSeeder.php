<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\Subject;
use App\Models\SubjectCatalog;
use App\Models\SchoolSubjectLevel;
use App\Models\Level;

class SubjectCatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Crea el catálogo atómico de materias y las relaciones N:M
     */
    public function run(): void
    {
        // 1. Validar que exista la escuela
        $school = School::first();
        if (!$school) {
            $this->command->error('No se encontró ninguna escuela. Por favor ejecute el seeder de escuelas primero.');
            return;
        }

        // 2. Crear catálogo atómico de materias (sin duplicados)
        $this->createSubjectCatalog();

    }

    /**
     * Crea el catálogo maestro de materias
     */
    private function createSubjectCatalog(): void
    {
        // Materias únicas del sistema educativo boliviano
        $subjects = [
            ['name' => 'Comunicación y Lenguajes', 'short_name' => 'LENG', 'credits' => 0],
            ['name' => 'Matemática', 'short_name' => 'MAT', 'credits' => 0],
            ['name' => 'Ciencias Naturales', 'short_name' => 'C. NAT', 'credits' => 0],
            ['name' => 'Ciencias Sociales', 'short_name' => 'C. SOC', 'credits' => 0],
            ['name' => 'Artes Plásticas y Visuales', 'short_name' => 'ARTES', 'credits' => 0],
            ['name' => 'Educación Musical', 'short_name' => 'MÚSICA', 'credits' => 0],
            ['name' => 'Educación Física y Deportes', 'short_name' => 'ED. FÍSICA', 'credits' => 0],
            ['name' => 'Técnica Tecnológica', 'short_name' => 'TÉCNICA', 'credits' => 0],
            ['name' => 'Técnica Tecnológica General / Especializada', 'short_name' => 'T.T.', 'credits' => 0],
            ['name' => 'Valores, Espiritualidad y Religiones', 'short_name' => 'RELIGIÓN', 'credits' => 0],
            ['name' => 'Biología - Geografía', 'short_name' => 'BIO-GEO', 'credits' => 0],
            ['name' => 'Física', 'short_name' => 'FIS', 'credits' => 0],
            ['name' => 'Química', 'short_name' => 'QUI', 'credits' => 0],
            ['name' => 'Cosmovisiones, Filosofía y Sicología', 'short_name' => 'FILO', 'credits' => 0],
            ['name' => 'Lengua Extranjera (Inglés)', 'short_name' => 'INGLÉS', 'credits' => 0],
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate([
                'name' => $subject['name'],
            ], [
                'short_name' => $subject['short_name'],
            ]);
        }

        $this->command->info('Catálogo de materias creado exitosamente.');
    }
}
