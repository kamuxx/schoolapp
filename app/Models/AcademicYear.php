<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class AcademicYear extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'name',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function terms(): HasMany
    {
        return $this->hasMany(Term::class);
    }

    public function levels(): HasMany
    {
        return $this->hasMany(Level::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function getActiveTerms(): HasMany
    {
        return $this->terms()->orderBy('start_date');
    }

    public function scopeSearchAcademicYear(
        Builder $builder,
        array $filters = [],
        ?int $limit = 10,
        ?int $offset = 0
    ) {
        if (isset($filters['search'])) {
            $builder->where('name', 'like', "%{$filters['search']}%");
        }
        if ($limit !== null && $offset !== null) {
            $builder->limit($limit)->offset($offset);
        }
        return $builder;
    }
}
