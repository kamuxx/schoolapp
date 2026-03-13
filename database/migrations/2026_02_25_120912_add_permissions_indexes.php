<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('permissions', function (Blueprint $table) {
            // Índices para optimizar búsquedas
            $table->index(['name'], 'idx_permissions_name');
            $table->index(['guard_name'], 'idx_permissions_guard_name');
        });
    }

    public function down()
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex('idx_permissions_name');
            $table->dropIndex('idx_permissions_guard_name');
        });
    }
};
