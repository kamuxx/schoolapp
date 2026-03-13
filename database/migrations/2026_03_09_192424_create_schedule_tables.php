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
        // 1. Bloques Horarios (Ej: 08:00 - 08:45)
        Schema::create('schedule_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Ej: "1ra Hora"
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Auditoría
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });

        // 2. Horario de Carga
        Schema::create('course_subject_teacher_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            // Especificamos un nombre de índice más corto para evitar error de longitud en MySQL
            $table->foreignId('course_subject_teacher_id')
                ->constrained('course_subject_teachers', null, 'cst_sched_cst_id_foreign')
                ->cascadeOnDelete();
                
            $table->unsignedTinyInteger('day_of_week'); // 1-7
            
            $table->foreignId('schedule_block_id')
                ->constrained('schedule_blocks', null, 'cst_sched_block_id_foreign')
                ->cascadeOnDelete();
                
            $table->timestamps();
            
            // Auditoría
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_subject_teacher_schedules');
        Schema::dropIfExists('schedule_blocks');
    }
};
