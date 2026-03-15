<?php

namespace App\Repositories\Contracts;

interface EmployeeRepositoryInterface
{
    /**
     * Busca un empleado por su ID.
     */
    public function find(int $id);
}
