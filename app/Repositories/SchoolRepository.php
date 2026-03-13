<?php

namespace App\Repositories;

use App\Models\School;

class SchoolRepository extends BaseRepository
{
    public function __construct(School $model)
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
        $school = $this->find($id);
        if ($school) {
            $school->update($data);

            return $school;
        }

        return null;
    }

    public function delete($id)
    {
        $school = $this->find($id);
        if ($school) {
            return $school->delete();
        }

        return false;
    }

    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0): array
    {
        $query = $this->model->searchSchool($filters, null, null);

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
