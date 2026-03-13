<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class IncidentType extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'name',
        'severity_level',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'severity_level' => 'integer',
    ];

    public const SEVERITY_LEVE = 1;
    public const SEVERITY_MEDIUM = 3;
    public const SEVERITY_HIGH = 5;

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    public function isSevere(): bool
    {
        return $this->severity_level >= self::SEVERITY_HIGH;
    }
}
