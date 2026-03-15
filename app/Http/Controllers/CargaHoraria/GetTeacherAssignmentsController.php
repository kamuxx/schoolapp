<?php

namespace App\Http\Controllers\CargaHoraria;

use App\Http\Controllers\Controller;
use App\Http\Requests\CargaHoraria\GetTeacherAssignmentsRequest;
use App\UseCases\CargaHoraria\GetTeacherAssignmentsUseCase;
use Illuminate\Http\JsonResponse;

class GetTeacherAssignmentsController extends Controller
{
    /**
     * Controlador invocable para obtener la carga académica de un docente.
     */
    public function __invoke(
        GetTeacherAssignmentsRequest $request,
        GetTeacherAssignmentsUseCase $useCase
    ): JsonResponse {
        try {
            $data = $useCase->execute($request->toDto());

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la carga académica',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
