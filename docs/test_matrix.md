# Test Matrix (Matriz Algorítmica MVP Bolivia)

**Filosofía:** "Bug-Driven Development". El software debe validar milimétricamente la escala de calificaciones para evitar fraudes, sumas inconsistentes o rechazo del ministerio por fallos en los consolidados.

## 1. Unit Tests (Pruebas Unitarias - El Motor: `GradeCalculationService`)

| ID | Regla a Auditar | Descripción y Actuación del Test | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :---: |
| UT-01 | **Tope de Actividades (Ser)** | Intentar registrar la **5ta actividad evaluativa** bajo la dimensión "Ser". | `ValidationException` o Regla de Dominio rota antes de persistir en Base de Datos. | 🔥 Crítica |
| UT-02 | **Límite Escalar (Saber)** | Proveer un puntaje de **46** o un `string` para una actividad del ítem "Saber". | Intercepción (Http 422) previniendo inyección de notas ilegales en el trimestre. | 🔥 Crítica |
| UT-03 | **Cálculo de Promedios Internos** | Proveer 2 notas perfectas de "Hacer" al sistema (40 y 40 pts). | El Sistema lo suma (80) y lo promedia entre 2. Respuesta = 40 puntos limpios. | 🔥 Crítica |
| UT-04 | **Saturación en Tope Fijo (100 pts)** | Suministrar 10 pts (Ser) + 45 pts (Saber) + 40 pts (Hacer) + 5 pts (Auto). | Acumulado Definitivo para el alumno debe arrojar: **100 pts** exactos sin excedentes por decimal. | 🔥 Crítica |

## 2. Integration Tests (Pruebas de Integración - Arquitectura)
| ID | Regla a Auditar | Descripción y Actuación del Test | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :---: |
| IT-01 | **Malla de Alta Densidad** | Forzar la asignación de **14 asignaturas** al pensum de estudios de '1ro Secundaria'. | Restricción disparada (El bloque se detiene con error de límite: 13 permitidas). | Alta |
| IT-02 | **Reporte Centralizador** | Apuntar al Endpoint `/api/reports/centralizer/curso/{id}` para generación de documento. | Colección consolidada `[alumnos[] => notas[13 cols]]` extraída en menos de 2s, ignorando alumnos sin matrícula en dicho lapso (Febrero-Noviembre). | 🔥 Crítica |

## 3. End-to-End Tests (Pruebas de Interfaz - Frontend React)
| ID | Regla a Auditar | Descripción y Actuación del Test | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :---: |
| E2E-01 | **Casilla de Carga Docente** | Teclear un "6" deliberadamente en el casillero de la Columna `Autoevaluación`. | Columna titilando en rojo. Componente React bloquea la emisión de la petición POST del maestro. | Alta |
| E2E-02 | **Navegación Intramestral** | Intentar hacer *click* para crear un "4to Trimestre" en la interfáz de "Calendario Base". | Render sin la opción presente o Select box estático congelado en `Q1-Q2-Q3`. | Media |
