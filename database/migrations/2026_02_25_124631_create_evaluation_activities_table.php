<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluation_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_subject_teacher_id')->constrained('course_subject_teachers')->cascadeOnDelete()->comment('El maestro en su paralelo');
            $table->foreignId('term_id')->constrained()->cascadeOnDelete()->comment('El trimestre base');
            $table->string('dimension')->comment('Dimensión evaluada boliviana (Ser, Saber, Hacer, Actitud)');
            $table->string('description')->comment('Ej: Examen Parcial');
            $table->decimal('max_score', 8, 2)->comment('Tope para validación: 10, 45, 40 o 5pts según Bolivia');
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluation_activities');
    }
};
