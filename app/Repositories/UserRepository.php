<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function findByEmail(string $email)
    {
        return $this->model->where('email', $email)->first();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->find($id);
        if ($user) {
            $user->update($data);
            return $user;
        }
        return null;
    }

    public function delete($id)
    {
        $user = $this->find($id);
        if ($user) {
            return $user->delete();
        }
        return false;
    }

    /**
     * Buscar usuarios con filtros y paginación manual
     *
     * @param array $filters Filtros de búsqueda ['search' => 'texto']
     * @param int|null $limit Límite de registros por página (default: 10)
     * @param int|null $offset Desplazamiento para paginación (default: 0)
     * 
     * @return array<string, mixed> Estructura de datos para DataTable:
     *   - data: Collection<User> Colección de usuarios con relaciones cargadas
     *   - recordsTotal: int Total de registros sin filtros
     *   - recordsFiltered: int Total de registros con filtros aplicados
     *   - current_page: int Página actual
     *   - per_page: int Registros por página
     */
    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0): array
    {
        $query = $this->model->select(['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at', 'updated_at'])
            ->with(['roles' => function ($query) {
                $query->select('id', 'name', 'guard_name');
            }])
            ->with(['permissions' => function ($query) {
                $query->select('id', 'name', 'guard_name');
            }])
            ->searchUser($filters);
            
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
