<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete()->comment('Alumno reportado');
            $table->foreignId('incident_type_id')->constrained()->cascadeOnDelete()->comment('Qué falta cometió (ej: Atraso)');
            $table->foreignId('reported_by_id')->constrained('users')->cascadeOnDelete()->comment('Docente/Regente que reporta');
            $table->date('incident_date');
            $table->text('observation')->nullable();
            $table->string('attachment_path')->nullable()->comment('Ruta del PDF/Foto de la falta');
            $table->boolean('requires_commitment')->default(false)->comment('Reemplaza la "tabla compromisos": ¿Requiere firma del apoderado?');
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
