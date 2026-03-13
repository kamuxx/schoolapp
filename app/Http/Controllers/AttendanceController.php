<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Student;
use App\UseCases\AttendanceUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    private $usecase;
    public function __construct(AttendanceUseCase $usecase) { $this->usecase = $usecase; }

    public function index(Request $request) {
        $sections = Section::with(['level:id,name'])->get()->map(fn($s) => ['id' => $s->id, 'name' => $s->name, 'level' => $s->level?->name]);
        return Inertia::render('operativa/asistencia/index', [
            'attendances' => $this->usecase->listAttendances($request),
            'sections' => $sections,
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'date' => 'required|date',
            'section_id' => 'required|exists:sections,id',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:present,absent,late',
        ]);

        $records = array_map(function ($record) use ($data) {
            return [
                'school_id' => auth()->user()->school_id,
                'section_id' => $data['section_id'],
                'student_id' => $record['student_id'],
                'date' => $data['date'],
                'status' => $record['status'],
                'recorded_by_id' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $data['records']);

        $this->usecase->recordAttendances($records);
        return redirect()->back()->with('success', 'Asistencia registrada.');
    }

    public function update(Request $request, $id) {
        $data = $request->validate(['status' => 'required|in:present,absent,late']);
        $this->usecase->updateAttendance($id, $data);
        return redirect()->back()->with('success', 'Asistencia actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteAttendance($id);
        return redirect()->back()->with('success', 'Asistencia eliminada.');
    }
}
