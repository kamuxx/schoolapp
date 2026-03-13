<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $schools = School::query()
            ->searchSchool($request->only('search'))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('institucional/planteles/index', [
            'schools' => $schools,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        // Obtener niveles base (o etapas) para el paso 2
        $stages = [
            ['id' => 'inicial', 'name' => 'Inicial'],
            ['id' => 'primaria', 'name' => 'Primaria'],
            ['id' => 'secundaria', 'name' => 'Secundaria'],
            ['id' => 'superior', 'name' => 'Superior'],
        ];

        // Obtener roles permitidos para el paso 3 (Excluyendo Estudiante y Representante)
        $roles = Role::whereNotIn('name', ['estudiante', 'representante'])->get(['id', 'name']);

        return Inertia::render('institucional/planteles/create', [
            'stages' => $stages,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Paso 1: Datos de la Escuela
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'locality' => 'nullable|string|max:100',
            'address' => 'required|string',

            // Paso 2: Niveles
            'selected_stages' => 'required|array|min:1',

            // Paso 3: Representante Legal
            'rep_name' => 'required|string|max:255',
            'rep_email' => 'required|email|unique:users,email',
            'rep_password' => 'required|string|min:8',
            'rep_role' => 'required|exists:roles,name',
        ]);

        return DB::transaction(function () use ($validated) {
            // 1. Crear la Escuela
            $school = School::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'district' => $validated['district'],
                'locality' => $validated['locality'],
                'address' => $validated['address'],
                'academic_system' => 'regular', // Default
                'is_active' => true,
            ]);

            // 2. Crear el Usuario Administrador del Plantel
            $user = User::create([
                'name' => $validated['rep_name'],
                'email' => $validated['rep_email'],
                'password' => Hash::make($validated['rep_password']),
                'school_id' => $school->id,
            ]);

            $user->assignRole($validated['rep_role']);

            // 3. Registrar los niveles activos (Metadata o configuración inicial)
            // Por ahora lo guardamos en un casting de array en la escuela si existe, 
            // o simplemente preparamos la estructura para que el admin de la escuela cree los Levels reales.
            $school->update([
                'educational_stages' => $validated['selected_stages']
            ]);

            return redirect()->route('planteles.index')
                ->with('success', 'Plantel registrado exitosamente.');
        });
    }
}
