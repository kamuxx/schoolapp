import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Perfil({ profile }: { profile: any }) {
    const profileText = profile
        ? JSON.stringify(profile, null, 2)
        : 'Sin datos';
    const breadcrumbs = [
        { title: 'Institucional', href: '/institucional' },
        { title: 'Perfil Escolar', href: '/institucional/perfil' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil Escolar" />
            <div className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">Perfil Escolar</h2>
                <pre className="rounded border bg-white p-4 whitespace-pre-wrap">
                    {profileText}
                </pre>
            </div>
        </AppLayout>
    );
}
