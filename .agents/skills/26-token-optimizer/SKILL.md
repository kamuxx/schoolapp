# Token Optimizer - SchoolApp

**Cuándo activarla:**

- Al crear/modificar archivos en `.agents/`
- Optimizar respuestas largas
- Usuario dice `/optimize-tokens`

## Estrategias Aplicables

### En Código Generado

```php
// ✅ OPTIMIZADO - sin comentarios obvios
public function execute(int $schoolId, array $data): Student {
    return Student::create(array_merge($data, [
        'school_id' => $schoolId
    ]));
}

// ❌ REDUNDANTE - comentario innecesario
public function execute(int $schoolId, array $data): Student {
    // Create student with school id
    return Student::create(array_merge($data, [
        'school_id' => $schoolId
    ]));
}
```

### En Skills/Docs

- Eliminar introducciones tipo "Aquí tienes..."
- Usar tablas en vez de listas largas -压缩 > 缩短 (comprimir conceptos)

### En Respuestas

- Ir directo al punto
- No repetir lo que el usuario sabe
- Usar ejemplos específicos del proyecto

## Regla: Sin respuestas genéricas

Optimiza mencionando **el archivo específico** que optimizaste.
