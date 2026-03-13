<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Matemáticas"
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('short_name')->nullable();
            $table->text('description')->nullable()->default(null);
            $table->boolean('is_legacy')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();

            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
