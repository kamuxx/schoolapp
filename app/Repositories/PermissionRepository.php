<?php

namespace App\Repositories;

use App\Models\Permission;

class PermissionRepository extends BaseRepository
{
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }


    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        $permission = $this->model->create($data);
        
        // Limpiar caché relacionada después de crear
        $this->clearPermissionCache();
        
        return $permission;
    }

    public function update($id, array $data)
    {
        $permission = $this->find($id);
        if ($permission) {
            $permission->update($data);
            
            // Limpiar caché relacionada después de actualizar
            $this->clearPermissionCache();
            
            return $permission;
        }
        return null;
    }

    public function delete($id)
    {
        $permission = $this->find($id);
        if ($permission) {
            $result = $permission->delete();
            
            // Limpiar caché relacionada después de eliminar
            $this->clearPermissionCache();
            
            return $result;
        }
        return false;
    }

    private function clearPermissionCache()
    {
        // Limpiar todas las claves de caché de permisos
        $keys = cache()->getRedis()?->keys('permissions:*') ?? [];
        foreach ($keys as $key) {
            cache()->forget($key);
        }
    }

    /**
     * Buscar permisos con filtros y paginación manual
     *
     * @param array $filters Filtros de búsqueda ['search' => 'texto']
     * @param int|null $limit Límite de registros por página (default: 10)
     * @param int|null $offset Desplazamiento para paginación (default: 0)
     * 
     * @return array<string, mixed> Estructura de datos para DataTable:
     *   - data: Collection<Permission> Colección de permisos con relaciones cargadas
     *   - recordsTotal: int Total de registros sin filtros
     *   - recordsFiltered: int Total de registros con filtros aplicados
     * 
     * @example
     * // Primera página
     * $result = $repository->search([], 10, 0);
     * // Segunda página
     * $result = $repository->search([], 10, 10);
     * 
     * @example Estructura de retorno
     * [
     *   'data' => Collection<Permission>,
     *   'recordsTotal' => 150,
     *   'recordsFiltered' => 25
     * ]
     */
    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0):array
    {       
        $query = $this->model->select(['id', 'name', 'guard_name', 'group', 'school_id'])
            ->with(['roles' => function ($query) {
                $query->select(['id', 'name', 'guard_name']);
            }])
            ->searchPermission($filters);    
        $totalRecords = $query->count();     
        if(!is_null($limit) && !is_null($offset)) {
            $query->limit($limit)->offset($offset);
        }      
        

        $response = [
            "data" => $query->get()->toArray(),
            "recordsTotal" => $totalRecords,
            "recordsFiltered" => $totalRecords,
        ];

        return $response;
    }
}
