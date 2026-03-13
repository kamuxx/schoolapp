# SchoolApp Agent Guidelines

## Regla No Negociable: Sin Respuestas Genéricas

**Todo output debe ser específico al contexto de SchoolApp:**

| ❌ GENÉRICO                        | ✅ ESPECÍFICO                                                |
| ---------------------------------- | ------------------------------------------------------------ |
| "Dependiendo del caso..."          | Usa `app/Models/{Entity}.php` y filtra por `school_id`       |
| "Laravel tiene varias opciones..." | Implementa Repository Pattern con `BaseRepository` existente |
| "Puedes usar middleware..."        | Aplica `SchoolScope` de `app/Traits/BelongsToSchool.php`     |

---

## Stack Actual

- **Backend:** Laravel 11 + PHP 8.3 + MySQL
- **Frontend:** React + Inertia + Tailwind + TypeScript
- **Auth:** Laravel Fortify + Spatie Permissions
- **Testing:** PHPUnit (config en `phpunit.xml`)

## Arquitectura Activa

1. **Multi-Tenancy:** Filtrar por `school_id` en todo acceso a datos
2. **Repository Pattern:** Todo acceso a datos vía `app/Repositories/`
3. **Use Cases:** Lógica de negocio en `app/UseCases/`
4. **Soft Deletes + Auditoría:** `created_by`, `updated_by`, `deleted_by` obligatorios
5. **UI Custom:** CSS Hooks/Tailwind - SIN modificar vendor files de Filament

## Tokens

- Tracking obligatorio en `token-usage.md` al completar features
- Optimización activa en cada respuesta

## Activación de Skills

Usa las skills locales en `.agents/skills/` según necesidad:

- Context Analyzer: Análisis inicial
- Code Quality Auditor: Revisión de código (Mandatorio para fixes)
- Senior Technical Planner: Implementación de features
- Testing Strategy: Verificación
- Context Compactor: Ahorro de tokens
- Token Optimizer: Compresión de archivos
- **Bug Fix (Mandatorio)**: Activación automática ante reportes de error/comportamiento inesperado.
- Idea Refiner: Clarificación de requisitos
- bug-fix: Corrección de errores
