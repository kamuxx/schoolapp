<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compromiso extends Model
{
    use HasFactory;

    protected $table = 'compromisos';

    protected $fillable = [
        'alumno_id',
        'fecha',
        'observacion',
        'archivo',
    ];

    // Relación con el alumno
    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }

    // Accessor para el nombre del archivo (opcional)
    public function getArchivoUrlAttribute()
    {
        return asset('storage/' . $this->archivo);
    }
}