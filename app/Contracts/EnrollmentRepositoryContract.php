<?php

namespace App\Contracts;

use App\Models\Section;

interface EnrollmentRepositoryContract
{
    public function create(array $data);

    public function find($id);

    public function update($id, array $data);

    public function delete($id);

    public function getActiveBySchool(int $schoolId): \Illuminate\Database\Eloquent\Collection;

    public function getActiveBySchoolLevel(int $schoolLevelId): \Illuminate\Database\Eloquent\Collection;

    public function countActiveBySection(int $sectionId): int;

    public function findSectionWithCapacity(int $schoolLevelId, int $maxCapacity): ?Section;

    public function createSection(array $data): Section;
}
