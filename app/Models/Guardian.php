<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guardian extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_id',
        'name',
        'phone',
        'relationship',
        'is_main',
        'is_emergency',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'is_emergency' => 'boolean',
    ];

    public const RELATIONSHIP_FATHER = 'Padre';
    public const RELATIONSHIP_MOTHER = 'Madre';
    public const RELATIONSHIP_REPRESENTATIVE = 'Tutor';
    public const RELATIONSHIP_OTHER = 'Otro';

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function isMain(): bool
    {
        return $this->is_main;
    }

    public function isEmergency(): bool
    {
        return $this->is_emergency;
    }
}
