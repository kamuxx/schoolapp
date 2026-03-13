# Senior Technical Planner - SchoolApp

**Cuándo activarla:** Cuando el usuario pide implementar una feature o resolver bug.

## Workflow Implementación

### 1. Análisis (usa Context Analyzer)

- Localiza modelo, repository, usecase, controller, rutas
- Verifica multi-tenancy y auditoría

### 2. Planificar cambios

```
Tarea: [nombre]
Archivos afectados:
- app/Models/[Model].php [cambio]
- app/Repositories/[Repo].php [método]
- app/UseCases/[UseCase].php [lógica]
- database/migrations/[fecha]_[nombre].php [si aplica]
```

### 3. Implementar (orden obligatorio)

1. Migración (si DB)
2. Modelo (con traits)
3. Repository
4. UseCase
5. Request/Validation
6. Controller
7. Rutas
8. Tests

### 4. Verificar

- `composer lint` o `pint`
- `php artisan test`
- Revisar multi-tenancy

## Regla: Sin respuestas genéricas

Entrega el código **completo y funcional** para el stack Laravel/React de SchoolApp.
