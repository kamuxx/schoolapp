<?php

namespace App\UseCases;

use App\Repositories\SubjectRepository;
use Illuminate\Http\Request;

class SubjectUseCase
{
    public $repository;

    public function __construct(SubjectRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listSubjects(Request $request): array
    {
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 10);
        $offset = ($page - 1) * $perPage;

        $result = $this->repository->search(
            $request->has('search') ? ['search' => $request->input('search')] : [],
            $perPage,
            $offset
        );

        // Agregar metadatos de paginación
        $total = $this->repository->count($request->has('search') ? ['search' => $request->input('search')] : []);

        return [
            'data' => $result,
            'pagination' => [
                'current_page' => $page,
                'last_page' => ceil($total / $perPage),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ];
    }

    public function createSubject(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateSubject(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteSubject(int $id)
    {
        return $this->repository->delete($id);
    }
}
