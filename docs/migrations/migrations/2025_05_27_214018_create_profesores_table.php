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
        Schema::create('profesores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo');
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable()->unique();
            $table->string('foto')->nullable(); // ruta: images/profesores/xxx.jpg
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profesores', function (Blueprint $table) {
            $table->dropSoftDeletes(); // Por si haces rollback
        });
    }
};