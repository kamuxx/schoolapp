<?php

namespace App\UseCases;

use App\Repositories\AcademicYearRepository;
use Illuminate\Http\Request;

class AcademicYearUseCase
{
    public $repository;

    public function __construct(AcademicYearRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listAcademicYears(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->repository->search($filters, $perPage, $offset);
    }

    public function createAcademicYear(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateAcademicYear(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteAcademicYear(int $id)
    {
        return $this->repository->delete($id);
    }
}
