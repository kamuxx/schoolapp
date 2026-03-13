<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'employee_code' => 'required|string|unique:employees,employee_code',
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
        ];
    }

    public function message(){
        return [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.unique' => 'Este correo ya está registrado.',
            'employee_code.required' => 'El código de empleado es obligatorio.',
            'employee_code.unique' => 'Este código ya está en uso.',
            'gender.required' => 'El género es obligatorio.',
        ];
    }
}
