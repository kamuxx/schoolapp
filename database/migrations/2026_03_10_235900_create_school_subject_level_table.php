<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 2. Crear tabla pivote N:M entre escuela-nivel-materia
        Schema::create('school_subject_level', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_level_id')->constrained('school_levels')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->tinyInteger('credits')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            
            // Índice único para evitar duplicados
            $table->unique(['school_id', 'school_level_id', 'subject_id'], 'school_level_subject_unique');
        });

        // 3. Migrar datos existentes a nuevo modelo
        // Esto se hará en un seeder o migración de datos separada
    }

    public function down(): void
    {
        Schema::dropIfExists('school_subject_level');
    }
};
