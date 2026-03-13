<?php

namespace App\Traits;

use App\Models\School;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToSchool
{
    /**
     * Relationship to the school.
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
