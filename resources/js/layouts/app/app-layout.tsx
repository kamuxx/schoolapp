import { Head } from '@inertiajs/inertia-react';
import type { ReactNode } from 'react';
import React from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    title = 'SchoolApp',
}) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Head title={title} />
            {/* Header */}
            <header className="flex items-center justify-between bg-white p-4 shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {title}
                </h1>
                {/* Aquí podrías añadir avatar, notificaciones, etc. */}
            </header>

            {/* Main content */}
            <main className="container mx-auto flex-1 p-6">{children}</main>

            {/* Footer */}
            <footer className="bg-white py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} SchoolApp – Todos los derechos
                reservados.
            </footer>
        </div>
    );
};

export default AppLayout;
