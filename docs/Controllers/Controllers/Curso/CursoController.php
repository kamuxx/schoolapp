<?php

namespace App\Http\Controllers\Curso;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Profesor;
use App\Http\Requests\Curso\StoreCursoRequest;
use App\Http\Requests\Curso\UpdateCursoRequest;

class CursoController extends Controller
{
    public function index()
    {
        $cursos = Curso::with(['primerAsesor', 'segundoAsesor'])->orderBy('nombre')->get();
        return view('cursos.index', compact('cursos'));
    }

    public function create()
    {
        $profesores = Profesor::orderBy('nombre_completo')->get();
        return view('cursos.create', compact('profesores'));
    }

    public function store(StoreCursoRequest $request)
    {
        Curso::create($request->validated());

        return redirect()
            ->route('cursos.index')
            ->with('success', '¡Curso registrado exitosamente! 🎓');
    }

    public function show(Curso $curso)
    {
        // Carga asesores y alumnos con eager loading para eficiencia
        $curso->load(['primerAsesor', 'segundoAsesor', 'alumnos']);

        return view('cursos.show', compact('curso'));
    }

    public function edit(Curso $curso)
    {
        $profesores = Profesor::orderBy('nombre_completo')->get();
        return view('cursos.edit', compact('curso', 'profesores'));
    }

    public function update(UpdateCursoRequest $request, Curso $curso)
    {
        $curso->update($request->validated());

        return redirect()
            ->route('cursos.index')
            ->with('success', '¡Curso actualizado correctamente! 📝');
    }

    public function destroy(Curso $curso)
    {
        if ($curso->alumnos()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar el curso porque tiene alumnos inscritos.');
        }

        $curso->delete();
        return redirect()->route('cursos.index')->with('success', 'Curso eliminado correctamente.');
    }
}
