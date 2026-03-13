<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class EvaluationActivity extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'course_subject_teacher_id',
        'term_id',
        'dimension',
        'description',
        'max_score',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'max_score' => 'decimal:2',
    ];

    public const DIMENSION_SER = 'Ser';
    public const DIMENSION_SABER = 'Saber';
    public const DIMENSION_HACER = 'Hacer';
    public const DIMENSION_ACTITUD = 'Actitud';

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function courseSubjectTeacher(): BelongsTo
    {
        return $this->belongsTo(CourseSubjectTeacher::class);
    }

    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function validateScore(float $score): bool
    {
        return $score <= $this->max_score;
    }
}
