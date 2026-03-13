<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Planteles (Super Admin)
    Route::prefix('institucional')->group(function () {
        Route::get('planteles', [App\Http\Controllers\SchoolController::class, 'index'])->name('planteles.index');
        Route::get('planteles/nuevo', [App\Http\Controllers\SchoolController::class, 'create'])->name('planteles.create');
        Route::post('planteles', [App\Http\Controllers\SchoolController::class, 'store'])->name('planteles.store');
    });
});

require __DIR__.'/settings.php';
