<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class Role extends SpatieRole
{
    use HasFactory, SoftDeletes, BelongsToSchool;

    protected $table = "roles";

    protected $fillable = [
        'name',
        'guard_name',
        'school_id',
    ];

    public function scopeSearchRole(
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
