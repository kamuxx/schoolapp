<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('e.g. "1ro Primaria"');
            $table->string('slug')->unique();
            $table->enum("stage", ["inicial", "primaria", "secundaria", "superior", "otro"])->comment("Etapa educativa");
            $table->smallInteger('max_capacity')->default(0);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
