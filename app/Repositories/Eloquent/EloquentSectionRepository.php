<?php

namespace App\Repositories\Eloquent;

use App\Models\Section;
use App\Repositories\Contracts\SectionRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentSectionRepository implements SectionRepositoryInterface
{
    public function getBySchool(int $schoolId): Collection
    {
        return Section::with('schoolLevel.level')->where('school_id', $schoolId)->get();
    }
}
