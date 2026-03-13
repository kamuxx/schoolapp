# Guía: Vinculación de Usuarios, Roles y Permisos en Filament

Esta guía documenta el proceso lógico para conectar los recursos ya existentes (`Permisos`, `Roles` y `Usuarios`) dentro del marco de Filament y Spatie Permission, estableciendo una arquitectura de acceso segura.

---

## 1. Vincular el Módulo de Roles y Permisos

**💡 Analogía (Modo Semi-Senior):**
Imagina los *Roles* como los puestos de trabajo en un restaurante (Ej: Chef, Cajero) y los *Permisos* como las llaves que abren diferentes puertas (Ej: Llave de la cocina, Llave de la caja). En este paso, le entregamos al "puesto de trabajo" su llavero oficial, y no a las personas individualmente.

**Implementación Técnica Estándar (Flujo Lógico):**
1. **Verificar Modelo y DB:** Asegurar que el resource `RoleResource` interacciona correctamente con la tabla de roles correspondiente y que el modelo `Role` (de Spatie) está importado.
2. **Asignación en Formulario (Filament):**
   - Dentro del método `form()` de `RoleResource`, se ubica el componente que permite elegir múltiples opciones.
   - El objetivo lógico es llamar a la relación `permissions` predefinida en el modelo base de Spatie usando un campo tipo `CheckboxList` o `Select`.
   - Se asegura que Filament llame internamente al método `sync()` para guardar la información pivot.
3. **Visibilidad en Vista de Tabla:**
   - En el `table()` del mismo recurso, se muestran los permisos adosados en un campo de solo lectura (`TextColumn`) como *badges* o etiquetas, permitiendo al administrador auditar qué puede hacer ese Rol de un vistazo.

---

## 2. Vincular el Módulo de Usuarios con Roles

**💡 Analogía (Modo Semi-Senior):**
Ahora que los "puestos de trabajo" tienen sus llaves correspondientes, debemos asignar estos puestos a nuestros empleados (los *Usuarios*). Si Juan obtiene el puesto de "Cajero", automáticamente hereda el acceso de la llave de la caja sin que tengamos que dársela directamente.

**Implementación Técnica Estándar (Flujo Lógico):**
1. **Preparación del Modelo Base:**
   - El modelo principal `User` (generalmente en `app/Models/User.php`) debe implementar el *trait* de interconexión con Spatie llamado `HasRoles`. Este es el enlace principal para la base de datos.
2. **Asignación en Formulario (Filament):**
   - Dentro del método `form()` de `UserResource`, se implementa un campo de relación múltiple (`Select` con `multiple()`).
   - El formulario debe apuntar a la relación mágica `roles` (habilitada por el trait anterior), y traer en caché los nombres de rol (`preload()`).
3. **Visibilidad en Vista de Tabla:**
   - Al igual que en los roles, el `table()` de `UserResource` debe enlistar textualmente (`TextColumn`) qué roles tiene cada usuario. Esto valida operativamente el flujo completo.

---

> ⚠️ **Atención - Norma de Arquitectura:** 
> Mantener este flujo unidireccional (Permisos \u2192 Roles \u2192 Usuarios) fomenta el principio de Responsabilidad Única (SOLID) y simplifica los tests de auditoría. Evitaremos la asignación de permisos directos a usuarios individuales, a menos que el negocio defina una excepción irrepetible.
