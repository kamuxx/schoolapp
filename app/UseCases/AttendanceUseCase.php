<?php

namespace App\UseCases;

use App\Repositories\AttendanceRepository;
use Illuminate\Http\Request;

class AttendanceUseCase
{
    public $repository;

    public function __construct(AttendanceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listAttendances(Request $request): array
    {
        $filters = $request->only(['date', 'section_id']);
        $perPage = (int) $request->input('per_page', 100);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->repository->search($filters, $perPage, $offset);
    }

    public function recordAttendances(array $records)
    {
        return $this->repository->createMany($records);
    }

    public function updateAttendance(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteAttendance(int $id)
    {
        return $this->repository->delete($id);
    }
}
