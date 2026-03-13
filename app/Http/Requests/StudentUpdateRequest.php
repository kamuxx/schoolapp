<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Student;

class StudentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('id');
        $student = Student::findOrFail($studentId);
        
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->user_id,
            'student_code' => 'required|string|unique:students,student_code,' . $studentId,
            'birth_date' => 'nullable|date',
            'national_id_type' => 'nullable|string',
            'national_id_number' => 'nullable|string',
            'blood_type' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'gender' => 'required|string|max:20',
            'photo' => 'nullable|image|max:2048',
            'guardian_name' => 'required|string',
            'guardian_phone' => 'required|string',
            'guardian_relationship' => 'required|string|in:Padre,Madre,Tutor,Otro',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'email.required' => 'El correo es obligatorio.',
            'email.unique' => 'Este correo ya está en uso.',
            'student_code.required' => 'El código RUDE es obligatorio.',
            'student_code.unique' => 'Este código ya está asignado.',
            'gender.required' => 'El género es obligatorio.',
            'guardian_name.required' => 'El nombre del representante es obligatorio.',
            'guardian_phone.required' => 'El teléfono del representante es obligatorio.',
            'guardian_relationship.required' => 'La relación del representante es obligatoria.',
            'guardian_relationship.in' => 'La relación debe ser: father, mother, representative u other.',
        ];
    }
}
