<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use BelongsToSchool, SoftDeletes;

    protected $fillable = [
        'school_id',
        'user_id',
        'first_name',
        'last_name',
        'birth_date',
        'national_id_type',
        'national_id_number',
        'student_code',
        'blood_type',
        'address',
        'city',
        'gender',
        'photo_path',
        'is_active',
        'condition',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'birth_date' => 'date:Y-m-d',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function guardians(): HasMany
    {
        return $this->hasMany(Guardian::class);
    }

    public function mainGuardian(): HasOne
    {
        return $this->hasOne(Guardian::class)->where('is_main', true);
    }

    public function emergencyContact(): BelongsTo
    {
        return $this->belongsTo(Guardian::class)->where('is_emergency', true);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getActiveEnrollment()
    {
        return $this->enrollments()->where('status', 'active')->first();
    }

    public function scopeSearchStudent(\Illuminate\Database\Eloquent\Builder $builder, array $filters = [], ?int $limit = 10, ?int $offset = 0)
    {
        if (isset($filters['search'])) {
            $builder->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                    ->orWhere('last_name', 'like', "%{$filters['search']}%")
                    ->orWhere('student_code', 'like', "%{$filters['search']}%")
                    ->orWhere('national_id_number', 'like', "%{$filters['search']}%");
            });
        }
        if ($limit !== null && $offset !== null) {
            $builder->limit($limit)->offset($offset);
        }

        return $builder;
    }
}
