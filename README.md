# 🏫 SchoolApp — SaaS de Gestión Académica

> Sistema SaaS B2B multi-tenant para Unidades Educativas en Bolivia.
> Diseñado según la normativa del **Ministerio de Educación de Bolivia**.

---

## 🧱 Stack Técnico

| Capa | Tecnología | Versión |
|---|---|---|
| **Backend** | PHP + Laravel | `^8.2` / `^12.0` |
| **Panel Admin** | Filament | `^5.2` |
| **Testing** | PestPHP | `^4.4` |
| **Linter PHP** | Laravel Pint | `^1.24` |
| **DB Desarrollo** | SQLite | (driver activo en `.env`) |
| **DB Producción** | MySQL | `8.0+` |

---

## 🏛️ Arquitectura

### Monolito Moderno — Laravel + Filament

El backend sigue **Clean Architecture adaptada a Laravel**:

```
Routes → FormRequest (DTO + Validación) → Controller → UseCase → Repository → Model Eloquent
```

- **`UseCases/`** — Lógica de negocio pura, sin dependencia de HTTP ni Eloquent.
- **`Repositories/Contracts/`** — Interfaces de dominio.
- **`Repositories/Eloquent/`** — Implementaciones concretas.
- **Filament** — Gestiona todo el CRUD operativo (escuelas, usuarios, malla curricular).
- **Multi-Tenant** — Aislamiento por `school_id` mediante Global Scopes en todos los Models.

### Estructura Backend (`/app`)

```
app/
├── Filament/
│   └── Resources/      ← Resources de Filament (CRUD operativo).
├── Http/
│   ├── Controllers/    ← Solo orquestan. Nunca lógica de negocio.
│   └── Requests/       ← FormRequests como DTOs y validadores.
├── Models/             ← Eloquent puro + relaciones + Global Scope school_id.
├── Repositories/
│   ├── Contracts/      ← Interfaces (Ej: StudentRepositoryInterface).
│   └── Eloquent/       ← Implementaciones (Ej: EloquentStudentRepository).
└── UseCases/
    ├── Academic/       ← CalculateTermGradesUseCase, etc.
    ├── Attendance/     ← RegisterDailyAttendanceUseCase, etc.
    └── Institutional/  ← SetupSchoolProfileUseCase, etc.
```

---

## 📐 Dominio de Negocio

### Entidades Críticas

| Entidad | Rol |
|---|---|
| `School` | Tenant raíz. Todo dato está aislado por institución. |
| `AcademicYear` | Gestión / año lectivo. |
| `Term` | Trimestre (máx. **3** por ley boliviana). |
| `Level` | Grado (Ej: "1ro de Secundaria"). |
| `Section` | **Paralelo** — unidad atómica real (Ej: "1ro A"). |
| `Subject` | Materia asignada al Level (máx. **13** por ley). |
| `Student` | Inscrito a un `section_id` específico. |
| `CourseSubjectTeacher` | Pivot que vincula al docente con Materia + Paralelo. |
| `Attendance` | Registro diario: `present` / `absent` / `late`. |
| `EvaluationActivity` | Actividad dimensional anclada a trimestre. |
| `Grade` | Nota individual de un alumno en una actividad. |

### Reglas de Evaluación (Ley Boliviana — No Negociables)

| Dimensión | Máx. Puntos |
|---|---|
| `ser` | **10 pts** |
| `saber` | **45 pts** |
| `hacer` | **40 pts** |
| `autoevaluacion` | **5 pts** |
| **Total** | **100 pts** |

---

## 👥 Roles del Sistema

| Rol | Interfaz | Alcance |
|---|---|---|
| `super_admin` | Filament | Todas las escuelas |
| `admin` | Filament | Su `school_id` — configura malla y usuarios |
| `director` | Filament | Su `school_id` — reportes y aprobaciones |
| `secretaria` | Filament | Su `school_id` — filiación y reportes |
| `coordinador` | Filament | Su `school_id` |
| `docente` | Filament | Solo su `CourseSubjectTeacher` asignado |

---

## 🚀 Instalación y Desarrollo

### Requisitos

- PHP `^8.2`
- Composer `^2.x`
- SQLite (desarrollo) / MySQL 8.0+ (producción)

### Setup inicial

```bash
# Instala dependencias, configura .env y migra la BD
composer setup
```

### Comandos disponibles

```bash
composer dev      # Levanta el servidor de desarrollo
composer test     # Ejecuta la suite de PestPHP
composer lint     # Formatea PHP con Laravel Pint
```

---

## 🧪 Matriz de Tests Críticos

| ID | Descripción | Prioridad |
|---|---|---|
| UT-01 | Tope de actividades por dimensión `ser` | 🔥 Crítica |
| UT-02 | Límite de puntaje en `saber` (máx 45) | 🔥 Crítica |
| UT-03 | Cálculo de promedios internos por dimensión | 🔥 Crítica |
| UT-04 | Suma total = 100 pts exactos | 🔥 Crítica |
| IT-01 | Bloqueo de >13 materias por nivel | Alta |
| IT-02 | Endpoint Centralizador <2s respuesta | 🔥 Crítica |

---

## 📦 Módulos del MVP

| Semana | Módulo |
|---|---|
| 1 | **Institucional** — Perfil Escolar, Malla Curricular (Niveles + Paralelos + Materias) |
| 2 | **Filiativo** — Estudiantes, Docentes, Carga Horaria + Evaluaciones Dimensionales |
| 3 | **Operativa** — Asistencia Diaria, Dashboard, Cuadro de Honor, Centralizador |
| 4 | **Certificación** — Boletines Ministerio + Pruebas finales |

---

## 📄 Licencia

Proyecto privado — © SchoolApp. Todos los derechos reservados.
