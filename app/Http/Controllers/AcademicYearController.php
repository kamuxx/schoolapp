<?php

namespace App\Http\Controllers;

use App\UseCases\AcademicYearUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    private $usecase;

    public function __construct(AcademicYearUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    public function index(Request $request)
    {
        return Inertia::render('config/anios-escolares/index', [
            'academicYears' => $this->usecase->listAcademicYears($request),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);
        $this->usecase->createAcademicYear($data);
        return redirect()->back()->with('success', 'Año escolar creado.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);
        $this->usecase->updateAcademicYear($id, $data);
        return redirect()->back()->with('success', 'Año escolar actualizado.');
    }

    public function destroy($id)
    {
        $this->usecase->deleteAcademicYear($id);
        return redirect()->back()->with('success', 'Año escolar eliminado.');
    }
}
