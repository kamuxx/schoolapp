# Testing Strategy - SchoolApp

**Cuándo activarla:** Al crear features o resolver bugs.

## Stack Testing

- **Framework:** PHPUnit (config en `phpunit.xml`)
- **Factory:** Laravel Factories en `database/factories/`
- **Helpers:** `tests/TestCase.php`

## Estructura Tests

```
tests/
├── Feature/          # HTTP tests (controllers, API)
│   └── [Entity]Test.php
├── Unit/             # Logic tests (UseCases, Repositories)
│   └── [Entity]Test.php
└── CreatesApplication.php
```

## Reglas por Tipo

### Unit Tests (UseCase/Repository)

```php
// ✅ Testea lógica con mock de repo
public function test_crear_estudiante_asigna_school_id() {
    $school = School::factory()->create();
    $user = User::factory()->for($school)->create();

    $useCase = new CreateStudentUseCase($this->repo);
    $result = $useCase->execute($user, ['name' => 'Test']);

    $this->assertEquals($school->id, $result->school_id);
}
```

### Feature Tests (Controller)

```php
// ✅ Testea endpoint con autenticación
public function test_estudiante_store_requires_school_context() {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/api/students', ['name' => 'Test']);

    $response->assertStatus(403); // Sin school asignada
}
```

## Regla: Sin respuestas genéricas

Usa los models/factories **reales** del proyecto: `Student::factory()`, `School::factory()`, etc.
