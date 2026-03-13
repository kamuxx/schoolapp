# Guía de Optimización y Troubleshooting: Tiempos de Carga en Filament

Basado en los logs proporcionados, los tiempos de carga de las rutas principales (`/admin/educational-stages -> 22s` y `/admin/levels -> 18s`) son **inaceptables** para un entorno local y mucho menos para producción. Una aplicación Filament sin registros (o con muy pocos) debería cargar en **~100ms a ~500ms**.

Este tiempo de espera (15s a 22s) suele estar asociado a _timeout blocks_, _sesiones bloqueadas_ o fallos de reconexión de red en el entorno de desarrollo local de Windows, y pocas veces al renderizado visual en sí.

Aquí están los pasos para diagnosticar y corregir este problema, ordenados según la probabilidad de generar un retraso tan específico.

---

## 🚦 Nivel 1: El problema de red y variables de entorno (Lo más probable)

El retraso exacto de ~20 segundos en Windows a menudo ocurre porque Laravel intenta conectarse a un host (para bases de datos, Caché o Vite) y se queda esperando hasta alcanzar el _timeout_ por defecto antes de continuar.

### 1.1 Vite y Servidor de Assets (Hot Reloading)

Filament V3 usa una compilación interna, pero si en tu `composer.json` o `package.json` instalaste algún paquete que fuerza llamar a `Vite` y este no está corriendo, Laravel se colgará esperando unos 15 segundos.
**Solución:**

- Ejecuta en otra terminal: `npm run dev` (Y déjalo abierto).
- O si estás probando, compila y cierra: `npm run build`.

### 1.2 DNS Timeout (`localhost` vs `127.0.0.1`)

Incluso al usar SQLite, otros servicios (Redis, Memcached, o configuraciones residuales) sufren en Windows si dicen `localhost` porque Windows trata de resolver IPv6 (`::1`) y luego hace _fallback_ a IPv4 tras 10 segundos.
**Solución:** En tu archivo `.env`, asegúrate de que **TODO** apunte a `127.0.0.1` en vez de `localhost`.

```env
DB_HOST=127.0.0.1
REDIS_HOST=127.0.0.1
MEMCACHED_HOST=127.0.0.1
```

---

## 🚦 Nivel 2: Filament Asset Caching y Optimización de OPcache

Cuando navegas a una página por primera vez, Filament compila componentes de Blade. En Windows, las operaciones de lectura/escritura en disco (I/O) son muchísimo más lentas que en Linux/Mac.

### 2.1 Publicar Assets y Cachear Componentes

Filament funciona mejor cuando sus librerias front-end no se analizan en cada request.
Ejecuta los siguientes comandos para limpiar y endurecer el caché local:

```bash
php artisan optimize:clear
php artisan filament:cache-components
php artisan view:cache
```

---

## 🚦 Nivel 3: El Problema de las Sesiones Bloqueadas (File Session Lock)

Si recargas la página muy rápido o abres múltiples pestañas en el entorno de desarrollo, el _Session Driver_ por defecto de Laravel (`file`) aplica un **bloqueo (lock)**. Si una petición anterior no terminó, la nueva petición se quedará colgada esperando que el archivo de sesión se libere (Adivina: El timeout por defecto de esto son ~10 a 20 segundos).

### 3.1 Cambiar el driver de sesión (Especialmente en SQLite)

Al usar `SQLite` como base de datos, tener sesiones en archivo compite por recursos de lectura de disco.
**Solución en `.env`:**
Cambia el driver de sesión a la base de datos (ya que tienes SQLite) o al driver `cookie` temporalmente local:

```env
SESSION_DRIVER=database
# o
SESSION_DRIVER=cookie
```

Si usas `database`, asegúrate de tener la tabla generada ejecutando `php artisan session:table` y luego `php artisan migrate`.

---

## 🚦 Nivel 4: N+1 Queries (El Problema del Eager Loading)

Aunque ahora tengas la base de datos casi vacía, es buena práctica configurarlo. Si tuvieras 100 colegios y `LevelResource` tiene que validar en vivo a qué `EducationalStage` pertenece cada uno, Laravel hará 101 consultas a la base de datos (El temido N+1).

### 4.1 Evita consultas repetidas en los Tables de Filament

En tus archivos recién creados (Ej: `LevelResource.php`), si en el `table()` muestras de qué `School` o de qué `EducationalStage` es ese nivel, incluye el `with()`:

```php
// En app/Filament/Resources/LevelResource.php
use Illuminate\Database\Eloquent\Builder;

public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()
        ->with(['educationalStage', 'school', 'academicYear']) // <-- EVITA EL N+1
        ->withoutGlobalScopes([
            SoftDeletingScope::class,
        ]);
}
```

---

## ✅ Resumen del Plan de Acción para Ejecutar Ya:

Si tuviera que apostar por la solución inmediata, ejecuta esto en un terminal:

1. `php artisan optimize:clear`
2. Ve a `.env` y asegúrate de cambiar `SESSION_DRIVER=database` (e instala la tabla si no está).
3. Asegúrate de ejecutar `npm run dev` en otra terminal para los assets.
4. Reinicia tu comando `php artisan serve`.

> **💡 Nota Modo Semi-Senior:**
> Que el Backend tarde 20 segundos en cargar es como intentar abrir una puerta donde la cerradura está siendo forzada por otra llave atascada del otro lado (eso es la Sesión Bloqueada) o el conserje está verificando los planos de toda la ciudad antes de abrirte (Vite/Red bloqueada). La aplicación no es lenta, es Laravel "esperando pacientemente" un error de red que tarda en estallar.
