import { Head, Link } from '@inertiajs/react';
import { PlusIcon, SearchIcon, Building2Icon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { AppToolbar } from '@/components/app-toolbar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface School {
    id: number;
    name: string;
    city: string;
    province: string;
    phone: string;
    email: string;
    is_active: boolean;
}

interface Props {
    schools: {
        data: School[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Institucional', href: '#' },
    { title: 'Planteles', href: '/institucional/planteles' },
];

export default function SchoolsIndex({ schools, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/institucional/planteles', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planteles" />
            
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Building2Icon className="w-6 h-6 text-blue-600" />
                            Gestión de Planteles
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administra todas las sedes y unidades educativas registradas.
                        </p>
                    </div>
                    
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <Link href="/institucional/planteles/nuevo">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nuevo Plantel
                        </Link>
                    </Button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <form onSubmit={handleSearch} className="relative max-w-sm">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar plantel por nombre o ciudad..."
                                className="pl-10 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-blue-500"
                            />
                        </form>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50">
                                <TableHead className="w-12">ID</TableHead>
                                <TableHead>Nombre del Plantel</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No se encontraron planteles registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                schools.data.map((school) => (
                                    <TableRow key={school.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <TableCell className="font-mono text-xs text-zinc-400">{school.id}</TableCell>
                                        <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {school.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs space-y-1">
                                                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {school.city}, {school.province}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs space-y-1">
                                                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                                                    <PhoneIcon className="w-3 h-3" />
                                                    {school.phone}
                                                </span>
                                                <span className="flex items-center gap-1 text-zinc-500 italic">
                                                    <MailIcon className="w-3 h-3" />
                                                    {school.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                school.is_active 
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                                {school.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                                                Gestionar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
