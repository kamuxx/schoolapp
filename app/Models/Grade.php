<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class Grade extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'evaluation_activity_id',
        'student_id',
        'score',
        'graded_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'graded_at' => 'datetime',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function evaluationActivity(): BelongsTo
    {
        return $this->belongsTo(EvaluationActivity::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function isValid(): bool
    {
        return $this->score <= $this->evaluationActivity->max_score;
    }

    public function getPercentageAttribute(): float
    {
        if ($this->evaluationActivity->max_score == 0) {
            return 0;
        }
        return round(($this->score / $this->evaluationActivity->max_score) * 100, 2);
    }
}
