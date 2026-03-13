# Context Analyzer - SchoolApp

**Cuándo activarla:** Al inicio de cada sesión o cuando se cambia de área funcional.

## Análisis Obligatorio

### 1. Ubica el archivo central

| Área          | Busca en                                      |
| ------------- | --------------------------------------------- |
| Modelos       | `app/Models/{Entity}.php`                     |
| Repositories  | `app/Repositories/{Entity}Repository.php`     |
| UseCases      | `app/UseCases/{Entity}UseCase.php`            |
| Controladores | `app/Http/Controllers/{Entity}Controller.php` |
| Rutas         | `routes/` (api.php, web.php)                  |

### 2. Verifica multi-tenancy

- ¿El modelo usa `BelongsToSchool` trait?
- ¿El Repository filtra por `school_id`?
- ¿El UseCase valida acceso a la escuela?

### 3. Auditoría

- ¿Tiene `softDeletes()`?
- ¿Tiene campos `created_by`, `updated_by`, `deleted_by`?

### 4. Permisos

- ¿Existe Policy en `app/Policies/`?
- ¿Los permisos están definidos en config/permission.php?

## Regla: Sin respuestas genéricas

Si no localizas el archivo específico → indica **exactamente** qué buscaste y dónde.
