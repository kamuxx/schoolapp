<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Si el nombre de la tabla coincide no hace falta, pero lo forzamos por claridad:
    protected $table = 'profesores';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'nombre_completo',
        'telefono',
        'correo',
        'foto',
    ];

    // 🔎 Accesor para que devuelva la URL completa de la foto
    public function getFotoUrlAttribute()
    {
        return $this->foto
            ? asset('storage/' . $this->foto)
            : asset('images/default-user.png');
    }
}