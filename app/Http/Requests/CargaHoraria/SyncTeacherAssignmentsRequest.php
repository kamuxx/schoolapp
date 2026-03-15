<?php

namespace App\Http\Requests\CargaHoraria;

use Illuminate\Foundation\Http\FormRequest;

class SyncTeacherAssignmentsRequest extends FormRequest
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
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'assignments' => ['array'],
            'assignments.*.subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'assignments.*.section_id' => ['required', 'integer', 'exists:sections,id'],
        ];
    }

    /**
     * Transforma los datos validados en un DTO.
     */
    public function toDto(): array
    {
        $validated = $this->validated();

        return [
            'employee_id' => $validated['employee_id'],
            'assignments' => $validated['assignments'] ?? [],
        ];
    }
}
