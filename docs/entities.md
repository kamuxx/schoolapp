# Entidades del Sistema (Domain Model)

**Proyecto:** SaaS Gestión Académica (LATAM Multi-Tenant)
**Arquitectura:** Clean Architecture Adaptada (Monolito)

Este documento define el núcleo del dominio (Las Entidades Reales). Representan la estructura de datos agnóstica a un país específico, asegurando que el modelo sea escalable, cubra los requerimientos transversales de LATAM (Secciones/Paralelos, Periodos y Dimensiones evaluables) y soporte la tenencia múltiple (Multi-Tenant).

---

## 1. Módulo Institucional & Seguridad

### Entidad: `School` (Tenant)
Representa a la Unidad Educativa (La "Empresa" del cliente). Base del aislamiento de datos.
*   `id`: Integer
*   `name`: String
*   `slug`: String (Identificador único para subdominios)
*   `country`: String
*   `academic_system`: Enum (`trimestral`, `semestral`, `bimestral`)
*   `logo_url`: String (Nullable)
*   `is_active`: Boolean

### Entidad: `User`
Personas con acceso digital real al sistema.
*   `id`: Integer
*   `school_id`: Integer (Nullable solo para SuperAdmin)
*   `first_name`: String
*   `last_name`: String
*   `email`: String (Unique per school)
*   `password_hash`: String
*   `role`: Enum (`super_admin`, `admin`, `director`, `secretaria`, `coordinador`, `docente`, `estudiante`, `representante`)
*   `is_active`: Boolean

---

## 2. Módulo Académico Base (La Malla)

### Entidad: `AcademicYear`
Periodo lectivo anual (Gestión/Ciclo).
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `name`: String (Ej: "2026", "2026-2027")
*   `start_date`: Date
*   `end_date`: Date
*   `is_active`: Boolean

### Entidad: `Term`
Fragmentación del año (Trimestres, Quimestres, Semestres).
*   `id`: Integer
*   `academic_year_id`: Integer (Ref: AcademicYear)
*   `name`: String (Ej: "1er Trimestre", "Q1")
*   `start_date`: Date
*   `end_date`: Date

### Entidad: `Level`
El Grado académico general (1ro Básica, 3ro Medios).
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `academic_year_id`: Integer (Ref: AcademicYear)
*   `name`: String

### Entidad: `Section` (El Paralelo / Sala / Grupo)
**Entidad Crítica Escalar:** Agrupación divisoria real de los alumnos dentro de un Nivel.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `level_id`: Integer (Ref: Level)
*   `name`: String (Ej: "A", "Grupo 1")
*   `primary_advisor_id`: Integer (Ref: User - Nullable)
*   `secondary_advisor_id`: Integer (Ref: User - Nullable)

### Entidad: `Subject`
Materia base que se imparte en la institución.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `level_id`: Integer (Ref: Level)
*   `name`: String (Ej: "Matemáticas", "Física")
*   `short_name`: String

---

## 3. Módulo Filiativo y Seguridad de Carga

### Entidad: `Student`
Registro del alumno. Agregado universal independiente del ciclo lectivo.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `first_name`: String
*   `last_name`: String
*   `birth_date`: Date
*   `national_id_type`: String (CI, DNI, RUT, PEP)
*   `national_id_number`: String
*   `student_code`: String (Código nativo del país, ej: RUDE en Bolivia)
*   `guardian_name`: String
*   `guardian_phone`: String
*   `guardian_relationship`: String

### Entidad: `Enrollment` (Inscripción)
**Entidad Pivot Crítica:** Relaciona al estudiante con la Gestión y su Sección especifica.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `student_id`: Integer (Ref: Student)
*   `section_id`: Integer (Ref: Section)
*   `academic_year_id`: Integer (Ref: AcademicYear)
*   `status`: Enum (`active`, `transferred`, `dropped`)

### Entidad: `CourseSubjectTeacher` (Carga Horaria)
**Entidad Pivot Crítica:** Delimita el "Candado de Seguridad". Otorga permisos transaccionales a un Docente.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `teacher_id`: Integer (Ref: User)
*   `subject_id`: Integer (Ref: Subject)
*   `section_id`: Integer (Ref: Section)
*   *Lógica:* "Prof. Carlos dicta Matemáticas únicamente en la Sección A".

---

## 4. Módulo Académico Operativo (El Día a Día)

### Entidad: `IncidentType` (Catálogo de Faltas/Observaciones)
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `name`: String (Ej: "Uniforme", "Atraso", "Agresión")
*   `severity_level`: Integer

### Entidad: `Incident` (Reporte Disciplinario o Falta)
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `student_id`: Integer (Ref: Student)
*   `incident_type_id`: Integer (Ref: IncidentType)
*   `reported_by_id`: Integer (Ref: User)
*   `incident_date`: Date
*   `observation`: Text
*   `attachment_path`: String (PDF/FOTO)
*   `requires_commitment`: Boolean

### Entidad: `Attendance`
Registro diario consolidado de presencia física.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `section_id`: Integer (Ref: Section)
*   `student_id`: Integer (Ref: Student)
*   `date`: Date
*   `status`: Enum (`present`, `absent`, `late`)
*   `recorded_by_id`: Integer (Ref: User)

### Entidad: `EvaluationActivity` (Planilla Evaluativa)
La actividad evaluativa en sí misma.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `course_subject_teacher_id`: Integer (Ref: CourseSubjectTeacher)
*   `term_id`: Integer (Ref: Term)
*   `dimension`: String (Comportamiento paramétrico de la propia escuela)
*   `description`: String
*   `max_score`: Decimal (El tope lo define la dimensión de la escuela)

### Entidad: `Grade`
La nota individual obtenida por un `Student` en una `EvaluationActivity`.
*   `id`: Integer
*   `school_id`: Integer (Ref: School)
*   `evaluation_activity_id`: Integer (Ref: EvaluationActivity)
*   `student_id`: Integer (Ref: Student)
*   `score`: Decimal
*   `graded_at`: DateTime
