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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained()->nullOnDelete();
            
            // Datos Filiativos Extendidos
            $table->string('national_id_type')->nullable(); // Ej: DNI, CI, PASAPORTE
            $table->string('national_id_number')->nullable()->index();
            $table->date('birth_date')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Datos Laborales
            $table->string('employee_code')->nullable()->unique();
            $table->string('professional_title')->nullable(); // Ej. Licenciado, Magister
            $table->date('hire_date')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Auditoría
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
