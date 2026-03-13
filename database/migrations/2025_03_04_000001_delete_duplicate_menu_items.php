<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar migration duplicada - mantener la existente 2026_02_26_174940_create_menu_items_table.php
        // Laravel la ignorará automáticamente
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer nada
    }
};
