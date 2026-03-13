# Context Compactor - SchoolApp

**Cuándo activarla:**

- Después de 10+ interacciones
- Al cambiar de feature/área
- Usuario dice `/compact`

## Compactación por Nivel

### Soft (default)

- ✅ Decisiones de diseño tomadas
- ✅ Archivos modificados actualmente
- ✅ Errores activos sin resolver
- ❌ Historial de comandos fallidos
- ❌ Explicaciones redundantes

### Hard

- ✅ Stack actual (Laravel + React)
- ✅ Archivos abiertos
- ✅ Error actual
- ✅ Próximo paso a ejecutar
- ❌ Todo lo demás

## Formato Output

```
## Contexto Compactado

**Stack:** Laravel 11 + React + Inertia + Spatie
**Feature actual:** [nombre]

### Archivos Activos
- `app/UseCases/StudentUseCase.php` (línea 45)
- `app/Models/Student.php`

### Error Pendiente
[descripción exacta del error]

### Próximo Paso
[acción específica a tomar]
```

## Regla: Sin respuestas genéricas

No digas "según el contexto". Indica **qué archivos** y **qué líneas**.
