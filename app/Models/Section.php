<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class Section extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'school_level_id',
        'name',
        'primary_advisor_id',
        'secondary_advisor_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function schoolLevel(): BelongsTo
    {
        return $this->belongsTo(SchoolLevel::class, 'school_level_id');
    }

    public function primaryAdvisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'primary_advisor_id');
    }

    public function secondaryAdvisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'secondary_advisor_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            Student::class,
            Enrollment::class,
            'section_id',
            'id',
            'id',
            'student_id'
        );
    }

    public function courseSubjectTeachers(): HasMany
    {
        return $this->hasMany(CourseSubjectTeacher::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    public function subjects(): HasMany
    {
        return $this->belongsToMany(Subject::class, 'course_subject_teachers')
            ->withPivot('teacher_id')
            ->withTimestamps();
    }

    public function getActiveEnrollments(): HasMany
    {
        return $this->enrollments()->where('status', 'active');
    }
}
