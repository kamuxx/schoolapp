<?php

namespace App\Http\Controllers;

use App\UseCases\SubjectUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    private $usecase;
    public function __construct(SubjectUseCase $usecase) { $this->usecase = $usecase; }

    public function index(Request $request) {
        $result = $this->usecase->listSubjects($request);
        
        return Inertia::render('institucional/materias/index', [
            'subjects' => $result['data'],
            'pagination' => $result['pagination'],
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate(['name' => 'required|string', 'short_name' => 'required|string', 'level_id' => 'nullable|integer', 'description' => 'nullable|string', 'credits' => 'nullable|integer']);
        $this->usecase->createSubject($data);
        return redirect()->back()->with('success', 'Materia creada.');
    }

    public function update(Request $request, $id) {
        $data = $request->validate(['name' => 'required|string', 'short_name' => 'required|string', 'level_id' => 'nullable|integer', 'description' => 'nullable|string', 'credits' => 'nullable|integer']);
        $this->usecase->updateSubject($id, $data);
        return redirect()->back()->with('success', 'Materia actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteSubject($id);
        return redirect()->back()->with('success', 'Materia eliminada.');
    }
}
