<?php

namespace App\Http\Controllers;

use App\Models\SchoolLevel;
use App\Models\Section;
use App\Models\Level;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\UseCases\LevelUseCase;

class LevelController extends Controller
{
    private $useCase;

    public function __construct(LevelUseCase $useCase)
    {
        $this->useCase = $useCase;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->useCase->getListLevels($request);

        return Inertia::render('institucional/niveles/index', $data);
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $validated = $request->validate([
            'level_id' => 'required|exists:levels,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'parallels' => 'required|array|min:1',
            'parallels.*.name' => 'required|string|max:10',
        ]);

        DB::beginTransaction();
        try {
            $schoolLevel = SchoolLevel::firstOrCreate([
                'school_id' => $schoolId,
                'level_id' => $validated['level_id'],
                'academic_year_id' => $validated['academic_year_id'],
            ]);

            $this->useCase->syncParallels($schoolLevel->id, $validated['parallels'], $schoolId);

            DB::commit();
            return redirect()->back()->with('success', 'Nivel y paralelos configurados correctly');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al crear nivel: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $level = $this->useCase->getDetailedLevel($id);
        if (!$level) {
            return response()->json(['error' => 'Nivel no encontrado'], 404);
        }

        return response()->json($level);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $validated = $request->validate([
            'parallels' => 'required|array|min:1',
            'parallels.*.name' => 'required|string|max:10',
        ]);

        DB::beginTransaction();
        try {
            $this->useCase->syncParallels($id, $validated['parallels'], $schoolId);
            DB::commit();
            return redirect()->back()->with('success', 'Nivel actualizado correctly');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $schoolId = auth()->user()->school_id;
        $schoolLevel = SchoolLevel::where('school_id', $schoolId)->findOrFail($id);

        DB::transaction(function () use ($schoolLevel) {
            $schoolLevel->update(['deleted_by' => auth()->id()]);
            
            // Soft delete las secciones asociadas a esta instancia escolar del nivel
            foreach($schoolLevel->sections as $section) {
                $section->update(['deleted_by' => auth()->id()]);
                $section->delete();
            }

            $schoolLevel->delete();
        });

        return redirect()->back()->with('success', 'Nivel y sus paralelos eliminados correctamente del entorno escolar.');
    }
}
