<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Profesor;
use App\Http\Requests\Profesor\StoreProfesorRequest;
use App\Http\Requests\Profesor\UpdateProfesorRequest;
use Illuminate\Support\Facades\Storage;

class ProfesorController extends Controller
{
    public function index()
    {
        $profesores = Profesor::orderBy('nombre_completo')->get();
        return view('profesores.index', compact('profesores'));
    }

    public function create()
    {
        return view('profesores.create');
    }

    public function store(StoreProfesorRequest $request)
    {
        $datos = $request->validated();

        if ($request->hasFile('foto')) {
            $archivo = $request->file('foto');
            $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('uploads/profesores', $nombreArchivo, 'public');
            $datos['foto'] = $ruta;
        }

        Profesor::create($datos);

        return redirect()
            ->route('profesores.index')
            ->with('success', '¡Profesor registrado exitosamente! 👨‍🏫');
    }

    public function show(Profesor $profesor)
    {
        return view('profesores.show', compact('profesor'));
    }

    public function edit(Profesor $profesor)
    {
        return view('profesores.edit', compact('profesor'));
    }

    public function update(UpdateProfesorRequest $request, Profesor $profesor)
    {
        $datos = $request->validated();

        if ($request->hasFile('foto')) {
            if ($profesor->foto) {
                Storage::disk('public')->delete($profesor->foto);
            }

            $archivo = $request->file('foto');
            $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('uploads/profesores', $nombreArchivo, 'public');
            $datos['foto'] = $ruta;
        }

        $profesor->update($datos);

        return redirect()
            ->route('profesores.index')
            ->with('success', '¡Profesor actualizado correctamente! 📝');
    }

    public function destroy(Profesor $profesor)
    {
        // Verificar si está asignado como asesor en algún curso
        $tieneCursos = Curso::where('primer_asesor_id', $profesor->id)
                            ->orWhere('segundo_asesor_id', $profesor->id)
                            ->exists();

        if ($tieneCursos) {
            return redirect()->route('profesores.index')
                ->with('error', 'No se puede eliminar: el profesor está asignado a uno o más cursos.');
        }

        if ($profesor->foto) {
            Storage::disk('public')->delete($profesor->foto);
        }
        $profesor->delete(); // Elimina lógicamente

        return redirect()->route('profesores.index')
            ->with('success', 'Profesor eliminado correctamente.');
    }
}