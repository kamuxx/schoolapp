<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseSubjectTeacherSchedule extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'course_subject_teacher_id',
        'day_of_week',
        'schedule_block_id',
        'created_by',
        'updated_by',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function courseSubjectTeacher(): BelongsTo
    {
        return $this->belongsTo(CourseSubjectTeacher::class);
    }

    public function scheduleBlock(): BelongsTo
    {
        return $this->belongsTo(ScheduleBlock::class);
    }
}
