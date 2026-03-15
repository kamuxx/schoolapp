<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface SectionRepositoryInterface
{
    /**
     * Obtiene las secciones de una escuela cargando el nivel.
     */
    public function getBySchool(int $schoolId): Collection;
}
