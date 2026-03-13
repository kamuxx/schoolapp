<?php

namespace App\Repositories;

use App\Contracts\RepositoryContract;
use Illuminate\Database\Eloquent\Model;


class   BaseRepository implements RepositoryContract
{

    public $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function search(array $filters = [], ?int $limit = 10, ?int $offset = 0)
    {
        if($limit && $offset) {
            $this->model->limit($limit)->offset($offset);
        }
        return $this->model->get();
    }

    public function find($id)
    {
        return null;
    }

    public function create(array $data)
    {
        return null;
    }

    public function update($id, array $data)
    {
        return null;
    }

    public function delete($id)
    {
        return null;
    }
}
