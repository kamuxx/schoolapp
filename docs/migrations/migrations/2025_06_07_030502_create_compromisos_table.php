<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompromisosTable extends Migration
{
    public function up()
    {
        Schema::create('compromisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->date('fecha');
            $table->text('observacion')->nullable();
            $table->string('archivo')->nullable(); // PDF generado o subido
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('compromisos');
    }
}
