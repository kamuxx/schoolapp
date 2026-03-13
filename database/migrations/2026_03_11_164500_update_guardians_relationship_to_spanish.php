<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Actualizar valores existentes en la tabla guardians
        DB::table('guardians')
            ->where('relationship', 'father')
            ->update(['relationship' => 'Padre']);
            
        DB::table('guardians')
            ->where('relationship', 'mother')
            ->update(['relationship' => 'Madre']);
            
        DB::table('guardians')
            ->where('relationship', 'representative')
            ->update(['relationship' => 'Tutor']);
            
        DB::table('guardians')
            ->where('relationship', 'other')
            ->update(['relationship' => 'Otro']);

        // Modificar el ENUM en la tabla
        Schema::table('guardians', function (Blueprint $table) {
            $table->enum('relationship', ['Padre', 'Madre', 'Tutor', 'Otro'])
                  ->default('Tutor')
                  ->change();
        });
    }

    public function down(): void
    {
        // Revertir valores a inglés
        DB::table('guardians')
            ->where('relationship', 'Padre')
            ->update(['relationship' => 'father']);
            
        DB::table('guardians')
            ->where('relationship', 'Madre')
            ->update(['relationship' => 'mother']);
            
        DB::table('guardians')
            ->where('relationship', 'Tutor')
            ->update(['relationship' => 'representative']);
            
        DB::table('guardians')
            ->where('relationship', 'Otro')
            ->update(['relationship' => 'other']);

        // Revertir ENUM a inglés
        Schema::table('guardians', function (Blueprint $table) {
            $table->enum('relationship', ['father', 'mother', 'representative', 'other'])
                  ->default('representative')
                  ->change();
        });
    }
};
