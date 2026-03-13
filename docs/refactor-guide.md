# Guía de Refactorización de Módulos - SchoolApp

## Visión General

Esta guía establece el estándar de refactorización para todos los módulos del sistema SchoolApp, basado en la estructura optimizada del componente `config/roles/index.tsx`.

## Estándar de Referencia

El módulo `config/roles/index.tsx` sirve como plantilla con las siguientes características:

### 🏗️ Arquitectura Base
- **Componente funcional** con hooks de React
- **TypeScript** tipado completo
- **Inertia.js** para navegación SPA
- **TailwindCSS** + **shadcn/ui** para estilos
- **DataTable** reutilizable para listados
- **Gestión de estado** con hooks personalizados

### 📋 Estructura del Componente

```typescript
// 1. Imports organizados
import { Head } from '@inertiajs/react';
import { router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
// ... otros imports

// 2. Interfaces y tipos
interface Entity {
  id: number;
  name: string;
  // ... propiedades específicas
}

type ResponseList = {
  data: Entity[];
  recordsFiltered: number;
  recordsTotal: number;
  current_page?: number;
  per_page?: number;
};

interface Props {
  entities: ResponseList;
  // ... otras props
}

// 3. Constantes y configuración
const breadcrumbs: BreadcrumbItem[] = [...];

// 4. Componente principal
export default function ModuleName({ entities }: Props) {
  // Estados
  const [selected, setSelected] = useState<Entity | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  // ... otros estados

  // Hook personalizado para datos
  const {
    data: entitiesState,
    setData: setEntitiesState,
    loading,
    fetch,
    changePage,
    changeLimit,
  } = useCustomHook(entities.data);

  // Formulario con Inertia
  const {
    data,
    setData,
    post,
    patch,
    delete: destroy,
    processing,
    errors,
    reset,
    clearErrors,
  } = useForm({
    // ... campos del formulario
  });

  // Efectos y lógica
  useEffect(() => {
    // ... lógica de inicialización
  }, []);

  // Handlers de eventos
  const handleNew = () => { /* ... */ };
  const handleEdit = () => { /* ... */ };
  const handleDelete = () => { /* ... */ };
  const handleSave = () => { /* ... */ };

  // Definición de columnas para DataTable
  const columns: ColumnDef<Entity>[] = [
    // ... definición de columnas
  ];

  // Render del componente
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Título del Módulo" />
      
      <div className="space-y-4 p-4">
        {/* DataTable con toolbar y paginación */}
        <DataTable
          columns={columns}
          data={entitiesState}
          loading={loading}
          onRowClick={setSelected}
          selectedRow={selected}
          getRowId={(row) => row.id.toString()}
          toolbar={{
            paginate: true,
            limit: limitPage,
            search: true,
            onLimitChange: setLimitPage,
            onSearch: setSearchTerm,
            buttons: toolButtons,
          }}
          pagination={{
            totalRecords: entities.recordsTotal,
            currentPage: currentPage,
            perPage: limitPage,
            onPageChange: handlePageChange,
          }}
        />

        {/* Modales */}
        <Dialog open={openModal} /* ... */>
          {/* Contenido del modal */}
        </Dialog>
      </div>
    </AppLayout>
  );
}
```

## 🎯 Plan de Refactorización por Módulos

### Módulos Configuración (HIGH PRIORITY)

#### 1. ✅ config/roles/index.tsx - COMPLETADO
- **Estado**: Referencia estándar
- **Características**: DataTable, CRUD completo, gestión de permisos

#### 2. 🔄 config/users/index.tsx
- **Estado**: Parcialmente refactorizado
- **Acciones**:
  - Migrar a DataTable estándar
  - Implementar hook `useUsers`
  - Optimizar gestión de roles y permisos
  - Añadir búsqueda con debounce

#### 3. 🔄 config/permissions/index.tsx
- **Estado**: Por refactorizar
- **Acciones**:
  - Adoptar estructura estándar
  - Crear hook `usePermissions`
  - Implementar DataTable
  - Migrar sistema de modales

#### 4. 🔄 config/anios-escolares/index.tsx
- **Estado**: Por refactorizar
- **Acciones**:
  - Refactorizar a estructura estándar
  - Crear hook `useAniosEscolares`
  - Implementar validación de fechas

#### 5. 🔄 config/escuelas/index.tsx
- **Estado**: Por refactorizar
- **Acciones**:
  - Migrar a DataTable
  - Crear hook `useEscuelas`
  - Optimizar gestión de datos geográficos

### Módulos Institucional (MEDIUM PRIORITY)

#### 6. 🔄 institucional/materias/index.tsx
- **Acciones**:
  - Refactorizar a estructura estándar
  - Implementar `useMaterias`
  - Añadir gestión de niveles y grados

#### 7. 🔄 institucional/niveles/index.tsx
- **Acciones**:
  - Adoptar DataTable estándar
  - Crear `useNiveles`
  - Implementar jerarquía de niveles

#### 8. 🔄 institucional/perfil/index.tsx
- **Acciones**:
  - Optimizar para perfil institucional
  - Implementar carga de archivos
  - Añadir validaciones específicas

### Módulos Filiación (MEDIUM PRIORITY)

#### 9. 🔄 filiacion/estudiantes/index.tsx
- **Acciones**:
  - Refactorizar a estructura estándar
  - Implementar `useEstudiantes`
  - Añadir búsqueda avanzada
  - Optimizar para grandes volúmenes de datos

#### 10. 🔄 filiacion/docentes/index.tsx
- **Acciones**:
  - Migrar a DataTable
  - Crear `useDocentes`
  - Implementar gestión de especialidades

### Módulos Gestión Escolar (MEDIUM PRIORITY)

#### 11. 🔄 gestion-escolar/incidencias/index.tsx
- **Acciones**:
  - Refactorizar a estructura estándar
  - Implementar `useIncidencias`
  - Añadir filtros por tipo y estado
  - Optimizar para reportes

#### 12. 🔄 gestion-escolar/notas/index.tsx
- **Acciones**:
  - Adoptar estructura estándar
  - Implementar `useNotas`
  - Añadir gestión de períodos académicos

### Módulos Operativa (LOW PRIORITY)

#### 13. 🔄 operativa/asistencia/index.tsx
- **Acciones**:
  - Refactorizar a estructura estándar
  - Implementar `useAsistencia`
  - Añadir calendario integrado
  - Optimizar para registro masivo

### Módulos Settings (LOW PRIORITY)

#### 14. 🔄 settings/profile.tsx
- **Acciones**:
  - Optimizar formulario de perfil
  - Implementar carga de avatar
  - Añadir validación de datos

#### 15. 🔄 settings/password.tsx
- **Acciones**:
  - Mejorar validación de contraseñas
  - Añadir indicador de fortaleza

#### 16. 🔄 settings/permissions.tsx
- **Acciones**:
  - Integrar con sistema de permisos
  - Añadir vista previa de permisos

#### 17. 🔄 settings/appearance.tsx
- **Acciones**:
  - Implementar tema dinámico
  - Añadir personalización

### Módulos Auth (MAINTENANCE)

#### 18. ✅ auth/login.tsx - OPTIMIZADO
#### 19. ✅ auth/register.tsx - OPTIMIZADO
#### 20. 🔄 auth/forgot-password.tsx
#### 21. 🔄 auth/reset-password.tsx
#### 22. 🔄 auth/verify-email.tsx
#### 23. 🔄 auth/two-factor-challenge.tsx
#### 24. 🔄 auth/confirm-password.tsx

### Páginas Especiales

#### 25. 🔄 dashboard.tsx
- **Acciones**:
  - Implementar widgets reutilizables
  - Añadir gráficos y métricas
  - Optimizar carga de datos

#### 26. 🔄 welcome.tsx
- **Acciones**:
  - Optimizar para onboarding
  - Añadir guía interactiva

## 🛠️ Herramientas y Componentes Reutilizables

### Hooks Personalizados a Crear

```typescript
// hooks/use-users.ts
export function useUsers(initialData: User[] = []) {
  // Implementación estándar
}

// hooks/use-estudiantes.ts
export function useEstudiantes(initialData: Estudiante[] = []) {
  // Implementación específica para estudiantes
}

// hooks/use-materias.ts
export function useMaterias(initialData: Materia[] = []) {
  // Implementación específica para materias
}
```

### Componentes Específicos

```typescript
// components/entity-form.tsx
interface EntityFormProps<T> {
  entity?: T;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  // ... otras props
}

// components/entity-view.tsx
interface EntityViewProps<T> {
  entity: T;
  onClose: () => void;
}

// components/bulk-actions.tsx
interface BulkActionsProps<T> {
  selectedItems: T[];
  actions: ActionConfig[];
}
```

## 📋 Checklist de Refactorización

### Para cada módulo:

- [ ] **Estructura Base**
  - [ ] Migrar a componente funcional
  - [ ] Añadir tipado TypeScript completo
  - [ ] Implementar DataTable estándar
  - [ ] Crear hook personalizado

- [ ] **Funcionalidad CRUD**
  - [ ] Implementar modal de creación
  - [ ] Implementar modal de edición
  - [ ] Implementar modal de visualización
  - [ ] Implementar modal de eliminación
  - [ ] Añadir validación de formularios

- [ ] **Experiencia de Usuario**
  - [ ] Añadir loading states
  - [ ] Implementar manejo de errores
  - [ ] Añadir toast notifications
  - [ ] Implementar búsqueda con debounce
  - [ ] Optimizar para responsive design

- [ ] **Performance**
  - [ ] Optimizar renders con useCallback/useMemo
  - [ ] Implementar paginación eficiente
  - [ ] Añadir lazy loading si es necesario
  - [ ] Optimizar tamaño de bundle

## 🚀 Estrategia de Implementación

### Fase 1: Configuración (Semanas 1-2)
1. users/index.tsx
2. permissions/index.tsx
3. anios-escolares/index.tsx
4. escuelas/index.tsx

### Fase 2: Institucional (Semanas 3-4)
1. materias/index.tsx
2. niveles/index.tsx
3. perfil/index.tsx

### Fase 3: Filiación (Semanas 5-6)
1. estudiantes/index.tsx
2. docentes/index.tsx

### Fase 4: Gestión Escolar (Semanas 7-8)
1. incidencias/index.tsx
2. notas/index.tsx

### Fase 5: Operativa y Settings (Semanas 9-10)
1. asistencia/index.tsx
2. Módulos settings
3. dashboard.tsx

## 📊 Métricas de Éxito

### Indicadores de Calidad
- **Cobertura de tipos**: 100% TypeScript
- **Componentes reutilizables**: >80%
- **Performance**: <100ms tiempo de respuesta
- **Accesibilidad**: WCAG 2.1 AA
- **Testing**: Cobertura >90%

### Indicadores de UX
- **Tiempo de carga**: <2s
- **Errores de formulario**: <5%
- **Tasa de conversión**: >95%
- **Satisfacción del usuario**: >4.5/5

## 🔧 Herramientas de Desarrollo

### Dependencias Clave
```json
{
  "@tanstack/react-table": "^8.0.0",
  "@inertiajs/react": "^1.0.0",
  "lucide-react": "^0.263.1",
  "sonner": "^1.0.0",
  "tailwindcss": "^3.3.0"
}
```

### Scripts de Desarrollo
```bash
# Verificar tipos
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Build
npm run build
```

## 📝 Notas de Mantenimiento

1. **Versionamiento**: Cada módulo refactorizado debe incrementar la versión menor
2. **Documentación**: Actualizar README.md del módulo
3. **Testing**: Añadir tests unitarios para cada componente
4. **Changelog**: Registrar cambios en CHANGELOG.md
5. **Backup**: Crear backup antes de cada refactorización

## 🎯 Conclusión

Esta guía establece un estándar claro y consistente para la refactorización de todos los módulos del sistema SchoolApp. Siguiendo este enfoque, garantizaremos:

- **Consistencia** en todo el códigobase
- **Mantenibilidad** a largo plazo
- **Performance** optimizada
- **Experiencia de usuario** superior
- **Calidad** del código enterprise-grade

La implementación gradual por fases permite minimizar riesgos y asegurar una transición sin interrupciones del servicio.
