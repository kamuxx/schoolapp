<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class Subject extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'name',
        'short_name',
        'description',
        'credits',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function school(): BelongsToMany { return $this->belongsToMany(School::class, 'school_subject_level'); }
    public function level(): BelongsToMany { return $this->belongsToMany(Level::class, 'school_subject_level'); }
    public function courseSubjectTeachers(): HasMany { return $this->hasMany(CourseSubjectTeacher::class); }
    public function sections(): BelongsToMany { return $this->belongsToMany(Section::class, 'course_subject_teachers')->withPivot('teacher_id')->withTimestamps(); }

    public function school_level():HasMany { return $this->hasMany(SchoolSubjectLevel::class); }

    public function scopeSearchSubject(Builder $builder, array $filters = [], ?int $limit = 10, ?int $offset = 0) {
        if (isset($filters['search'])) {
            $builder->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")->orWhere('short_name', 'like', "%{$filters['search']}%");
            });
        }
        if ($limit !== null && $offset !== null) { $builder->limit($limit)->offset($offset); }
        return $builder;
    }


}
