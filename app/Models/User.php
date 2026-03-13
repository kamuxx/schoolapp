<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToSchool;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'school_id',
        'employee_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function courseSubjectTeachers(): HasMany
    {
        return $this->hasMany(CourseSubjectTeacher::class, 'teacher_id');
    }

    public function taughtSections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'course_subject_teachers', 'teacher_id', 'section_id')
            ->withPivot('subject_id')
            ->withTimestamps();
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function canAccessSchool(int $schoolId): bool
    {
        return $this->school_id === $schoolId || $this->isSuperAdmin();
    }

    public function scopeSearchUser(
        Builder $builder,
        array $filters = [],
        ?int $limit = 10,
        ?int $offset = 0
    ) {
        if (isset($filters['search'])) {
            $builder->where(function ($query) use ($filters) {
                $query->where('first_name', 'like', "%{$filters['search']}%")
                      ->orWhere('last_name', 'like', "%{$filters['search']}%")
                      ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }
        if ($limit !== null && $offset !== null) {
            $builder->limit($limit)->offset($offset);
        }
        return $builder;
    }

}
