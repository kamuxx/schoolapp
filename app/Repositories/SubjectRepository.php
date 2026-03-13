<?php

namespace App\Repositories;

use App\Models\Subject;

class SubjectRepository extends BaseRepository
{
    public function __construct(Subject $model)
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
        $query = $this->model->searchSubject($filters, null, null);

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

    public function count(array $filters = []): int
    {
        return $this->model->searchSubject($filters)->count();
    }
}
