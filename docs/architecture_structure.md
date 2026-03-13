# Arquitectura y Estructura de Directorios (MVP)

**Proyecto:** SaaS Gestión Académica (Bolivia)
**Stack Técnico:** Laravel 11.x + React 18 (Arquitectura Monolítica) + MySQL
**Patrón de Diseño Backend:** Clean Architecture Adaptada (UseCases + Repositories).
**Patrón de Diseño Frontend:** Estructura simplificada basada en Pages.

---

## 1. Top-Level Structure (Monolito)

El sistema operará como un **Monolito Moderno**. El frontend (React) vivirá dentro de la estructura de Laravel y será compilado mediante Vite directamente a los *assets* públicos del framework, simplificando el despliegue a un solo servidor y un solo repositorio.

```text
/buhoapp (Repositorio Principal)
├── /app                <- Backend: Lógica de la API (Laravel)
├── /database           <- Configuraciones de MySQL (Migraciones)
├── /resources
│   └── /js             <- Frontend: Código fuente de React SPA
├── /public             <- Assets compilados y punto de entrada
├── /routes
│   ├── api.php         <- Endpoints Backend
│   └── web.php         <- Carga de la SPA de React
├── /docs               <- Documentación MVP
├── package.json        <- Dependencias Frontend
└── vite.config.ts      <- Configuración de empaquetado React
```

---

## 2. Backend Architecture: Clean Architecture (Adaptada Laravel)

Implementaremos una versión pragmática de *Clean Architecture* que respeta las herramientas nativas de Laravel pero aísla la lógica de negocio.

**Regla DTO:** No crearemos clases DTO (Data Transfer Objects) manuales; delegaremos esa resposabilidad a los `FormRequests` de Laravel, que validarán y transportarán la data segura hacia los Use Cases.

```text
/app
├── /Http
│   ├── /Controllers    <- Solo inyectan UseCases y retornan JSON (API Resources).
│   ├── /Requests       <- Actúan como nuestros validadores y DTOs seguros.
│   └── /Resources      <- Presenters: Transforman el modelo de DB a JSON.
│
├── /Models             <- Modelos Eloquent puros (Definición de relaciones y tablas).
│
├── /Repositories       <- Capa de Acceso a Datos (Punto de contacto con DB/Eloquent)
│   ├── /Contracts      <- Interfaces (Ej. StudentRepositoryInterface)
│   └── /Eloquent       <- Implementación real (Ej. EloquentStudentRepository)
│
└── /UseCases           <- 🧠 LA LÓGICA DE NEGOCIO (Casos de Uso)
    ├── /Academic       <- Ej. CalculateTermGradesUseCase
    ├── /Attendance     <- Ej. RegisterDailyAttendanceUseCase
    └── /Institutional  <- Ej. SetupSchoolProfileUseCase
```

### 🛡️ Flujo de Petición Estricto:
`Route` -> `FormRequest` (Valida y filtra) -> `Controller` -> Ejecuta `UseCase` (Recibe la data validad y llama a los correspondientes) -> `Repository` (Guarda o Consulta en MySQL).

---

## 3. Frontend Architecture: React (Simple Pages)

Evitaremos la complejidad de "Screaming Architecture" o "Feature-Sliced Design". Utilizaremos una estructura chata enfocada en `pages` (vistas de pantalla completa) y componentes agnósticos, ideal para la agilidad de las 4 semanas del MVP.

```text
/resources/js
├── /components         <- Componentes UI reutilizables (Botones, Tablas, Inputs).
│   ├── /ui             <- Shadcn UI base.
│   └── /shared         <- Componentes de dominio ligeros (Ej. StatusBadge).
│
├── /hooks              <- Custom hooks globales.
│
├── /pages              <- Vistas ruteables (Pantallas completas)
│   ├── /Admin          <- Ej: Dashboard.jsx, Filiacion.jsx
│   ├── /Teacher        <- Ej: CargaNotas.jsx, AsistenciaDiaria.jsx
│   └── /Auth           <- Ej: Login.jsx
│
├── /services           <- Llamadas API (Axios).
├── /utils              <- Funciones helper.
└── App.jsx             <- Enrutamiento (React Router DOM) y Providers.
```

---

## 4. Estrategia de Base de Datos y MySQL

*   **Motor Principal:** Se utilizará **MySQL** (versión 8.0+) por su amplia compatibilidad, facilidad de configuración en entornos compartidos y bajo costo de mantenimiento inicial.
*   **Escalabilidad Estructural:** El diseño con migraciones de Laravel asegura que si el SaaS escala monstruosamente en el Año 2, la migración teórica hacia otro motor o hacia múltiples bases de datos esté protegida por la capa `/Repositories` que aísla a Eloquent de la lógica de negocio.
*   **Filtrado de Empresa:** Aplicación de Global Scopes de Laravel en los `Models` para inyectar automáticamente el `WHERE school_id = X`, asegurando el "Multi-Tenant" sin complejizar las consultas manuales.
