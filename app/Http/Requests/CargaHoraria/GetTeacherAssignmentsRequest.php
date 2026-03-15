<?php

namespace App\Http\Requests\CargaHoraria;

use Illuminate\Foundation\Http\FormRequest;

class GetTeacherAssignmentsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepara los datos para la validación.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'employee_id' => $this->route('employeeId'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'employee_id' => 'required|integer|exists:employees,id',
        ];
    }

    /**
     * Transforma el request a DTO.
     */
    public function toDto(): array
    {
        return [
            'employee_id' => (int) $this->route('employeeId') ?: (int) $this->input('employee_id'),
        ];
    }
}
