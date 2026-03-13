<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Level extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'stage',
        'order',
        'max_capacity',
        'is_active',
    ];

    public function schoolLevels(): HasMany
    {
        return $this->hasMany(SchoolLevel::class);
    }
}
