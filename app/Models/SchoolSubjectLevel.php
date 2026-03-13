<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class SchoolSubjectLevel extends Model
{
    use SoftDeletes;

    protected $table = 'school_subject_level';

    protected $fillable = [
        'school_id',
        'school_level_id',
        'subject_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relaciones
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function schoolLevel(): BelongsTo
    {
        return $this->belongsTo(SchoolLevel::class, 'school_level_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    // Scope para activos
    public function scopeActive(Builder $builder): Builder
    {
        return $builder->where('is_active', true);
    }

    // Scope por escuela
    public function scopeBySchool(Builder $builder, int $schoolId): Builder
    {
        return $builder->where('school_id', $schoolId);
    }

    // Scope por nivel
    public function scopeByLevel(Builder $builder, int $levelId): Builder
    {
        return $builder->where('level_id', $levelId);
    }
}
