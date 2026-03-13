# Guía de Construcción de Módulos (Antigravity Protocol)

**Propósito:** Este documento sirve como Producto Requirements Document (PRD) y Guía Estricta para que cualquier Agente de IA construya un nuevo módulo core dentro de **SchoolApp** replicando exactamente la arquitectura probada en el módulo de `Permissions`.

**Nivel de Obligatoriedad:** ESTRICTO. Todo nuevo módulo debe calcar este flujo capa por capa.

---

## 1. Arquitectura Lógica (Flow)

El sistema utiliza una arquitectura por capas simplificada (Clean-ish Architecture) para desacoplar las capas de transporte HTTP, reglas de negocio, y acceso a datos.

**Flujo de Datos Autorizado:**
`Route` → `Controller` → `UseCase` → `Repository` → `Model` (Base de Datos)

### Reglas Cero Tolerancia (Red Flags)
1. ⛔ **Prohibido inyectar Models en el Controller o UseCase:** Toda interacción con la Base de datos ocurre a través de los `Repositories`.
2. ⛔ **Multi-Tenancy Obligatorio:** Todo modelo de negocio debe tener la columna `school_id`, el trait `BelongsToSchool`, e integrarse a la política de scopes globales/tenant filtrado.
3. ⛔ **Soft Deletes Obligatorio:** Nunca se borra registro físico de entidades core, usar el trait `SoftDeletes`.
4. ⛔ **Prohibido Lógica Compleja en el Controller:** El Controller solo valida el Request y delega la ejecución al `UseCase`.

---

## 2. Definición de las Capas (Ejemplo basado en `Permissions`)

### A. La Capa de Modelo (`app/Models/{Entity}.php`)
Representa la tabla en la BD y sus relaciones. 

**Deberes del Agente:**
- Extender `Model` (o Spatie equivalente si aplica).
- Usar traits: `HasFactory`, `SoftDeletes`, `BelongsToSchool`.
- Declarar `$table`, `$fillable`.
- Definir scopes de búsqueda (`scopeSearch{Entity}`) para procesar los `$filters`. Se debe retornar el instancia `Builder` configurado, NO ejecutar el `->get()` aquí.

### B. El Repositorio (`app/Repositories/{Entity}Repository.php`)
Capa de acceso y abstracción de bases de datos. Extiende de `BaseRepository`.

**Deberes del Agente:**
- Inyectar el `Model` por Constructor e invocar al padre.
- Implementar los métodos CRUD básicos:
  - `find($id)`
  - `create(array $data)`
  - `update($id, array $data)`
  - `delete($id)`
- Implementar método para listar con filtros de búsqueda y paginación acoplado al scope del modelo (`search(...)`).

### C. El Caso de Uso (`app/UseCases/{Entity}UseCase.php`)
Las verdaderas Reglas de Negocio habitan aquí. 

**Deberes del Agente:**
- Inyectar el `{Entity}Repository` en el constructor.
- Desestructurar los `Requests` en el Controller pero procesarlos aquí (ej. extrayendo filtros y offset/limit para búsqueda).
- Exponer métodos concretos y de nombres lógicos a la acción solicitada (`list{Entities}`, `create{Entity}`, `update{Entity}`, `delete{Entity}`).
- Aquí se pueden inyectar llamadas a otros repositorios si la regla de negocio lo implica.

### D. El Controlador (`app/Http/Controllers/{Entity}Controller.php`)
El "Punto de Entrada" (API/Web). 

**Deberes del Agente:**
- Inyectar el `{Entity}UseCase`.
- Validar el `Request` (FormRequest o inline `$request->validate()`). NO delegar validación de Request al UseCase.
- Invocar el método correspondiente en el `UseCase`.
- Retornar la respuesta (`Inertia::render`, `response()->json` o `redirect()->back()`).

### E. Frontend: React + Inertia + Tailwind (`resources/js/pages/...`)
**Deberes del Agente:**
- Retornar Componentes Funcionales tipados con TypeScript.
- Respetar la nomenclatura de rutas de Inertia y la inyección de props generada por el `Controller`.
- Utilizar componentes base/UI corporativos (Tailwind).

---

## 3. Guía Paso a Paso para Construir un Módulo (El "Prompt" del Agente)

Cuando un humano solicite: *"Crea el módulo de {NuevaEntidad}"*, ejecuta estrictamente esta secuencia:

**Paso 1: Análisis y Scaffolding**
- Identifica los campos requeridos y cómo integran al `school_id`.
- Generar Migración (`php artisan make:migration create_{entities}_table`). OJO: Añadir `softDeletes` y `school_id`.
- Revisar reglas en `User Rules` de `gemini.md`.

**Paso 2: Model & Repositories**
- Crear/Actualizar Model `app/Models/Entity.php` dotándolo de `BelongsToSchool` y el scope de `Search`.
- Crear el `app/Repositories/EntityRepository.php` extendiendo `BaseRepository`.

**Paso 3: UseCases & Business Logic**
- Crear `app/UseCases/EntityUseCase.php`. Mapea los metodos CRUD llamando al repositorio.

**Paso 4: Routing & Controllers**
- Crear el Controlador `app/Http/Controllers/EntityController.php`.
- Inyectar `EntityUseCase`.
- Definir rutas en `routes/web.php` (o la ruta correspondiente asignada).

**Paso 5: Frontend Interface**
- Construir vistas en `resources/js/pages/{Entity}/Index.tsx` conectando mediante Inertia al controller.
- Garantizar implementaciones de feedback de estado (Ej. Flash messages de "Eliminado correctamente").

> **Nota para el Agente:** Siempre comunica tus planes con el enfoque *Senior Code / Semi-Senior Explanation*, utilizando analogías claras (ej: "El UseCase será como el director de orquesta que manda pedir las notas al Repository").
