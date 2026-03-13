<?php

namespace App\UseCases;

use App\Repositories\SchoolRepository;
use Illuminate\Http\Request;

class SchoolUseCase
{
    public $repository;

    public function __construct(SchoolRepository $schoolRepository)
    {
        $this->repository = $schoolRepository;
    }

    public function listSchools(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->repository->search($filters, $perPage, $offset);
    }

    public function createSchool(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateSchool(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteSchool(int $id)
    {
        return $this->repository->delete($id);
    }
}
