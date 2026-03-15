<?php

namespace App\Http\Controllers\CargaHoraria;

use App\Http\Controllers\Controller;
use App\Http\Requests\CargaHoraria\SyncTeacherAssignmentsRequest;
use App\Models\Employee;
use App\UseCases\CargaHoraria\SyncTeacherAssignmentsUseCase;
use Illuminate\Http\JsonResponse;

class SyncTeacherAssignmentsController extends Controller
{
    /**
     * Sincroniza las asignaciones de un docente invocando su UseCase respectivo.
     * Controlador alineado con Clean Architecture y principios SOLID.
     */
    public function __invoke(
        SyncTeacherAssignmentsRequest $request,
        SyncTeacherAssignmentsUseCase $useCase
    ): JsonResponse {
        $dto = $request->toDto();

        $employee = Employee::with('user')->findOrFail($dto['employee_id']);

        // Guard clause: el empleado debe tener un usuario del sistema vinculado
        if (! $employee->user) {
            return response()->json([
                'message' => 'El empleado no tiene un usuario del sistema vinculado.',
            ], 422);
        }

        $schoolId = auth()->user()->school_id;
        $updatedBy = auth()->id();
        $teacherId = (int) $employee->user->id;

        $useCase->execute($dto, $schoolId, $teacherId, $updatedBy);

        return response()->json(['message' => 'Carga académica actualizada correctamente']);
    }
}
