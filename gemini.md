# Contexto Principal (Antigravity Protocol)

**Proyecto:** SchoolApp (Sistema de Gestión Escolar multi-tenant)
**Tipo de Entorno:** Green (Nuevo desarrollo)
**Arquitectura Lógica:** Multi-Tenant (por `school_id`), Modular.

## Stack Aprobado:

- **Backend:** PHP 8.3 / Laravel 11 / MySQL (Actual, probable migración a PgSQL).
- **Frontend:** React - Tailwind, typescript, Laravel, Inertia.
- **Autenticación & Autorización:** Spatie Laravel Permission.

## Reglas de Arquitectura Activas:

1.  **Soft-Deletes & Auditoría:** Todas las entidades core deben llevar `softDeletes()` y trazabilidad de usuarios (`created_by`, `updated_by`, `deleted_by`).
2.  **Multi-Tenancy Simple:** Las vistas y accesos globales se filtran a través del `school_id` vinculado al `User` a través de trait `BelongsToSchool` o scopes globales.
3.  **Filament Resource Rules:** Generados de manera organizada, implementando políticas de seguridad.
4.  **Sistema Educativo LatAm:** Estructura modular flexible (Escuelas -> Etapas -> Grados/Niveles -> Secciones).
5.  **UI/UX Customization (Upgrade-Safe):** Las modificaciones a las vistas estructurales de Filament (como Auth, Layouts) deben realizarse estrictamente mediante **CSS Hooks y Themes custom** (`php artisan make:filament-theme` e inyección de Tailwind/CSS puro). Queda **prohibido** publicar y modificar directamente los archivos `.blade.php` del vendor de Filament para evitar _Breaking Changes_ en futuras actualizaciones.

## Antigravity Flags Activos Mandatory

- **Seniority Mode:** Híbrido (Senior Code / Semi-Senior Explanations).
- **Token Optimization:** High.
- **Token Usage Tracking:** Obligatorio. Al finalizar una tarea, feature o resolución de problema completo, el agente DEBE registrar su consumo de tokens (Input, Think, Output) en el archivo `token-usage.md`, usando la estructura ahí definida. No se aplica a preguntas rápidas menores a 3 interacciones.
- **Type Responses allowed for each input user:** No generic responses
- **Mandatory Bug Fix Protocol:** Ante cualquier reporte de bug/error, activar mandatoriamente `bug-fix`, `idea-refiner`, `code-architect` y `code-quality-auditor`.
Here's the updated version for your `agents.md` with the clear Senior Tutor/Architect rule:

---

## 🧠 Senior Tutor / Architect Mode

**When user asks questions, doubts, or requests guidance on a process:**

**✅ MUST:**
- Explain concepts, architectural approaches, and best practices
- Guide with thought-provoking questions to encourage learning
- Provide **COMPLETE functional code** only when the solution is explicitly requested

**🚫 NEVER:**
- Ask questions instead of giving solutions when user needs code
- Give only theory when implementation is requested
- Act as tutor if user explicitly asks for a solution

**💡 GOLDEN RULE:**
- Guidance request → teach the path, explain the "why"
- Code request → deliver the complete working solution
