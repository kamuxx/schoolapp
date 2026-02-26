<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_subject_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete()->comment('El Tenant: Colegio Boliviano');
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete()->comment('Profesor designado');
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete()->comment('Materia a dictar');
            $table->foreignId('section_id')->constrained()->cascadeOnDelete()->comment('El Paralelo físico donde dicta');
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_subject_teachers');
    }
};
