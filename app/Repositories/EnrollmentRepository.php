<?php

namespace App\Repositories;

use App\Contracts\EnrollmentRepositoryContract;
use App\Models\Enrollment;
use App\Models\Section;

class EnrollmentRepository extends BaseRepository implements EnrollmentRepositoryContract
{
    public function __construct(Enrollment $model)
    {
        parent::__construct($model);
    }

    public function find($id): ?Enrollment
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $enrollment = $this->find($id);
        if ($enrollment) {
            $enrollment->update($data);

            return $enrollment->fresh();
        }

        return null;
    }

    public function delete($id)
    {
        $enrollment = $this->find($id);

        return $enrollment ? $enrollment->delete() : false;
    }

    public function getActiveBySchool(int $schoolId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('school_id', $schoolId)
            ->where('status', Enrollment::STATUS_ACTIVE)
            ->get();
    }

    public function getActiveBySchoolLevel(int $schoolLevelId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->whereHas('section', function ($query) use ($schoolLevelId) {
                $query->where('school_level_id', $schoolLevelId);
            })
            ->where('status', Enrollment::STATUS_ACTIVE)
            ->get();
    }

    public function countActiveBySection(int $sectionId): int
    {
        return $this->model
            ->where('section_id', $sectionId)
            ->where('status', Enrollment::STATUS_ACTIVE)
            ->count();
    }

    public function findSectionWithCapacity(int $schoolLevelId, int $maxCapacity): ?Section
    {
        return Section::where('school_level_id', $schoolLevelId)
            ->whereNull('deleted_at')
            ->withCount(['enrollments' => function ($query) {
                $query->where('status', Enrollment::STATUS_ACTIVE);
            }])
            ->having('enrollments_count', '<', $maxCapacity)
            ->first();
    }

    public function createSection(array $data): Section
    {
        return Section::create($data);
    }
}
