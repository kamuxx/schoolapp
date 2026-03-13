<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class SubjectCatalog extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'short_name',
        'description',
        'credits',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
    ];

    // Relación N:M con escuelas y niveles
    public function schoolLevels(): BelongsToMany 
    {
        return $this->belongsToMany(Level::class, 'school_subject_level')
            ->withPivot(['school_id', 'is_active', 'created_at', 'updated_at'])
            ->withTimestamps();
    }

    // Relación con escuelas a través de la tabla pivote
    public function schools(): BelongsToMany 
    {
        return $this->belongsToMany(School::class, 'school_subject_level')
            ->withPivot(['level_id', 'is_active', 'created_at', 'updated_at'])
            ->withTimestamps();
    }

    // Relación con niveles a través de la tabla pivote
    public function levels(): BelongsToMany 
    {
        return $this->belongsToMany(Level::class, 'school_subject_level')
            ->withPivot(['school_id', 'is_active', 'created_at', 'updated_at'])
            ->withTimestamps();
    }

    // Scope para búsqueda
    public function scopeSearch(Builder $builder, string $search): Builder
    {
        return $builder->where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
        });
    }

    // Scope para activos
    public function scopeActive(Builder $builder): Builder
    {
        return $builder->where('is_active', true);
    }
}
