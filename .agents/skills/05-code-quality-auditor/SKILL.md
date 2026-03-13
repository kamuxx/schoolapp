# Code Quality Auditor - SchoolApp

**Cuándo activarla:** Antes de generar código o al revisar cambios.

## Reglas Obligatorias

### Laravel Standards

| Check        | Regla                                                          | Ubicación         |
| ------------ | -------------------------------------------------------------- | ----------------- |
| Naming       | `PascalCase` modelos, `camelCase` métodos, `snake_case` tablas | DB                |
| Repositories | Toda consulta va en Repository, nunca en Controller            | app/Repositories/ |
| UseCases     | Lógica de negocio en UseCase, no en Controller                 | app/UseCases/     |
| Validación   | Request classes en `app/Http/Requests/`                        | Controllers       |

### Multi-Tenancy Check

```php
// ✅ CORRECTO
public function index(School $school) {
    return $this->repo->getBySchool($school->id);
}

// ❌ INCORRECTO - sin filtro school
return $this->repo->all();
```

### Auditoría Check

```php
// ✅ Obligatorio en migraciones
$table->unsignedBigInteger('created_by')->nullable();
$table->foreign('created_by')->references('id')->on('users');
$table->softDeletes();
```

## Regla: Sin respuestas genéricas

Indica **exactamente** qué file/line viola la regla.
