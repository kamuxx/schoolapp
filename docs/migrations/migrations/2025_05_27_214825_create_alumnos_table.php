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
           Schema::create('alumnos', function (Blueprint $table) {
                $table->id();
                $table->string('nombre_completo');
                $table->string('rude');
                $table->date('fecha_nacimiento');
                $table->integer('edad');
                $table->string('cedula');
                $table->string('lugar_expedicion');
                $table->string('ciudad');
                $table->string('direccion');
                $table->string('telefono')->nullable();
                $table->string('correo')->nullable();
                $table->string('foto')->nullable();
                $table->string('tutor');
                $table->string('telefono_tutor');
                $table->string('parentesco_tutor');
                $table->text('observacion')->nullable();

                $table->foreignId('curso_id')->constrained()->onDelete('cascade');
                $table->softDeletes();
                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::table('alumnos', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    };
