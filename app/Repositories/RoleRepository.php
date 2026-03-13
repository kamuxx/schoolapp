<?php

namespace App\Repositories;

use App\Models\Role;

class RoleRepository extends BaseRepository
{
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $role = $this->find($id);
        if ($role) {
            $role->update($data);
            return $role;
        }
        return null;
    }

    public function delete($id)
    {
        $role = $this->find($id);
        if ($role) {
            return $role->delete();
        }
        return false;
    }

    /**
     * Buscar roles con filtros y paginación manual
     *
     * @param array $filters Filtros de búsqueda ['search' => 'texto']
     * @param int|null $limit Límite de registros por página (default: 10)
     * @param int|null $offset Desplazamiento para paginación (default: 0)
     * 
     * @return array<string, mixed> Estructura de datos para DataTable:
     *   - data: Collection<Role> Colección de roles con relaciones cargadas
     *   - recordsTotal: int Total de registros sin filtros
     *   - recordsFiltered: int Total de registros con filtros aplicados
     *   - current_page: int Página actual
     *   - per_page: int Registros por página
     */
    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0): array
    {
        $query = $this->model->select(['id', 'name', 'guard_name', 'created_at', 'updated_at'])
            ->with(['permissions' => function ($query) {
                $query->select('id', 'name', 'guard_name');
            }])
            ->searchRole($filters);
            
        $totalRecords = $query->count();
        
        // Calcular página actual basado en offset y limit
        $currentPage = $limit > 0 ? ($offset / $limit) + 1 : 1;
        
        if (!is_null($limit) && !is_null($offset)) {
            $query->limit($limit)->offset($offset);
        }

        $response = [
            "data" => $query->get()->toArray(),
            "recordsTotal" => $totalRecords,
            "recordsFiltered" => $totalRecords,
            "current_page" => $currentPage,
            "per_page" => $limit ?: 10,
        ];

        return $response;
    }
}
