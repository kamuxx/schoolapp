<?php



namespace App\Models;



use Spatie\Permission\Models\Permission as SpatiePermission;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Builder;

use App\Traits\BelongsToSchool;



class Permission extends SpatiePermission

{

    use HasFactory, SoftDeletes, BelongsToSchool;



    protected $table = "permissions";



    /**

     * The attributes that are mass assignable.

     *

     * @var array<int, string>

     */

    protected $fillable = [

        'name',

        'guard_name',

        'group', // Por si decides agrupar permisos (ej: 'Usuarios', 'Configuración').

        'school_id', // SPM Rule #1: Multi-tenancy obligatorio

    ];



    /**
     * Scope para buscar permisos con filtros opcionales.
     *
     * @param Builder $builder  El query builder que Laravel pasa automáticamente.
     * @param array   $filters  ['search' => 'texto'] u otros criterios.
     * @param int|null $limit  Límite de resultados (por defecto 10).
     * @param int|null $offset Desplazamiento (paginación).
     * @return Builder
     */
    public function scopeSearchPermission(
        \Illuminate\Database\Eloquent\Builder $builder,
        array $filters = [],
        ?int $limit = 10,
        ?int $offset = 0
    ) {
        // Aplicar filtros de búsqueda optimizados
        if (isset($filters['search']) && !empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $builder->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('group', 'like', "%{$searchTerm}%");
            });
        }
        
        // Ordenamiento por defecto para rendimiento
        $builder->orderBy('name', 'asc');
        
        // Aplicamos paginación solo si se envían ambos valores.
        if ($limit !== null && $offset !== null) {
            $builder->limit($limit)->offset($offset);
        }
        
        return $builder;
    }
}
