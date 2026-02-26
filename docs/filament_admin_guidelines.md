# Filament Admin Panel: Standard Operating Procedure (SOP)

**Proyecto:** SaaS Gestión Académica
**Versión Filament:** v3 (con Laravel 12)

Esta guía define el proceso cronológico, no-negociable y estricto que debes seguir para ensamblar el Panel de Administración de este proyecto. Se basa en las reglas del marco de calidad de `AGENTS.md` y `gemini.md`.

---

## FASE 1: Seguridad y Aislamiento (Tenancy)

Antes de crear la primera pantalla visual, la seguridad del Multi-Tenant debe estar blindada.

### 1. Filament Shield (Roles y Permisos Mapeados a Spatie)
*   **Instalación:** Instala `bezhanSalleh/filament-shield`.
*   **Aviso Crucial:** Filament Shield generará dinámicamente pantallas de gestión de roles usando los modelos custom que ya creaste (`App\Models\Role` y `App\Models\Permission`).
*   **Configuración:** No uses "Roles" genéricos. Obliga al Shield a leer de los 8 roles pre-alimentados (`super_admin`, `admin`, `director`, `secretaria`, `coordinador`, `docente`, `estudiante`, `representante`).

### 2. Soporte Tenancy en Filament
*   Aplica la documentación de *Filament Multi-Tenancy* para que el panel se englobe en la base del `school_id`.
*   Un usuario (Panel Admin) pertenece a un **Tenant (School)**.
*   **Super Admin Check:** Si un usuario es `super_admin`, el alcance Tenancy se debe ignorar o permitirle brincar de Tenant a Tenant.

---

## FASE 2: Arquitectura Limpia en FormRequests y Acciones

En Filament, la tentación de quemar "reglas de negocio" (en `mutateFormDataBeforeCreate`, o en callbacks de los formularios) es inmensa. **ESTO ESTÁ PROHIBIDO** en nuestro proyecto (Ver *Clean Architecture Tropicalized*).

### 1. Intercepción de Acciones
Toda lógica de creación compleja (Ej. "Inscribir un Alumno verificando que la Sección tenga cupos") *NO* va en la clase del Resource de Filament.
*   Usa el patrón Acción o delega a un **UseCase**.
*   Inyecta el UseCase en las Custom Pages o engloba la operación del Formulario de Filament de manera que solo sea orquestación.

### 2. Validaciones Custom y DTOs
*   Aunque Filament maneja geniales validadores visuales (`->required()->maxLength(255)`), la validación de negocio profunda debe estar cubierta a nivel Backend. No dependas solo de la alerta roja visual.

---

## FASE 3: Desarrollo Visual de los Resources

Sigue este orden de creación de Recursos en Filament, priorizando de la configuración a la operación.

### Prioridad de Desarrollo (Sprint 1)
1.  **SchoolResource** (Solo para `super_admin`) - Panel maestro para dar de alta a nuevos colegios al SaaS.
2.  **UserResource** (Restringido por tenant) - Dar de alta Director, Docentes, y coordinadores. *Obligatorio:* Asignación de Roles en la misma vista usando Filament Shield.
3.  **AcademicYearResource & TermResource** - "El Esqueleto".
4.  **LevelResource & SectionResource** - "El Músculo". Agrupación jerárquica.
5.  **SubjectResource** - "Las Materias".

### Convenciones Estéticas y de Pantallas
1.  **Formularios de Dos Columnas:** Respeta el patrón de Filament. Tarjeta grande de datos a la izquierda (`columnSpan(8)`), tarjeta lateral de meta-estados a la derecha (`columnSpan(4)`).
2.  **Idioma de Código (Inglés), Interfaz (TBD - LATAM):** Tus clases y archivos serán `SectionResource.php`, pero usa los métodos de traducción o el método estático `translate()` para que visualmente en la tabla diga "Secciones" o "Paralelos" dependiendo del requerimiento.
3.  **No borrados físicos:** Usa `SoftDeletes` masivo (`TrashedFilter` en las tablas de Filament).
4.  **Eager Loading Obligatorio:** Si `StudentResource` muestra el `Section`, asegúrate de instruirle al Resource que haga eager loading (`protected static ?array $with = ['section'];`) para no matar la base de datos con consultas repetidas (Performance Mandate).

---

## Cierre de Fase

Una vez desarrollados los Recursos, Filament deja de ser el foco y pasamos a **Inertia.js v2 (React)** para las pantallas del Docente (pasar lista, poner notas) porque requieren iteración custom e interactividad veloz no apta para Livewire-CRUD.
