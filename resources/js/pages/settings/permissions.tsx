import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { index } from '@/routes/permissions';
import type { BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    group?: string | null;
    school_id?: number | null;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: index() },
    { title: 'Permisos', href: index() },
];

export default function Permissions({ permissions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permisos" />

            <h1 className="sr-only">Permisos</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Gestión de Permisos"
                        description="Lista de permisos registrados en el sistema"
                    />

                    <div className="overflow-hidden rounded-lg border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Guard
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Grupo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {permissions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No hay permisos registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    permissions.map((perm) => (
                                        <tr
                                            key={perm.id}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {perm.name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {perm.guard_name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {perm.group ?? '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
