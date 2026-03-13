<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeStoreRequest;
use App\Models\Employee;
use App\UseCases\EmployeeUseCase;
use App\UseCases\UserUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    private $usecase;
    private $user_usecase;
    public function __construct(EmployeeUseCase $usecase, UserUseCase $user_usecase) { 
        $this->usecase = $usecase; 
        $this->user_usecase = $user_usecase; 

    }

    public function index(Request $request) {
        return Inertia::render('filiacion/docentes/index', ['employees' => $this->usecase->listEmployees($request)]);
    }

    public function store(EmployeeStoreRequest $request) 
    {
        $request->merge(["school_id"=> auth()->user()->school_id]);
        $employee = $this->usecase->createEmployee($request);
        
        $request->merge(["employee_id"=> $employee->id]);

        $this->user_usecase->createUser($request->all());
        return redirect()->back()->with('success', 'Personal registrado y usuario creado.');
    }

    public function update(Request $request, $id) {
        $employee = \App\Models\Employee::findOrFail($id);
        
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $employee->user_id,
            'employee_code' => 'required|string|unique:employees,employee_code,' . $id,
            'national_id_type' => 'nullable|string|max:20',
            'national_id_number' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'gender' => 'required|string|max:20',
            'photo' => 'nullable|image|max:2048',
            'professional_title' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ], [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.unique' => 'Este correo ya está en uso.',
            'employee_code.required' => 'El código de empleado es obligatorio.',
            'employee_code.unique' => 'Este código ya está en uso.',
            'gender.required' => 'El género es obligatorio.',
        ]);

        // Actualizar datos de identidad
        $employee->user->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
        ]);
        
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('employees/photos', 'public');
        }
        
        $this->usecase->updateEmployee($id, $data);
        return redirect()->back()->with('success', 'Ficha del personal actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteEmployee($id);
        return redirect()->back()->with('success', 'Docente eliminado.');
    }
}
