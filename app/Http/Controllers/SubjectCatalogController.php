<?php

namespace App\Http\Controllers;

use App\UseCases\SubjectCatalogUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectCatalogController extends Controller
{
    private $usecase;
    
    public function __construct(SubjectCatalogUseCase $usecase) { 
        $this->usecase = $usecase; 
    }

    public function index(Request $request) {
        $result = $this->usecase->listSubjectsPaginated($request);
        
        return Inertia::render('institucional/materias/index', [
            'subjects' => $result['data'],
            'pagination' => $result['pagination'],
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|unique:subject_catalog,name',
            'short_name' => 'nullable|string|unique:subject_catalog,short_name',
            'description' => 'nullable|string',
            'credits' => 'nullable|integer|min:0',
        ]);
        
        $this->usecase->createSubject($data);
        return redirect()->back()->with('success', 'Materia creada.');
    }

    public function update(Request $request, $id) {
        $data = $request->validate([
            'name' => 'required|string|unique:subject_catalog,name,'.$id,
            'short_name' => 'nullable|string|unique:subject_catalog,short_name,'.$id,
            'description' => 'nullable|string',
            'credits' => 'nullable|integer|min:0',
        ]);
        
        $this->usecase->updateSubject($id, $data);
        return redirect()->back()->with('success', 'Materia actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteSubject($id);
        return redirect()->back()->with('success', 'Materia eliminada.');
    }

    /**
     * Asignar materia a un nivel
     */
    public function assignToLevel(Request $request, $id) {
        $data = $request->validate([
            'level_id' => 'required|integer|exists:levels,id',
        ]);
        
        $this->usecase->assignSubjectToLevel($data['level_id'], $id);
        return redirect()->back()->with('success', 'Materia asignada al nivel.');
    }

    /**
     * Remover materia de un nivel
     */
    public function removeFromLevel(Request $request, $id) {
        $data = $request->validate([
            'level_id' => 'required|integer|exists:levels,id',
        ]);
        
        $this->usecase->removeSubjectFromLevel($data['level_id'], $id);
        return redirect()->back()->with('success', 'Materia removida del nivel.');
    }
}
