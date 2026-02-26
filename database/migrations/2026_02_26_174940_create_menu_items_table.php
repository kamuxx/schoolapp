<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla de menú dinámico con auto-referenciamiento.
     * Soporta módulos raíz (parent_id = null) y opciones (parent_id = ID del módulo padre).
     */
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();

            // Referencia al ítem padre (null = módulo raíz)
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('menu_items')
                ->nullOnDelete();

            // Etiqueta visible en el menú
            $table->string('label');

            // Ruta relativa (ej: /dashboard, /admin/schools). Null para grupos.
            $table->string('path')->nullable();

            // Nombre del ícono Lucide (ej: 'LayoutGrid', 'Users', 'BookOpen')
            $table->string('icon')->nullable();

            // Control de acceso: roles que pueden ver este ítem (JSON array)
            $table->json('roles')->nullable();

            // Orden de aparición dentro del mismo nivel
            $table->unsignedSmallInteger('sort_order')->default(0);

            // Activo / Inactivo (sin borrar de la BD)
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
