<?php

namespace App\UseCases;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserUseCase
{
    public $repository;

    public function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
    }

    public function listUsers(Request $request): array
    {
        $filters = $request->has('search')
            ? ['search' => $request->input('search')]
            : [];
        $limit  = (int) $request->input('per_page', 10);
        $page   = (int) $request->input('page', 1);
        $offset = ($page - 1) * $limit;

        return $this->repository->search($filters, $limit, $offset);
    }

    public function createUser(array $data)
    {
        $school_id = auth()->user()->school_id;
        $dataFill = [
            "first_name" => $data['first_name'],
            "last_name" => $data['last_name'],
            "email" => $data['email'],
            "password" => Hash::make($data['password'] ?? '12345678'),
            "employee_id" => $data['employee_id'] ?? null,
            "school_id" => $school_id,
        ];
        return $this->repository->create($dataFill);
    }

    public function updateUser(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteUser(int $id)
    {
        return $this->repository->delete($id);
    }
}
