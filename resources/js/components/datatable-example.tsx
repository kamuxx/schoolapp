// Ejemplo de uso del componente DataTable con AppToolbar y AppPagination
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './datatable'

// Datos de ejemplo
const sampleData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Editor' },
]

// Definición de columnas
const columns: ColumnDef<typeof sampleData[0]>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue('id')}</div>
        },
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return (
                <div className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {role}
                </div>
            )
        },
    },
]

// Datos de paginación de ejemplo (simulados)
const paginationData = {
    links: [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '?page=1', label: '1', active: true },
        { url: '?page=2', label: '2', active: false },
        { url: '?page=3', label: '3', active: false },
        { url: '?page=2', label: 'Next &raquo;', active: false },
    ],
    meta: {
        current_page: 1,
        last_page: 3,
        from: 1,
        to: 10,
        total: 25,
    },
}

// Botones de ejemplo
const buttons = [
    {
        label: 'Nuevo',
        icon: <span>➕</span>,
        variant: 'outline',
        onClick: () => console.log('Nuevo usuario'),
    },
    {
        label: 'Actualizar',
        icon: <span>🔄</span>,
        variant: 'outline',
        onClick: () => console.log('Actualizar lista'),
    },
]

export function DataTableExample() {
    return (
        <DataTable
            columns={columns}
            data={sampleData}
            toolbar={{
                paginate: true,
                limit: 10,
                search: true,
                onLimitChange: (limit) => console.log('Límite cambiado:', limit),
                onSearch: (term) => console.log('Buscar:', term),
                buttons,
            }}
            pagination={paginationData}
        />
    )
}
