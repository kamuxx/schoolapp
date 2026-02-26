# Project Mandate: SchoolApp — SaaS Gestión Académica Bolivia

> **Mandato activo.** Este archivo es la fuente de verdad del proyecto.
> Cualquier decisión técnica que contradiga este documento debe ser consultada antes de implementarse.

---

## 1. Stack Técnico (No Negociable)

| Capa | Tecnología | Versión |
|---|---|---|
| **Lenguaje Backend** | PHP | ^8.2 |
| **Framework Backend** | Laravel | ^12.0 |
| **Panel Admin** | Filament | ^5.2 (recién instalado) |
| **Bridge SPA** | Inertia.js | ^2.0 |
| **Lenguaje Frontend** | TypeScript | ^5.7 |
| **Framework Frontend** | React | ^19.2 |
| **Estilos** | Tailwind CSS | ^4.0 |
| **Componentes UI** | shadcn/ui + Radix UI | (ver `components.json`) |
| **Bundler** | Vite | ^7.0 |
| **Testing Backend** | PestPHP | ^4.4 |
| **Linter PHP** | Laravel Pint | ^1.24 |
| **DB (Desarrollo)** | SQLite | (driver activo en `.env`) |
| **DB (Producción)** | MySQL | 8.0+ |
| **Auth** | Laravel Fortify | ^1.30 |
| **Routing tipado** | Laravel Wayfinder | ^0.1.9 |

---

## 2. Arquitectura

### Patrón General: Monolito Moderno (Modular)
- **Backend:** Clean Architecture Adaptada a Laravel.
  - `Routes` → `FormRequest` (DTO + Validación) → `Controller` → `UseCase` → `Repository` → `Model Eloquent`
  - Capa `UseCases/` contiene la lógica de negocio pura (sin dependencia de HTTP ni Eloquent).
  - Capa `Repositories/Contracts/` define interfaces; `Repositories/Eloquent/` las implementa.
  - Los `ApiResource` actúan como Presenters (transforman modelos a JSON).
- **Admin Panel:** Filament v5 gestiona el CRUD operativo (escuelas, usuarios, configuración académica).
- **Frontend SPA:** React + Inertia, páginas en `resources/js/pages/` separadas por rol.
- **Multi-Tenant:** Filtrado por `school_id` mediante **Global Scopes** en los Models. Todo dato está aislado por institución.

### Estructura de Carpetas Backend (`/app`)
```
app/
├── Http/
│   ├── Controllers/   ← Solo orquestan. Nunca lógica de negocio.
│   ├── Requests/      ← FormRequests como DTOs y validadores.
│   └── Resources/     ← API Resources como Presenters.
├── Models/            ← Eloquent puro + relaciones + Global Scope school_id.
├── Repositories/
│   ├── Contracts/     ← Interfaces (Ej: StudentRepositoryInterface).
│   └── Eloquent/      ← Implementaciones (Ej: EloquentStudentRepository).
└── UseCases/
    ├── Academic/      ← CalculateTermGradesUseCase, etc.
    ├── Attendance/    ← RegisterDailyAttendanceUseCase, etc.
    └── Institutional/ ← SetupSchoolProfileUseCase, etc.
```

### Estructura de Carpetas Frontend (`/resources/js`)
```
resources/js/
├── components/
│   ├── ui/            ← shadcn/ui base components.
│   └── shared/        ← Componentes de dominio ligero (StatusBadge, etc.).
├── hooks/             ← Custom hooks globales.
├── pages/
│   ├── Admin/         ← Dashboard, Filiacion, etc.
│   ├── Teacher/       ← CargaNotas, AsistenciaDiaria, etc.
│   └── Auth/          ← Login.
├── services/          ← Llamadas API (fetch/axios).
└── utils/             ← Helpers reutilizables.
```

---

## 3. Dominio de Negocio (Bolivia — Reglas Inmutables)

### Contexto
Sistema SaaS B2B para Unidades Educativas en Bolivia. Respeta la terminología y normativa del **Ministerio de Educación de Bolivia**.

### Entidades Críticas (el núcleo del dominio)
| Entidad | Rol |
|---|---|
| `School` | Tenant. Raíz de aislamiento de todos los datos. |
| `AcademicYear` | Gestión (año lectivo). |
| `Term` | Trimestre (máx. 3 por ley boliviana). |
| `Level` | Grado (Ej: "1ro de Secundaria"). |
| `Section` | **Paralelo** — unidad atómica real (Ej: "1ro A"). |
| `Subject` | Materia. Se asigna al Level (máx. 13 por ley). |
| `Student` | Inscrito a un `section_id` específico. |
| `CourseSubjectTeacher` | Pivot que "candadea" al docente a Materia + Paralelo. |
| `Attendance` | Registro diario por alumno (`present` / `absent` / `late`). |
| `EvaluationActivity` | Actividad dimensional anclada a trimestre. |
| `Grade` | Nota individual de un alumno en una actividad. |

### Reglas de Negocio No Negociables
1. **La unidad mínima es el Paralelo (`Section`):** Un alumno no existe en "1ro Básico", existe en "1ro Básico Paralelo A". Todo query filtra por `section_id`.
2. **Dimensiones Evaluativas con topes fijos (Ley boliviana):**
   - `ser` → máx. **10 pts**
   - `saber` → máx. **45 pts**
   - `hacer` → máx. **40 pts**
   - `autoevaluacion` → máx. **5 pts**
   - **Total siempre = 100 pts.** El sistema valida estos topes en `FormRequest` y `UseCase`. Son incondicionales.
3. **Privacidad de carga:** El docente solo accede a los alumnos del Paralelo donde tiene `CourseSubjectTeacher` asignado.
4. **Máximo 13 materias** por Nivel (validación en `IT-01`).
5. **Máximo 3 Trimestres** por Gestión. El UI bloquea la creación de un 4to.

### Módulos del MVP (4 Semanas)
| Semana | Módulo |
|---|---|
| 1 | Institucional: Perfil Escolar, Malla (Niveles + Paralelos + Materias) |
| 2 | Filiativo: Estudiantes, Docentes, Carga Horaria + Evaluaciones dimensionales |
| 3 | Operativa: Asistencia diaria, Dashboard, Cuadro de Honor, Centralizador |
| 4 | Certificación: Boletines para Ministerio + Pruebas finales |

---

## 4. Testing (Matriz Crítica)

**Framework:** PestPHP. **Filosofía:** Bug-Driven Development sobre las reglas dimensionales.

| ID | Tipo | Prioridad |
|---|---|---|
| UT-01 | Tope de actividades por dimensión "ser" | 🔥 Crítica |
| UT-02 | Límite de puntaje en "saber" (máx 45) | 🔥 Crítica |
| UT-03 | Cálculo de promedios internos por dimensión | 🔥 Crítica |
| UT-04 | Suma total = 100 pts exactos | 🔥 Crítica |
| IT-01 | Bloqueo de >13 materias por nivel | Alta |
| IT-02 | Endpoint Centralizador <2s respuesta | 🔥 Crítica |
| E2E-01 | UI bloquea nota >5 en Autoevaluación | Alta |
| E2E-02 | UI oculta opción "4to Trimestre" | Media |

---

## 5. Modelo de Negocio (Contexto SaaS)

- **Tipo:** B2B SaaS — Multi-tenant por `school_id`.
- **Mercado:** Unidades Educativas, Bolivia.
- **MRR por institución:** $30 USD/mes.
- **División societaria (33/33/33):** Infraestructura / Socio Técnico (Venezuela) / Socio Comercial (Bolivia).
- **Escalabilidad:** Añadir una nueva escuela = crear un registro en `schools`. Costo computacional = 0.

---

## 6. Convenciones de Código

- **Idioma de comentarios:** Español técnico.
- **Idioma de explicaciones:** Español, nivel Junior-Friendly.
- **Nesting máximo:** 2 niveles (refactorizar inmediatamente si se supera).
- **Longitud máxima de función:** 40 líneas.
- **Variables:** Máximo 3 palabras, nombres descriptivos en `camelCase` (JS/TS) o `snake_case` (PHP).
- **Sin magic numbers:** Toda constante dimensional (`SER_MAX = 10`, etc.) debe estar definida en un `Enum` o constante de dominio.
- **Filament:** Los Resources de Filament viven en `app/Filament/Resources/`. Los paneles en `app/Providers/Filament/`.

---

## 8. Roles del Sistema

> **⚠️ Sección de revisión periódica.** Revisar con el feedback del primer cliente piloto e iterar según los permisos reales requeridos por cada institución.

### Implementación

- **Paquete:** `spatie/laravel-permission` + `filament-shield` para el panel Filament.
- **Definición:** Los roles viven en un `Enum` PHP (`Role::SuperAdmin`, etc.). No se crean roles dinámicos en MVP.

### Roles Activos (MVP)

| Rol | Valor Enum | Interfaz | Alcance de Datos |
|---|---|---|---|
| Super Admin | `super_admin` | Filament | Todas las escuelas — sin restricción `school_id` |
| Admin | `admin` | Filament | Su `school_id` — **configura** malla curricular y usuarios |
| Director | `director` | Filament + Inertia | Su `school_id` — **reporta y aprueba**, no configura |
| Secretaria | `secretaria` | Filament | Su `school_id` — filiación de alumnos y reportes admin |
| Coordinador | `coordinador` | Filament + Inertia | Su `school_id` — puede haber N coordinadores por escuela |
| Docente | `docente` | Inertia/React | Solo el Paralelo + Materia de su `CourseSubjectTeacher` |

### Roles Planificados (v2 — inactivos en MVP)

| Rol | Valor Enum | Módulo Futuro |
|---|---|---|
| Estudiante | `estudiante` | Portal de consulta de boletín propio |
| Representante | `representante` | Portal de consulta del boletín del hijo |

> Los roles `estudiante` y `representante` deben existir en el `Enum` desde el inicio pero sin rutas activas hasta que se desarrollen sus módulos.

### Reglas de Alcance de Datos

- **`super_admin`:** Bypassa el Global Scope de `school_id`. Puede ver todo.
- **`admin`, `director`, `secretaria`, `coordinador`:** Filtrados estrictamente por `school_id` via Global Scope.
- **`coordinador`:** No hay límite de coordinadores por escuela. Si en el futuro se necesita restricción por nivel, se añade pivot `coordinator_levels` sin romper el sistema.
- **`docente`:** Policy adicional verifica existencia de `CourseSubjectTeacher` para el paralelo/materia solicitado.

---

## 7. Comandos de Desarrollo


```bash
# Levantar servidor completo (API + Queue + Vite en paralelo)
composer dev

# Ejecutar tests
composer test

# Formatear PHP
composer lint

# Formatear JS/TS
npm run format

# Build producción
npm run build
```
