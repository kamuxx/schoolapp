<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class Term extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'academic_year_id',
        'name',
        'start_date',
        'end_date',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function evaluationActivities(): HasMany
    {
        return $this->hasMany(EvaluationActivity::class);
    }

    public function isActive(): bool
    {
        $now = now()->toDateString();
        return $this->start_date <= $now && $this->end_date >= $now;
    }
}
