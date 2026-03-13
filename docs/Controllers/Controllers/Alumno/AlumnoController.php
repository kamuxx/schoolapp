<?php

namespace App\Http\Controllers\Alumno;

use App\Http\Controllers\Controller;

use App\Models\Alumno;
use App\Models\Curso;
use App\Http\Requests\Alumno\StoreAlumnoRequest;
use App\Http\Requests\Alumno\UpdateAlumnoRequest;
use Illuminate\Support\Facades\Storage;

class AlumnoController extends Controller
{
    public function index()
    {
        $alumnos = Alumno::with('curso')->orderBy('nombre_completo')->get();
        return view('alumnos.index', compact('alumnos'));
    }

    public function create()
    {
        $cursos = Curso::orderBy('nombre')->get();
        return view('alumnos.create', compact('cursos'));
    }

    public function store(StoreAlumnoRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $archivo = $request->file('foto');
            $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('uploads/alumnos', $nombreArchivo, 'public');
            $data['foto'] = $ruta;
        }

        Alumno::create($data);

        return redirect()->route('alumnos.index')->with('success', 'Alumno registrado exitosamente 👨‍🎓');
    }


   public function show(Alumno $alumno)
    {
        // Cargar la relación de compromisos si no está lazy-loaded
        $alumno->load('compromisos');

        return view('alumnos.show', compact('alumno'));
    }


    public function edit(Alumno $alumno)
    {
        $cursos = Curso::orderBy('nombre')->get();
        return view('alumnos.edit', compact('alumno', 'cursos'));
    }

    public function update(UpdateAlumnoRequest $request, Alumno $alumno)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            if ($alumno->foto) {
                Storage::disk('public')->delete($alumno->foto);
            }

            $archivo = $request->file('foto');
            $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('uploads/alumnos', $nombreArchivo, 'public');
            $data['foto'] = $ruta;
        }

        $alumno->update($data);

        return redirect()->route('alumnos.index')->with('success', 'Alumno actualizado exitosamente ✨');
    }

    public function destroy(Alumno $alumno)
    {
        if ($alumno->faltas()->count() > 0 || $alumno->compromisos()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar al alumno porque tiene registros de faltas o compromisos.');
        }

        if ($alumno->foto) {
            Storage::disk('public')->delete($alumno->foto);
        }
        $alumno->delete();
        return redirect()->route('alumnos.index')->with('success', 'Alumno eliminado correctamente.');
    }
}