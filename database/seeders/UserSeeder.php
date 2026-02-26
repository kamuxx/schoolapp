<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Crea los usuarios base del sistema SchoolApp.
     * El cast 'password' => 'hashed' en el modelo hashea la clave automáticamente.
     */
    public function run(): void
    {
        // Super Administrador del sistema (acceso total)
        User::updateOrCreate(
            ['email' => 'sa@schoolapp.com'],
            [
                'first_name'        => 'Super',
                'last_name'         => 'Admin',
                'password'          => 'sa@schoolapp.com',
                'email_verified_at' => now(),
            ]
        );

        // Administrador institucional (acceso de dirección)
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'first_name'        => 'Admin',
                'last_name'         => 'Local',
                'password'          => 'Administrad0r!',
                'email_verified_at' => now(),
            ]
        );
    }
}
