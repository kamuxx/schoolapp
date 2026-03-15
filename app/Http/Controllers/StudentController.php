<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\StudentUpdateRequest;
use App\Repositories\GuardianRepository;
use App\Repositories\LevelRepository;
use App\Repositories\StudentRepository;
use App\Repositories\UserRepository;
use App\UseCases\StudentUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class StudentController extends Controller
{
    public function __construct(
        private readonly StudentRepository $studentRepository,
        private readonly UserRepository $userRepository,
        private readonly GuardianRepository $guardianRepository,
        private readonly LevelRepository $levelRepository,
        private readonly StudentUseCase $usecase
    ) {}

    public function index(Request $request): Response
    {
        $schoolId = auth()->user()->school_id;
        $activeYear = $this->levelRepository->resolveActiveYear($schoolId);

        $schoolLevels = $activeYear
            ? $this->levelRepository->getSchoolLevels($schoolId, $activeYear->id)
            : [];

        // Transformar para el selector del frontend
        $levelsData = collect($schoolLevels)->map(function ($sl) {
            return [
                'id' => $sl->id,
                'name' => $sl->level->name.' ('.$sl->level->stage.')',
            ];
        });

        return Inertia::render('filiacion/estudiantes/index', [
            'students' => $this->usecase->listStudents($request),
            'school_levels' => $levelsData,
        ]);
    }

    public function store(StudentStoreRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('photo')) {
                $data['photo_path'] = $request->file('photo')->store('students/photos', 'public');
            }

            $this->usecase->createStudent($data);

            return redirect()->back()->with('success', 'Estudiante inscrito exitosamente.');
        } catch (Throwable $th) {
            \Illuminate\Support\Facades\Log::error('Error fatal en registro de estudiante', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Error al inscribir estudiante: '.$th->getMessage());
        }
    }

    public function update(StudentUpdateRequest $request, $id)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('students/photos', 'public');
        }

        $this->usecase->updateStudent($id, $data);

        return redirect()->back()->with('success', 'Ficha del estudiante actualizada.');
    }

    public function destroy($id)
    {
        $this->usecase->deleteStudent($id);

        return redirect()->back()->with('success', 'Estudiante eliminado.');
    }
}
