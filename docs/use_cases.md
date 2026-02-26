# Casos de Uso Core (MVP - Versión SaaS Multi-Tenant)

**Fase:** 1 (Gestión Académica Integral LATAM)

Este documento detalla las funciones del sistema por semana, asegurando que el MVP cubra desde la filiación hasta el Cuadro de Honor y Asistencia diaria aplicable a cualquier escuela.

---

## Actores del Sistema
1.  **Administrador (Dirección):** Gestiona la Institución, crea Secciones, inscribe alumnos (Filiación) y extrae Cuadros de Honor y Boletines.
2.  **Docente:** Registra asistencia diaria, incidentes, y carga notas basado en el esquema de evaluación parametrizado de su escuela.
3.  **Sistema:** Algoritmo que promedia notas, centraliza asistencias y calcula el Cuadro de Honor.

---

## Semana 1: Institución y Malla
*   **CU-1.1: Perfil de Empresa (Tenant):** El Super Admin registra la Escuela, sube su Logo y define su tipo (Trimestral/Semestral).
*   **CU-1.2: Base de Datos y Malla:** El Admin crea "Niveles/Grados" (Ej. 1er Año Medio), le asigna materias obligatorias y abre "Secciones" (Ej. 1er Año Medio Sección A, 1er Año Medio Sección B).

## Semana 2: Filiación y Carga Académica
*   **CU-2.1: Filiación de Estudiantes:** El Admin inscribe alumnos asignándolos a su **Sección específica** mediante su DNI/CI nacional.
*   **CU-2.2: Filiación y Carga Horaria (Docentes):** El Admin inscribe a los Docentes y dictamina "qué pueden hacer". Ej: *El Profesor Gómez dictará Matemáticas, pero solo interactuará con la Sección A.*
*   **CU-2.3: La Carga de Notas (Esquema Adaptable):** El Docente ingresa a su materia asignada y registra actividades. El sistema bloquea automáticamente cualquier nota que supere el máximo permitido por la dimensión configurada en la escuela.

## Semana 3: Operativa Diaria y Cuadro de Honor
*   **CU-3.1: Toma de Asistencia e Incidentes:** Diariamente, el Docente abre la lista de su Sección y registra "Presente" o "Ausente", y levanta reportes de disciplina si es necesario.
*   **CU-3.2: Analytics (Dashboard Institucional):** El Admin visualiza en su cuenta:
    *   Total de registrados en la Institución.
    *   Total Presentes de Hoy vs Ausentes (Métrica generada a partir del registro diario).
*   **CU-3.3: Motor del Cuadro de Honor:** El Sistema procesa automáticamente todos los promedios del periodo finalizado y rankea a los estudiantes generando un cuadro para Premiaciones donde estampa al:
    *   "Mejor Promedio de la Sección A"
    *   "Mejor Promedio Global del Nivel 1er Año"
*   **CU-3.4: Centralizador:** Tabla matriz cruzando todos los alumnos de una Sección vs Todas las Materias que cursan, arrojando su definitiva.

## Semana 4: Certificación
*   **CU-4.1: Boletines Finales:** Exportación de notas del estudiante formateadas para entregar a la jurisdicción educativa respectiva, conteniendo el logo de la Institución.
*   **CU-4.2: Pruebas y Simulacros:** Validar con usuarios reales que las restricciones Multi-Tenant funcionan y los docentes no pueden ver listas de otras secciones.
