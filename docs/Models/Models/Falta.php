<?php

// app/Models/Falta.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Falta extends Model
{
   protected $fillable = [
        'alumno_id',
        'tipo',
        'fecha',
        'observacion',
        'archivo',
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }
}