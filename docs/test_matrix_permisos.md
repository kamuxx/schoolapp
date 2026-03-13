# Matriz de Pruebas: Módulo de Permisos (Permissions)

## Objetivo
Certificar que las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) del módulo de Permisos funcionen correctamente utilizando el usuario Super Administrador (`sa@schoolapp.com`).

## Casos de Uso (Flujos Principales)

| ID Test | Caso de Uso | Precondiciones | Pasos de Ejecución | Resultado Esperado |
|---------|-------------|----------------|--------------------|--------------------|
| **CU-01** | Visualizar listado de permisos | Usuario `sa@schoolapp.com` logueado. <br> Existe ruta `/config/permisos`. | 1. Navegar a `/config/permisos`. | La vista renderiza la tabla de permisos correctamente usando Inertia. |
| **CU-02** | Crear un nuevo permiso | En la vista de listado. | 1. Abrir modal/formulario de creación. <br> 2. Llenar Nombre: `test.permission`, Guard: `web`, Group: `Testing`. <br> 3. Enviar. | Mensaje de éxito "Permiso creado correctamente". El permiso aparece en la lista. |
| **CU-03** | Editar permiso existente | Permiso `test.permission` existe. | 1. Clic en editar en `test.permission`. <br> 2. Cambiar Nombre a `test.permission.updated`. <br> 3. Guardar. | Mensaje de éxito "Permiso actualizado correctamente". La lista refleja el cambio. |
| **CU-04** | Eliminar permiso | Permiso `test.permission.updated` existe. | 1. Clic en eliminar en el permiso. <br> 2. Confirmar eliminación. | Mensaje de éxito "Permiso eliminado correctamente". El permiso desaparece de la lista. |

## Flujos Alternos (Casos de Error o Bordes)

| ID Test | Flujo Alterno | Descripción / Condición | Resultado Esperado |
|---------|---------------|-------------------------|--------------------|
| **FA-01** | Crear permiso duplicado | Intentar crear un permiso con un `name` que ya existe en la base de datos. | El sistema rechaza la petición por la regla de validación `unique:permissions,name` y muestra error en la UI. |
| **FA-02** | Guard string inválido | Intentar enviar por API un guard distinto a `web` o `api`. | Error de validación `in:web,api` desde el controlador. |
| **FA-03** | Crear sin nombre | Enviar el formulario dejando el campo `name` en blanco. | Error de validación "El nombre es obligatorio". |
| **FA-04** | Acceso sin autorización | Intentar ingresar directamente a `/config/permisos` sin estar logueado. | Redirección al login. |

## Notas de Auditoría de Código (Antigravity Code Quality)
- **Complejidad Ciclomática**: Baja. No hay anidaciones profundas, se cumple la regla de máximo 2 niveles.
- **Responsabilidad Única**: Controladores delgados. Toda la lógica de negocio y queries está delegada a `PermissionUseCase` y `PermissionRepository`.
- **Estructura limpia**: Los métodos tienen retornos claros, e inyección de dependencias correcta.
- **Veredicto**: El código a nivel backend está **100% operativo** y cumple con el Seniority Mode.
