<?php

namespace App\Http\Controllers;

use App\Models\Compromiso;
use App\Models\Profesor;
use App\Models\Alumno;
use App\Models\Curso;
use App\Models\Falta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return view('dashboard', [
            'profesores' => Profesor::count(),
            'alumnos' => Alumno::count(),
            'cursos' => Curso::count(),
            'faltas' => Falta::count(),
            'ultimosAlumnos' => Alumno::latest()->take(5)->get(),
            'ultimosCompromisos' => Compromiso::latest()->take(5)->get(),
            'ultimasFaltas' => Falta::with('alumno')->latest()->take(5)->get(),

            // 🎂 Cumpleañeros del día
            'cumplesHoy' => Alumno::whereMonth('fecha_nacimiento', now()->month)
                                  ->whereDay('fecha_nacimiento', now()->day)
                                  ->get(),

            // 📊 Conteo por tipo de falta
            'tipoFaltas' => [
                'Cabello' => Falta::where('tipo', 'cabello')->count(),
                'Atraso' => Falta::where('tipo', 'atraso')->count(),
                'Uniforme' => Falta::where('tipo', 'uniforme')->count(),
                'General' => Falta::where('tipo', 'falta_general')->count(),
                'Compromisos' => Falta::where('tipo', 'compromisos')->count(),
            ],
        ]);
    }

    public function exportarPDF()
    {
        $data = [
            'fecha' => now()->format('d/m/Y'),
            'profesores' => Profesor::count(),
            'alumnos' => Alumno::count(),
            'cursos' => Curso::count(),
            'faltas' => Falta::count(),
            'tipoFaltas' => [
                'Cabello' => Falta::where('tipo', 'cabello')->count(),
                'Atraso' => Falta::where('tipo', 'atraso')->count(),
                'Uniforme' => Falta::where('tipo', 'uniforme')->count(),
                'General' => Falta::where('tipo', 'falta_general')->count(),
                'Compromisos' => Falta::where('tipo', 'compromisos')->count(),
            ],
        ];

        $pdf = Pdf::loadView('dashboard.estadisticas-pdf', $data);
        return $pdf->download('estadisticas_' . now()->format('Ymd_His') . '.pdf');
    }
}
