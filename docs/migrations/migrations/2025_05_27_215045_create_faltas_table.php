<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // database/migrations/xxxx_xx_xx_create_faltas_table.php
public function up()
{
    Schema::create('faltas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
        $table->enum('tipo', ['cabello', 'uniforme', 'atraso', 'falta_general', 'compromiso']);
        $table->date('fecha');
        $table->text('observacion')->nullable();
        $table->string('archivo')->nullable(); // Solo se usará en tipo compromiso
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faltas');
    }
};
