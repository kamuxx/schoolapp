<?php

namespace App\Http\Controllers;

use App\Models\IncidentType;
use App\UseCases\IncidentUseCase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    private $usecase;
    public function __construct(IncidentUseCase $usecase) { $this->usecase = $usecase; }

    public function index(Request $request) {
        $incidentTypes = IncidentType::all()->map(fn($t) => ['id' => $t->id, 'name' => $t->name]);
        return Inertia::render('gestion-escolar/incidencias/index', [
            'incidents' => $this->usecase->listIncidents($request),
            'incidentTypes' => $incidentTypes,
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'incident_type_id' => 'required|exists:incident_types,id',
            'incident_date' => 'required|date',
            'observation' => 'required|string',
            'requires_commitment' => 'boolean',
        ]);
        $data['reported_by_id'] = auth()->id();
        $this->usecase->createIncident($data);
        return redirect()->back()->with('success', 'Incidencia registrada.');
    }

    public function update(Request $request, $id) {
        $data = $request->validate([
            'incident_type_id' => 'required|exists:incident_types,id',
            'incident_date' => 'required|date',
            'observation' => 'required|string',
            'requires_commitment' => 'boolean',
        ]);
        $this->usecase->updateIncident($id, $data);
        return redirect()->back()->with('success', 'Incidencia actualizada.');
    }

    public function destroy($id) {
        $this->usecase->deleteIncident($id);
        return redirect()->back()->with('success', 'Incidencia eliminada.');
    }
}
