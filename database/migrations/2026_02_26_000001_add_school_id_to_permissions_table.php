<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            // SPM Rule #1: Multi-tenancy obligatorio
            $table->foreignId('school_id')->nullable()->default(null)->constrained()->onDelete('cascade');

            // Índices para optimizar consultas multi-tenant
            $table->index(['school_id'], 'idx_permissions_school_id');
            $table->index(['school_id', 'guard_name'], 'idx_permissions_school_guard');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex('idx_permissions_school_guard');
            $table->dropIndex('idx_permissions_school_id');
            $table->dropForeign(['school_id']);
            $table->dropColumn('school_id');
        });
    }
};
