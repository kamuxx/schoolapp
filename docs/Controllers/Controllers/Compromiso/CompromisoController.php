<?php

namespace App\Http\Controllers\Compromiso;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Compromiso;
use App\Models\Falta;
use App\Models\Alumno;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class CompromisoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'alumno_id' => 'required|exists:alumnos,id',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string|max:255',
        ]);

        $alumno = Alumno::findOrFail($request->alumno_id);

        $compromiso = new Compromiso();
        $compromiso->alumno_id = $request->alumno_id;
        $compromiso->fecha = $request->fecha;
        $compromiso->observacion = $request->observacion;

        // Creamos el PDF y lo guardamos correctamente
        $pdf = Pdf::loadView('pdf.compromiso', compact('alumno', 'compromiso'));
        $nombreArchivo = 'uploads/compromisos/compromiso_' . uniqid() . '.pdf';

        // Usamos el disco 'public' correctamente
        Storage::disk('public')->put($nombreArchivo, $pdf->output());

        $compromiso->archivo = $nombreArchivo;
        $compromiso->save();

        // Aquí creamos la falta tipo compromiso en la tabla faltas
        Falta::create([
            'alumno_id' => $alumno->id,
            'tipo' => 'compromiso',
            'fecha' => $request->fecha,
            'observacion' => $request->observacion ?? 'Compromiso firmado',
            'archivo' => $nombreArchivo,
        ]);

        return redirect()->back()->with('success', 'Compromiso registrado y PDF generado con éxito');
    }
}