<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
        ]);

        $this->call(UserSeeder::class);

        // El menú se siembra después de roles y usuarios para garantizar que
        // los datos de control de acceso ya existen en la BD.
        $this->call(MenuItemSeeder::class);
    }
}
