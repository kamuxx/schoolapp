# Propuesta Estratégica y Cronograma (MVP B2B)

**Fecha:** 21 de Febrero de 2026
**Mercado Objetivo:** Bolivia
**Meta:** Lanzamiento MVP para la gestión académica, asistencia y reportería ministerial bajo la normativa evaluativa de Bolivia.

---

## 1. Plan de Entrega Detallado (4 Semanas)

El proyecto se segmentará en un plan de acción estricto para certificar cada módulo en producción:

### ⚙️ Semana 1: Arquitectura y Módulo Institucional 
*   **Módulo Empresa:** Configuración del Perfil Escolar (Nombre, Ubicación, tipo de Nivel Educativo y Carga de Logotipo Institucional).
*   **Base de Datos y Seguridad:** Generación del esquema Multi-tenant, Módulo de Usuarios, control de Roles y Permisos.
*   **Malla Curricular Base:** Creación de Niveles o Grados, habilitación oficial de "Paralelos" (Secciones A, B, etc.) y alta del banco de Materias.

### 👥 Semana 2: Filiación y Módulo Académico Operativo
*   **Módulo Filiativo Estelar:**
    *   Inscripción (Filiación) de Estudiantes ligándolos directamente a su Paralelo.
    *   Registro de Docentes.
    *   Asignación de Cargas Horarias: Vincular al Docente exclusivamente con su Nivel, Paralelo y Materias permitidas.
*   **Módulo Académico (Evaluaciones):**
    *   Generación de planillas de Carga de Notas, asegurando los topes estipulados de Bolivia: **Ser (10), Saber (45), Hacer (40) y Autoevaluación (5).**

### 📊 Semana 3: Asistencias y Dashboards Estratégicos
*   **Asistencia Cotidiana:** Sistema de "1 Clic" para que el docente (o secretaría) marque la asistencia diaria de la sección/paralelo según la lista de filiados.
*   **Dashboard Institucional (Vista Admin/Director):**
    *   Panel en tiempo real: Total de registrados, Totales de Presentes en el Día y Ausentes de la escuela.
    *   **Cuadro de Honor Dinámico:** Sistema que computa en vivo al "Mejor Estudiante" de cada Paralelo y al "Genio de Oro" del nivel completo.
*   **Centralizador Trimestral:** Tabla de Múltiple Entrada (Materias / Estudiantes) que resume las calificaciones definitivas del período en curso.

### 🚀 Semana 4: Certificación, Pruebas y Reporte Ministerial
*   Auditoría de Cálculos: Pruebas unitarias para validar las sumatorias dimensionales. 
*   **Módulo Certificado:** Preparación, formato y exportación de Boletines individuales que plasmen las notas el estudiante para consumo de padres, e Integración o maquetación sugerida para el posterior uso en el formato del Ministerio de Educación.

---

## 2. Inversión y Lanzamiento

### 💰 Fase Core de Implementación (MVP Core): $150 USD
*   *Incluye:* Arquitectura B2B programada específicamente para soportar el flujo de notas en Bolivia, auditoría algorítmica y primer despliegue en servidor de producción (Shared Hosting / CPanel Básico). Esta inversión fondea de forma temprana y exclusiva la primera arquitectura del código base.

### 📈 Modelo de Negocio (SaaS) y Sociedad
El verdadero valor del sistema reside en su rentabilidad como servicio escalable (Software as a Service). Proponemos un modelo formal de participación recurrente entre las partes basado en licencias institucionales:

*   **Tarifa MRR (Suscripción por Institución):** **$30 USD / mensuales**.
*   **Estructura Societaria y División en Tercios (33/33/33):** Para garantizar la salud financiera del proyecto y no afectar el bolsillo de los socios, los ingresos de cada suscripción se dividirán en tres partes iguales ($10 USD cada una):
    *   **1/3 (Costo Operativo - "La Máquina"):** Fondo intocable destinado automáticamente a cubrir renovaciones de infraestructura técnica inicial (Shared Hosting, MySQL en CPanel y Dominios). El sistema se paga total y absolutamente solo.
    *   **1/3 (Socio Tecnológico):** Utilidad neta para el Líder Arquitecto basado en Venezuela por el mantenimiento del código, prevención de caídas y mejoras de seguridad.
    *   **1/3 (Socio Comercial):** Utilidad neta para el enlace e inversor en Bolivia por la prospección, cierre de escuelas y atención al usuario final.
*   **Ajuste Inflacionario Anual:** Para asegurar un crecimiento sostenido que combata la inflación y sume rentabilidad al fondo societario, la tarifa de suscripción tendrá un incremento automático pactado de **$5 USD** en cada renovación anual por institución. 

> *Nota Estratégica: Al construir el sistema bajo arquitectura "Multi-tenant", el esfuerzo informático para anexar al segundo, quinto o décimo colegio es nulo. Se escala hacia un ingreso pasivo y masivo.*

---
**Firma de Conformidad:**

___________________________
**Socio Inversor / Ventas (Representante en Bolivia)**

___________________________
**Lester Rodriguez (Líder Arquitecto en Venezuela)**
