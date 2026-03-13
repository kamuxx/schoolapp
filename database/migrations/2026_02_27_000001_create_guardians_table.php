<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->enum('relationship', ['father', 'mother', 'representative', 'other'])->default('representative');
            $table->boolean('is_main')->default(false)->comment('Representante principal');
            $table->boolean('is_emergency')->default(false)->comment('Contacto de emergencia');
            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['guardian_name', 'guardian_phone', 'guardian_relationship']);
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_relationship')->nullable();
        });

        Schema::dropIfExists('guardians');
    }
};
