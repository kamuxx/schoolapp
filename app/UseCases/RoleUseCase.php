<?php

namespace App\UseCases;

use App\Repositories\RoleRepository;
use Illuminate\Http\Request;

class RoleUseCase
{
    public $repository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->repository = $roleRepository;
    }

    public function listRoles(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $limit  = (int) $request->input('per_page', 10);
        $page   = (int) $request->input('page', 1);
        $offset = ($page - 1) * $limit;

        return $this->repository->search($filters, $limit, $offset);
    }

    public function createRole(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateRole(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteRole(int $id)
    {
        return $this->repository->delete($id);
    }
}
