<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\CargaHorariaController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController as InstitutionalProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController as SettingsProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [SettingsProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [SettingsProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [SettingsProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->middleware('throttle:6,1')->name('user-password.update');
    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])->name('two-factor.show');

    // ==================== INSTITUCIONAL ====================
    Route::prefix('institucional')->group(function () {
        Route::get('perfil', [InstitutionalProfileController::class, 'index'])->name('perfil.index');
        Route::get('materias', [SubjectController::class, 'index'])->name('subjects.index');
        Route::post('materias', [SubjectController::class, 'store'])->name('subjects.store');
        Route::patch('materias/{id}', [SubjectController::class, 'update'])->name('subjects.update');
        Route::delete('materias/{id}', [SubjectController::class, 'destroy'])->name('subjects.destroy');

        // Perfil Escolar

        // Niveles y Paralelos
        Route::get('niveles', [\App\Http\Controllers\LevelController::class, 'index'])->name('levels.index');
        Route::get('niveles/{id}', [\App\Http\Controllers\LevelController::class, 'show'])->name('levels.show');
        Route::post('niveles', [\App\Http\Controllers\LevelController::class, 'store'])->name('levels.store');
        Route::patch('niveles/{id}', [\App\Http\Controllers\LevelController::class, 'update'])->name('levels.update');
        Route::delete('niveles/{id}', [\App\Http\Controllers\LevelController::class, 'destroy'])->name('levels.destroy');
    });

    // ==================== FILIACIÓN ====================
    Route::prefix('filiacion')->group(function () {
        Route::get('docentes', [EmployeeController::class, 'index'])->name('employees.index');
        Route::post('docentes', [EmployeeController::class, 'store'])->name('employees.store');
        Route::patch('docentes/{id}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('docentes/{id}', [EmployeeController::class, 'destroy'])->name('employees.destroy');

        Route::get('estudiantes', [StudentController::class, 'index'])->name('students.index');
        Route::post('estudiantes', [StudentController::class, 'store'])->name('students.store');
        Route::patch('estudiantes/{id}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('estudiantes/{id}', [StudentController::class, 'destroy'])->name('students.destroy');

        // Carga Horaria
        Route::get('carga-horaria/docente/{employeeId}', [CargaHorariaController::class, 'showTeacherWorkload'])->name('carga-horaria.teacher.show');
        Route::get('carga-horaria/docente/{employeeId}/assignments', \App\Http\Controllers\CargaHoraria\GetTeacherAssignmentsController::class)
            ->name('carga-horaria.docente.assignments');
        Route::get('carga-horaria/docente/{employeeId}/catalog', [CargaHorariaController::class, 'getCatalogForTeacher'])->name('carga-horaria.catalog');
        Route::post('carga-horaria/asignar', [CargaHorariaController::class, 'storeAssignment'])->name('carga-horaria.store');
        Route::post('carga-horaria/sync', \App\Http\Controllers\CargaHoraria\SyncTeacherAssignmentsController::class)->name('carga-horaria.sync');
        Route::delete('carga-horaria/eliminar/{id}', [CargaHorariaController::class, 'destroyAssignment'])->name('carga-horaria.destroy');

        // Evaluaciones Dimensionales - pendiente desarrollo
    });

    // ==================== OPERATIVA ====================
    Route::prefix('operativa')->group(function () {
        Route::get('asistencia', [AttendanceController::class, 'index'])->name('attendances.index');
        Route::post('asistencia', [AttendanceController::class, 'store'])->name('attendances.store');
        Route::patch('asistencia/{id}', [AttendanceController::class, 'update'])->name('attendances.update');
        Route::delete('asistencia/{id}', [AttendanceController::class, 'destroy'])->name('attendances.destroy');

        Route::get('incidencias', [IncidentController::class, 'index'])->name('incidents.index');
        Route::post('incidencias', [IncidentController::class, 'store'])->name('incidents.store');
        Route::patch('incidencias/{id}', [IncidentController::class, 'update'])->name('incidents.update');
        Route::delete('incidencias/{id}', [IncidentController::class, 'destroy'])->name('incidents.destroy');

        Route::get('notas', [GradeController::class, 'index'])->name('grades.index');
        Route::post('notas', [GradeController::class, 'store'])->name('grades.store');
        Route::patch('notas/{id}', [GradeController::class, 'update'])->name('grades.update');
        Route::delete('notas/{id}', [GradeController::class, 'destroy'])->name('grades.destroy');

        // Cuadro de Honor - pendiente desarrollo
        // Centralizador - pendiente desarrollo
    });

    // ==================== CERTIFICACIÓN ====================
    Route::prefix('certificacion')->group(function () {
        // Boletines - pendiente desarrollo
        // Reportes Ministerio - pendiente desarrollo
    });

    // ==================== CONFIGURACIÓN ====================
    Route::prefix('config')->group(function () {
        // Seguridad
        Route::get('permisos', [PermissionController::class, 'index'])->name('permissions.index');
        Route::post('permisos', [PermissionController::class, 'store'])->name('permissions.store');
        Route::patch('permisos/{id}', [PermissionController::class, 'update'])->name('permissions.update');
        Route::delete('permisos/{id}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
        Route::patch('roles/{id}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('roles/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');

        Route::get('usuarios', [UserController::class, 'index'])->name('users.index');
        Route::post('usuarios', [UserController::class, 'store'])->name('users.store');
        Route::patch('usuarios/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('usuarios/{id}', [UserController::class, 'destroy'])->name('users.destroy');

        // Gestión de Escuelas
        Route::get('escuelas', [SchoolController::class, 'index'])->name('schools.index');
        Route::post('escuelas', [SchoolController::class, 'store'])->name('schools.store');
        Route::patch('escuelas/{id}', [SchoolController::class, 'update'])->name('schools.update');
        Route::delete('escuelas/{id}', [SchoolController::class, 'destroy'])->name('schools.destroy');

        // Gestión Académica
        Route::get('anios-escolares', [AcademicYearController::class, 'index'])->name('academic-years.index');
        Route::post('anios-escolares', [AcademicYearController::class, 'store'])->name('academic-years.store');
        Route::patch('anios-escolares/{id}', [AcademicYearController::class, 'update'])->name('academic-years.update');
        Route::delete('anios-escolares/{id}', [AcademicYearController::class, 'destroy'])->name('academic-years.destroy');
    });
});
