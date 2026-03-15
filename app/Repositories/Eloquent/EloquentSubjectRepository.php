<?php

namespace App\Repositories\Eloquent;

use App\Models\Subject;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentSubjectRepository implements SubjectRepositoryInterface
{
    public function getBySchool(int $schoolId): Collection
    {
        return Subject::where('school_id', $schoolId)->get();
    }
}
