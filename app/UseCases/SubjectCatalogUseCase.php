<?php

namespace App\UseCases;

use App\Repositories\SubjectCatalogRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubjectCatalogUseCase
{
    public $repository;
    
    public function __construct(SubjectCatalogRepository $repository) { 
        $this->repository = $repository; 
    }

    /**
     * Listar materias disponibles para la escuela del usuario logueado
     */
    public function listSubjectsForCurrentUser(Request $request): array
    {
        $schoolId = $this->repository->getCurrentUserSchoolId();
        
        if (!$schoolId) {
            throw new \Exception('Usuario no tiene escuela asignada');
        }

        return $this->repository->getAvailableForSchool($schoolId, $request->all());
    }

    /**
     * Contar materias para paginación
     */
    public function countSubjectsForCurrentUser(Request $request): int
    {
        $schoolId = $this->repository->getCurrentUserSchoolId();
        
        if (!$schoolId) {
            return 0;
        }

        $filters = [];
        if ($request->has('search')) {
            $filters['search'] = $request->input('search');
        }

        return $this->repository->countAvailableForSchool($schoolId, $filters);
    }

    /**
     * Listar materias con paginación completa
     */
    public function listSubjectsPaginated(Request $request): array
    {
        $page = (int)$request->input('page', 1);
        $perPage = (int)$request->input('per_page', 10);
        $offset = ($page - 1) * $perPage;
        
        $filters = [];
        if ($request->has('search')) {
            $filters['search'] = $request->input('search');
        }
        
        $result = $this->listSubjectsForCurrentUser($request);
        $total = $this->countSubjectsForCurrentUser($request);
        
        return [
            'data' => $result,
            'pagination' => [
                'current_page' => $page,
                'last_page' => ceil($total / $perPage),
                'per_page' => $perPage,
                'total' => $total,
            ]
        ];
    }

    // Métodos CRUD para el catálogo
    public function createSubject(array $data) { 
        return $this->repository->create($data); 
    }

    public function updateSubject(int $id, array $data) { 
        return $this->repository->update($id, $data); 
    }

    public function deleteSubject(int $id) { 
        return $this->repository->delete($id); 
    }

    /**
     * Asignar materia a nivel de escuela actual
     */
    public function assignSubjectToLevel(int $levelId, int $subjectCatalogId)
    {
        $schoolId = $this->repository->getCurrentUserSchoolId();
        
        if (!$schoolId) {
            throw new \Exception('Usuario no tiene escuela asignada');
        }

        return $this->repository->assignToSchoolLevel($schoolId, $levelId, $subjectCatalogId);
    }

    /**
     * Remover asignación de materia
     */
    public function removeSubjectFromLevel(int $levelId, int $subjectCatalogId)
    {
        $schoolId = $this->repository->getCurrentUserSchoolId();
        
        if (!$schoolId) {
            throw new \Exception('Usuario no tiene escuela asignada');
        }

        return $this->repository->removeFromSchoolLevel($schoolId, $levelId, $subjectCatalogId);
    }
}
