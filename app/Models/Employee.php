<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class Employee extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'national_id_type',
        'national_id_number',
        'birth_date',
        'phone',
        'address',
        'employee_code',
        'professional_title',
        'hire_date',
        'emergency_contact_name',
        'emergency_contact_phone',
        'gender',
        'photo_path',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): HasOne { return $this->hasOne(User::class); }
    public function courseSubjectTeachers(): HasMany { return $this->hasMany(CourseSubjectTeacher::class, 'teacher_id'); }

    public function scopeSearchEmployee(Builder $builder, array $filters = [], ?int $limit = 10, ?int $offset = 0) {
        if (isset($filters['search'])) {
            $builder->where(function ($q) use ($filters) {
                $q->where('employee_code', 'like', "%{$filters['search']}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('first_name', 'like', "%{$filters['search']}%")->orWhere('last_name', 'like', "%{$filters['search']}%"));
            });
        }
        if ($limit !== null && $offset !== null) { $builder->limit($limit)->offset($offset); }
        return $builder;
    }
}
