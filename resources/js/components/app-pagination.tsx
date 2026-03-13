import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

export function AppPagination({ links, meta }: PaginationProps) {
    if (links.length <= 3) return null; // No mostrar si solo hay una página

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
            <div className="text-xs text-muted-foreground order-2 sm:order-1">
                {meta && (
                    <span>
                        Mostrando <span className="font-semibold">{meta.from}</span> a{' '}
                        <span className="font-semibold">{meta.to}</span> de{' '}
                        <span className="font-semibold">{meta.total}</span> registros
                    </span>
                )}
            </div>
            
            <nav className="flex items-center space-x-1 order-1 sm:order-2" aria-label="Paginación">
                {links.map((link, index) => {
                    // Limpiar etiquetas de Laravel ( &laquo; Anterior , Siguiente &raquo; )
                    const label = link.label
                        .replace('&laquo; Previous', 'Anterior')
                        .replace('Next &raquo;', 'Siguiente')
                        .replace('&laquo;', 'Anterior')
                        .replace('&raquo;', 'Siguiente')
                        .trim();

                    const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                    // Si es un link nulo y no es Previous/Next, mostrar ellipsis
                    if (link.url === null && !isPrevious && !isNext) {
                        return (
                            <div key={index} className="px-3 py-2 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </div>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size={isPrevious || isNext ? 'default' : 'icon'}
                            asChild={link.url !== null}
                            disabled={link.url === null}
                            className={`h-9 ${isPrevious || isNext ? 'px-3' : 'w-9'} ${
                                link.active 
                                    ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm transition-all' 
                                    : 'hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                            }`}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    only={['permissions']} // Solo recargar datos de permisos
                                    className="flex items-center justify-center gap-1"
                                >
                                    {isPrevious && <ChevronLeft className="h-4 w-4" />}
                                    {isPrevious ? 'Anterior' : isNext ? 'Siguiente' : label}
                                    {isNext && <ChevronRight className="h-4 w-4" />}
                                </Link>
                            ) : (
                                <span className="flex items-center justify-center gap-1 opacity-50 cursor-not-allowed">
                                    {isPrevious && <ChevronLeft className="h-4 w-4" />}
                                    {isPrevious ? 'Anterior' : isNext ? 'Siguiente' : label}
                                    {isNext && <ChevronRight className="h-4 w-4" />}
                                </span>
                            )}
                        </Button>
                    );
                })}
            </nav>
        </div>
    );
}
