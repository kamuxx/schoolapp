<?php

namespace App\Http\Controllers\Falta;

use App\Http\Controllers\Controller;
use App\Models\Falta;
use App\Models\Alumno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FaltaController extends Controller
{
    public function index()
    {
        $faltas = Falta::with('alumno.curso')->latest()->get();
        $alumnos = Alumno::with('curso')->orderBy('nombre_completo')->get();
        return view('faltas.index', compact('faltas', 'alumnos'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'alumno_id' => 'required|exists:alumnos,id',
            'tipo' => 'required|in:cabello,uniforme,atraso,falta_general,compromiso',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string|max:255',
            'archivo' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $data = $request->only(['alumno_id', 'tipo', 'fecha', 'observacion']);

        if ($request->hasFile('archivo')) {
            $nombre = Str::uuid() . '.' . $request->archivo->getClientOriginalExtension();
            $data['archivo'] = $request->archivo->storeAs('compromisos', $nombre, 'public');
        }

        Falta::create($data);

        return redirect()->route('faltas.index')->with('success', 'Falta registrada correctamente.');
    }

    public function destroy(Falta $falta)
    {
        if ($falta->archivo) {
            Storage::disk('public')->delete($falta->archivo);
        }

        $falta->delete();

        return redirect()->route('faltas.index')->with('success', 'Falta eliminada correctamente.');
    }
}