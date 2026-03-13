# Database Schema: SaaS Gestión Académica (LATAM Multi-Tenant)

**Enfoque Arquitectónico:** Multi-Tenant Estricto (Aislado por `school_id`)
**Motor DB:** MySQL 8.0+

Para soportar un sistema escalable en LATAM, las entidades están abstraídas (Ej: Sections en vez de Paralelos, Terms en vez de Trimestres). La estructura se ancla robustamente al `school_id` del tenant, y la carga horaria vincula a un docente con una Materia en una **Sección** específica, no en un Grado genérico.

---

## 1. Entity-Relationship Diagram (MERMAID)

```mermaid
erDiagram
    %% Módulo 1: Institucional y Seguridad
    SCHOOLS {
        int id PK
        string name "Nombre Empresa/Colegio"
        string slug "Identificador URL"
        string country
        string academic_system "trimestral | semestral | bimestral"
        string logo_url
        boolean is_active
    }

    USERS {
        int id PK
        int school_id FK "Nullable for SuperAdmin"
        string first_name
        string last_name
        string email
        string password
        string role "super_admin | admin | director | coordinar | docente..."
        boolean is_active
    }

    %% Periodos Académicos
    ACADEMIC_YEARS {
        int id PK
        int school_id FK
        string name "Ej 2026 o 2026-2027"
        boolean is_active
    }

    TERMS {
        int id PK
        int academic_year_id FK
        string name "1er Trimestre, Q1"
        date start_date
        date end_date
    }

    %% Módulo Académico Físico (La Malla)
    LEVELS {
        int id PK
        int school_id FK
        int academic_year_id FK
        string name "Ej: 1ro de Secundaria"
    }

    SECTIONS {
        int id PK
        int school_id FK
        int level_id FK
        string name "El Paralelo/Grupo (Ej: A, B, C)"
        int primary_advisor_id FK
    }

    SUBJECTS {
        int id PK
        int school_id FK
        int level_id FK
        string name "Ej: Matemáticas"
        string short_name
    }

    %% Módulo Filiativo y Seguridad de Carga
    STUDENTS {
        int id PK
        int school_id FK
        string first_name
        string last_name
        string national_id_type "DNI, CI, RUT"
        string national_id_number
        string student_code "Ej: RUDE"
    }

    ENROLLMENTS {
        int id PK
        int school_id FK
        int student_id FK
        int section_id FK
        int academic_year_id FK
        string status "active | transferred | dropped"
    }

    COURSE_SUBJECT_TEACHERS {
        int id PK
        int school_id FK
        int teacher_id FK "Must be Teacher"
        int subject_id FK
        int section_id FK "Profesor -> Materia -> Sección A"
    }

    %% Módulo Académico Operativo e Incidentes
    INCIDENT_TYPES {
        int id PK
        int school_id FK
        string name "Ej: Uniforme"
        int severity_level
    }

    INCIDENTS {
        int id PK
        int school_id FK
        int student_id FK
        int incident_type_id FK
        int reported_by_id FK
        date incident_date
        string observation
    }

    ATTENDANCES {
        int id PK
        int school_id FK
        int section_id FK
        int student_id FK
        date date "Día de la lista"
        string status "presente | ausente | atraso"
    }

    EVALUATION_ACTIVITIES {
        int id PK
        int school_id FK
        int course_subject_teacher_id FK "Quien evalua en qué Sección"
        int term_id FK "Periodo evaluado"
        string dimension "Parametrizable por escuela"
        string description "Ej: Examen Algebra"
        decimal max_score "Tope de nota max"
    }

    GRADES {
        int id PK
        int school_id FK
        int evaluation_activity_id FK
        int student_id FK
        decimal score "La nota final del alumno en la actividad"
    }

    %% Relationships
    SCHOOLS ||--o{ USERS : "has"
    SCHOOLS ||--o{ ACADEMIC_YEARS : "has"
    SCHOOLS ||--o{ LEVELS : "has"
    SCHOOLS ||--o{ STUDENTS : "has"

    ACADEMIC_YEARS ||--o{ TERMS : "divided in"
    LEVELS ||--o{ SECTIONS : "has parallels"
    LEVELS ||--o{ SUBJECTS : "has"
    
    SECTIONS ||--o{ ENROLLMENTS : "has enrolled"
    STUDENTS ||--o{ ENROLLMENTS : "is enrolled"
    
    SECTIONS ||--o{ ATTENDANCES : "takes daily"
    STUDENTS ||--o{ ATTENDANCES : "marks"

    USERS ||--o{ COURSE_SUBJECT_TEACHERS : "teaches"
    SUBJECTS ||--o{ COURSE_SUBJECT_TEACHERS : "given as"
    SECTIONS ||--o{ COURSE_SUBJECT_TEACHERS : "taught in"
    
    USERS ||--o{ INCIDENTS : "reports"
    STUDENTS ||--o{ INCIDENTS : "commits"
    INCIDENT_TYPES ||--o{ INCIDENTS : "classified as"

    COURSE_SUBJECT_TEACHERS ||--o{ EVALUATION_ACTIVITIES : "plans"
    TERMS ||--o{ EVALUATION_ACTIVITIES : "belongs to"
    EVALUATION_ACTIVITIES ||--o{ GRADES : "receives"
    STUDENTS ||--o{ GRADES : "achieves"
```

## 2. Decisiones y Ajustes de Arquitectura (Sprint SaaS LATAM)

### 2.1 Módulo Empresa (Institucional y Tenancy)
La tabla `SCHOOLS` es la raíz absoluta. Al registrar una tabla de dominio, se le inyectará siempre su `school_id`, implementado a nivel ORM vía Global Scopes. No hay cruce de datos.

### 2.2 Reemplazo de Faltas/Compromisos a Incidentes Configurables (`INCIDENTS` & `INCIDENT_TYPES`)
Las faltas de disciplina y uniformes no están quemadas en la estructura de base de datos. Se manejan vía Catálogo de Tipos (`INCIDENT_TYPES`), permitiendo a cada `school_id` definir si quieren penalizar "Atrasos", "Falta de Uniforme" u otras normas exclusivas de la jurisdicción nacional de la escuela.

### 2.3 Registro Diario de Asistencia (`ATTENDANCES`)
Tabla optimizada para inserción masiva por `Section` (Paralelo). Registra un `status` para centralizar la métrica ("Total presentes vs Ausentes") con un recuento indexado según la `date`.

### 2.4 Evaluaciones y Dimensiones (Desacopladas)
Las actividades evaluativas (`EVALUATION_ACTIVITIES`) almacenan su `dimension` como un metadata flexible parametrizado por escuela (el Ser, Saber, Hacer se definirá dinámicamente) y controlan la puntuación límite mediante su columna `max_score`. Esto asegura que el mismo SaaS opere en Bolivia y en Ecuador simultáneamente sin modificar migraciones.
