<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Curso extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'primer_asesor_id',
        'segundo_asesor_id',
    ];

    public function primerAsesor()
    {
        return $this->belongsTo(Profesor::class, 'primer_asesor_id');
    }

    public function segundoAsesor()
    {
        return $this->belongsTo(Profesor::class, 'segundo_asesor_id');
    }
    public function alumnos()
    {
        return $this->hasMany(Alumno::class);
    }
}