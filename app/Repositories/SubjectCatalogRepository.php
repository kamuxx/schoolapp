<?php

namespace App\Repositories;

use App\Models\SubjectCatalog;
use App\Models\SchoolSubjectLevel;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubjectCatalogRepository extends BaseRepository
{
    public function __construct(SubjectCatalog $model) { 
        parent::__construct($model); 
    }

    /**
     * Obtener materias disponibles para la escuela del usuario logueado
     */
    public function getAvailableForSchool(int $schoolId, array $filters = [], ?int $limit = 10, ?int $offset = 0): array
    {
        $query = SchoolSubjectLevel::with(['subjectCatalog', 'level'])
            ->bySchool($schoolId)
            ->active();

        // Aplicar filtros de búsqueda
        if (isset($filters['search'])) {
            $query->whereHas('subjectCatalog', function ($q) use ($filters) {
                $q->search($filters['search']);
            });
        }

        // Aplicar paginación
        if ($limit !== null && $offset !== null) {
            $query->limit($limit)->offset($offset);
        }

        $results = $query->get()->map(function ($relation) {
            return [
                'id' => $relation->subject_catalog_id,
                'name' => $relation->subjectCatalog->name,
                'short_name' => $relation->subjectCatalog->short_name,
                'description' => $relation->subjectCatalog->description,
                'credits' => $relation->subjectCatalog->credits,
                'level' => [
                    'id' => $relation->level->id,
                    'name' => $relation->level->name,
                ],
            ];
        });

        return $results->toArray();
    }

    /**
     * Contar materias disponibles para la escuela
     */
    public function countAvailableForSchool(int $schoolId, array $filters = []): int
    {
        $query = SchoolSubjectLevel::bySchool($schoolId)->active();

        if (isset($filters['search'])) {
            $query->whereHas('subjectCatalog', function ($q) use ($filters) {
                $q->search($filters['search']);
            });
        }

        return $query->count();
    }

    /**
     * Obtener school_id del usuario logueado
     */
    public function getCurrentUserSchoolId(): ?int
    {
        $user = Auth::user();
        return $user?->school_id;
    }

    // Métodos CRUD para el catálogo de materias
    public function find($id) { 
        return $this->model->find($id); 
    }

    public function create(array $data) { 
        return $this->model->create($data); 
    }

    public function update($id, array $data) {
        $item = $this->find($id);
        if ($item) { 
            $item->update($data); 
            return $item; 
        }
        return null;
    }

    public function delete($id) { 
        $item = $this->find($id); 
        return $item ? $item->delete() : false; 
    }

    /**
     * Asignar materia a escuela-nivel
     */
    public function assignToSchoolLevel(int $schoolId, int $levelId, int $subjectCatalogId): SchoolSubjectLevel
    {
        return SchoolSubjectLevel::firstOrCreate([
            'school_id' => $schoolId,
            'level_id' => $levelId,
            'subject_catalog_id' => $subjectCatalogId,
        ], [
            'is_active' => true,
        ]);
    }

    /**
     * Remover asignación de materia
     */
    public function removeFromSchoolLevel(int $schoolId, int $levelId, int $subjectCatalogId): bool
    {
        return SchoolSubjectLevel::where([
            'school_id' => $schoolId,
            'level_id' => $levelId,
            'subject_catalog_id' => $subjectCatalogId,
        ])->delete();
    }
}
