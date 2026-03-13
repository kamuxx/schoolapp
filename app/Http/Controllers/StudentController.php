<?php

namespace App\Http\Controllers;

use App\UseCases\StudentUseCase;
use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\StudentUpdateRequest;
use App\Repositories\StudentRepository;
use App\Repositories\UserRepository;
use App\Repositories\GuardianRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class StudentController extends Controller
{
    private $usecase;
    
    public function __construct(
        StudentRepository $studentRepository,
        UserRepository $userRepository, 
        GuardianRepository $guardianRepository
    ) { 
        $this->usecase = new StudentUseCase($studentRepository, $userRepository, $guardianRepository);
    }

    public function index(Request $request) {
        return Inertia::render('filiacion/estudiantes/index', ['students' => $this->usecase->listStudents($request)]);
    }

    public function store(StudentStoreRequest $request) {
        try{
            $data = $request->validated();
            
            if ($request->hasFile('photo')) {
                $data['photo_path'] = $request->file('photo')->store('students/photos', 'public');
            }
            
            $this->usecase->createStudent($data);
            return redirect()->back()->with('success', 'Estudiante inscrito exitosamente.');
        }catch(Throwable $th){
            \Illuminate\Support\Facades\Log::error('Error fatal en registro de estudiante', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
                'trace' => $th->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Error al inscribir estudiante: ' . $th->getMessage());
        }
    }

    public function update(StudentUpdateRequest $request, $id) {
        $data = $request->validated();
        
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('students/photos', 'public');
        }
        
        $this->usecase->updateStudent($id, $data);
        return redirect()->back()->with('success', 'Ficha del estudiante actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteStudent($id);
        return redirect()->back()->with('success', 'Estudiante eliminado.');
    }
}
