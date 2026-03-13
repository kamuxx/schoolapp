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
                'name'              => 'Super Admin',
                'password'          => 'Admin@123',
                'email_verified_at' => now(),
            ]
        );

        $user = User::whereEmail('sa@schoolapp.com')->first();
        $user->assignRole('super_admin');

        

        // Administrador institucional (acceso de dirección)
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'first_name'        => 'Admin',
                'last_name'         => 'Local',
                'name'              => 'Admin Local',
                'password'          => 'Administrad0r!',
                'email_verified_at' => now(),
            ]
        );

        $user = User::whereEmail('admin@admin.com')->first();
        $user->assignRole('admin');
    }
}
