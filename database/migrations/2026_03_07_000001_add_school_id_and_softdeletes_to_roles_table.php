<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->foreignId('school_id')->nullable()->default(null)->constrained()->onDelete('cascade');
            $table->index(['school_id', 'name']);
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropForeign(['school_id']);
            $table->dropIndex(['school_id', 'name']);
            $table->dropColumn('school_id');
        });
    }
};
