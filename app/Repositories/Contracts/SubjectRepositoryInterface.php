<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface SubjectRepositoryInterface
{
    /**
     * Obtiene las materias de una escuela.
     */
    public function getBySchool(int $schoolId): Collection;
}
