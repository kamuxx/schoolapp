<?php

namespace App\UseCases;

use App\Models\Employee;
use App\Repositories\EmployeeRepository;
use Illuminate\Http\Request;

class EmployeeUseCase
{
    public $repository;

    public function __construct(EmployeeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listEmployees(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $perPage;

        return $this->repository->search($filters, $perPage, $offset);
    }

    public function createEmployee(Request $request): Employee
    {
        $data = $request->all();        
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('employees/photos', 'public');
        }
        return $this->repository->create($data);
    }

    public function updateEmployee(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteEmployee(int $id)
    {
        return $this->repository->delete($id);
    }
}
