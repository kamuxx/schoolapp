# Product Requirements Document (PRD v3.0 - SaaS LATAM Multi-Tenant)
**Proyecto:** SaaS Gestión Académica (MVP)
**Fecha:** 21 de Febrero de 2026

## 1. Resumen Ejecutivo (El Problema y la Solución)
El sector educativo en Latinoamérica requiere una digitalización rápida pero flexible que respete las particularidades y terminologías de cada país (Grados/Niveles, Secciones/Paralelos, Trimestres/Bimestres y Sistemas de Evaluación). Esta plataforma SaaS Multi-Tenant centraliza y estandariza la carga operativa de las unidades educativas, yendo más allá de las calificaciones, para incluir el control de asistencia diario, reportes de disciplina (incidentes), cuadro de honor, y filiación del personal bajo una estructura de entregas progresivas en 4 semanas.

## 2. Alcance del Proyecto (Scope)

### ✅ Dentro del Alcance (Funcionalidades MVP)
1. **Módulo SaaS (Tenancy):** Gestión base de Escuelas (Tenants). Aislamiento absoluto de datos por `school_id`.
2. **Módulo Institucional:** Perfil de la Escuela (Nombre, Logo, País, Sistema Académico -Trimestral/Semestral-).
3. **Módulo Seguridad:** Creación de Usuarios, Roles Activos (Super Admin, Admin, Director, Secretaria, Coordinador, Docente) y Políticas de Acceso.
4. **Módulo Académico Base (La Malla):** Niveles/Grados, Materias y Soporte para **Secciones/Paralelos** (Unidad atómica de agrupación de alumnos).
5. **Módulo Filiativo:**
   - Filiación de Estudiantes (con identificadores nacionales genéricos y códigos internos).
   - Filiación de Docentes.
   - Asignación de Nivel y Carga Horaria (Materias permitidas) para el Docente mediante relaciones exactas (`CourseSubjectTeacher`).
6. **Módulo de Ejecución Académica:**
   - **Asistencia e Incidentes:** Toma de asistencia diaria (Presente/Ausente/Atraso) por Sección y registro de incidentes/faltas disciplinarias configurables por escuela.
   - **Evaluaciones:** Carga de notas basada en actividades ligadas a los periodos académicos de cada país (Ej: Dimensiones bolivianas, quimestres ecuatorianos, etc.).
7. **Módulo de Analítica y Reportes (Dashboard):**
   - Panel Principal con Total Estudiantes: Registrados, Presentes Totales del Día, Ausentes.
   - Cuadro de Honor: Mejores promedios individuales por Sección y por Nivel.
   - Centralizador: Tabla cruzada de materias y estudiantes para un curso específico.
8. **Documentos de Cierre:** Generación de Boletines individuales preparados para impresión y/o formato exigido por la jurisdicción respectiva.

## 3. Historias de Usuario Principales

* **Epic 1: Configuración Core (Semana 1)**
  * *Como Super Admin*, quiero registrar una nueva escuela cliente (Tenant) para habilitarle acceso al SaaS.
  * *Como Admin de Escuela*, quiero configurar la malla académica creando Niveles (Grados) y asignándoles Secciones (Paralelos A, B) y Materias.

* **Epic 2: La Filiación y Permisos (Semana 2)**
  * *Como Secretaria*, quiero inscribir alumnos bajo una Sección específica, registrando su DNI/CI/RUT.
  * *Como Admin*, quiero registrar al Docente Carlos y asignarle que solo puede dar Matemáticas en la "Sección A" de "1ro de Secundaria".

* **Epic 3: El Día a Día (Semana 2 y 3)**
  * *Como Docente*, quiero entrar al sistema cada mañana, ver la lista de mi "Sección A" y marcar asistencia y reportar incidentes configurables (ej. uniforme).
  * *Como Director*, quiero abrir mi Dashboard y ver estadísticas globales de la escuela sobre asistencia.
  * *Como Docente*, quiero registrar las calificaciones de mis tareas evaluativas respetando el límite máximo de puntaje definido institucionalmente.

* **Epic 4: Cuadros y Cierre (Semana 3 y 4)**
  * *Como Coordinador*, al cierre del periodo, quiero emitir el Cuadro de Honor para premiar a los mejores promedios.
  * *Como Secretaria / Director*, quiero exportar los Boletines de notas listos para entregar a los representantes o al Ministerio nacional.

## 4. Reglas de Negocio Estrictas
1. **La Estructura de Salón (La Sección):** En el modelo de negocio, un alumno no se inscribe solo a "1ro Básico", se inscribe a un "Nivel + Sección" (Ej: 1ro Básico, Sección A). Esa es la unidad atómica de aislamiento para el llenado de notas y listas.
2. **Evaluaciones Flexibles pero Validadas:** Toda actividad evaluativa debe reportar a una dimensión/tipo que el sistema valida contra un máximo de puntos parametrizado por la propia escuela. La nota del alumno jamás excederá este máximo.
3. **Tenant Absoluto:** Ninguna entidad ligada a la operatividad de una escuela será consultada o alterada sin cruzar el alcance de su `school_id`.
4. **Privacidad de Carga (Docentes):** El Docente solo tendrá en lista a los estudiantes de su Materia dictada en una Sección específica. Acceso denegado a cualquier otra sección.
