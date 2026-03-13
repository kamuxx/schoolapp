<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migration vacía - Laravel la ignorará automáticamente
        // La tabla permissions se crea en 2026_02_25_120911_create_permission_tables.php
        // y se modifica en 2026_02_26_000001_add_school_id_to_permissions_table.php
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer nada
    }
};
