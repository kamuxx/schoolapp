<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_subject_level', function (Blueprint $table) {
            // Añadir soft deletes si la tabla ya existe
            $table->softDeletes()->after('updated_at');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete()->after('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::table('school_subject_level', function (Blueprint $table) {
            $table->dropForeign(['deleted_by']);
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });
    }
};
