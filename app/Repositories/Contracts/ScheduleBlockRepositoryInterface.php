<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface ScheduleBlockRepositoryInterface
{
    /**
     * Obtiene los bloques de horario de una escuela ordenados.
     */
    public function getBySchool(int $schoolId): Collection;
}
