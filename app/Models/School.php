<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class School extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'name',
        'slug',
        'country',
        'academic_system',
        'logo_url',
        'phone',
        'email',
        'address',
        'city',
        'province',
        'district',
        'locality',
        'educational_stages',
        'is_active',
        'max_capacity',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'educational_stages' => 'array',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function academicYears(): HasMany
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function levels(): HasMany
    {
        return $this->hasMany(Level::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function incidentTypes(): HasMany
    {
        return $this->hasMany(IncidentType::class);
    }

    public function activeAcademicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function scopeSearchSchool(
        Builder $builder,
        array $filters = [],
        ?int $limit = 10,
        ?int $offset = 0
    ) {
        if (isset($filters['search'])) {
            $builder->where(function ($query) use ($filters) {
                $query->where('name', 'like', "%{$filters['search']}%")
                      ->orWhere('slug', 'like', "%{$filters['search']}%")
                      ->orWhere('city', 'like', "%{$filters['search']}%");
            });
        }
        if ($limit !== null && $offset !== null) {
            $builder->limit($limit)->offset($offset);
        }
        return $builder;
    }
}
