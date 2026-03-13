<?php

namespace App\Repositories;

use App\Models\Employee;

class EmployeeRepository extends BaseRepository
{
    public function __construct(Employee $model)
    {
        parent::__construct($model);
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $item = $this->find($id);
        if ($item) {
            $item->update($data);

            return $item;
        }

return null;
    }

    public function delete($id)
    {
        $item = $this->find($id);

        return $item ? $item->delete() : false;
    }

    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0): array
    {
        $query = $this->model->with(['user:id,first_name,last_name,email'])->searchEmployee($filters, null, null);

        $totalRecords = $query->count();
        $currentPage = $limit > 0 ? ($offset / $limit) + 1 : 1;

        if (! is_null($limit) && ! is_null($offset)) {
            $query->limit($limit)->offset($offset);
        }

        $response = [
            'data' => $query->get()->toArray(),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $totalRecords,
            'current_page' => $currentPage,
            'per_page' => $limit ?: 10,
        ];

        return $response;
    }
}
