<?php

namespace App\Repositories;

use App\Models\Guardian;

class GuardianRepository extends BaseRepository
{
    public function __construct(Guardian $model)
    {
        parent::__construct($model);
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

    public function findMainByStudent(int $studentId)
    {
        return $this->model->where('student_id', $studentId)
            ->where('is_main', true)
            ->first();
    }

    public function findEmergencyByStudent(int $studentId)
    {
        return $this->model->where('student_id', $studentId)
            ->where('is_emergency', true)
            ->first();
    }
}
