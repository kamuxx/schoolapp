<?php


namespace App\UseCases;

use App\Repositories\PermissionRepository;
use Illuminate\Http\Request;

class PermissionUseCase
{

    public $repository;
    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->repository = $permissionRepository;
    }

    public function listPermissions(Request $request)
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $limit = (int) $request->input('per_page', 10);        
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $limit;

        // Limpiar caché cuando cambian parámetros de paginación
        cache()->forget('permissions:*');

        return $this->repository->search($filters, $limit, $offset);
    }

    public function createPermission(array $data)
    {
        return $this->repository->create($data);
    }

    public function updatePermission(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deletePermission(int $id)
    {
        return $this->repository->delete($id);
    }
}
