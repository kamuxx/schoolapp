<?php

namespace App\UseCases;

use App\Repositories\IncidentRepository;
use Illuminate\Http\Request;

class IncidentUseCase
{
    public $repository;

    public function __construct(IncidentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listIncidents(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->repository->search($filters, $perPage, $offset);
    }

    public function createIncident(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateIncident(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteIncident(int $id)
    {
        return $this->repository->delete($id);
    }
}
