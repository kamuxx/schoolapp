<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Alumno extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'nombre_completo',
        'rude',
        'fecha_nacimiento',
        'edad',
        'cedula',
        'lugar_expedicion',
        'ciudad',
        'direccion',
        'telefono',
        'correo',
        'foto',
        'tutor',
        'telefono_tutor',
        'parentesco_tutor',
        'observacion',
        'curso_id', // Relación con curso 💖
    ];

    /**
     * Convertir automáticamente fecha_nacimiento a objeto Carbon
     */
    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    /**
     * Relación: un alumno pertenece a un curso
     */
    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function faltas()
    {
        return $this->hasMany(Falta::class);
    }

    public function compromisos()
    {
        return $this->hasMany(Compromiso::class);
    }
}