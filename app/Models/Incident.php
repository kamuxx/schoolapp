<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\BelongsToSchool;

class Incident extends Model
{
    use SoftDeletes, BelongsToSchool;

    protected $fillable = [
        'school_id',
        'student_id',
        'incident_type_id',
        'reported_by_id',
        'incident_date',
        'observation',
        'attachment_path',
        'requires_commitment',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'requires_commitment' => 'boolean',
    ];

    public function school(): BelongsTo { return $this->belongsTo(School::class); }
    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
    public function incidentType(): BelongsTo { return $this->belongsTo(IncidentType::class); }
    public function reportedBy(): BelongsTo { return $this->belongsTo(User::class, 'reported_by_id'); }

    public function requiresCommitment(): bool { return $this->requires_commitment; }

    public function scopeSearchIncident(\Illuminate\Database\Eloquent\Builder $builder, array $filters = [], ?int $limit = 10, ?int $offset = 0) {
        if (isset($filters['search'])) {
            $builder->where('observation', 'like', "%{$filters['search']}%")->orWhereHas('student', fn($q) => $q->where('first_name', 'like', "%{$filters['search']}%")->orWhere('last_name', 'like', "%{$filters['search']}%"));
        }
        if ($limit !== null && $offset !== null) { $builder->limit($limit)->offset($offset); }
        return $builder;
    }
}
