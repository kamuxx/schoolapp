<?php

namespace App\Repositories\Eloquent;

use App\Models\ScheduleBlock;
use App\Repositories\Contracts\ScheduleBlockRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentScheduleBlockRepository implements ScheduleBlockRepositoryInterface
{
    public function getBySchool(int $schoolId): Collection
    {
        return ScheduleBlock::where('school_id', $schoolId)->orderBy('sort_order')->get();
    }
}
