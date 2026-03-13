import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Page } from '@/types/page';
import { PayloadSearch } from '@/types/page';
import { AppToolbar } from './app-toolbar';
import { Skeleton } from './ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    onRowClick?: (row: TData) => void;
    selectedRow?: TData | null;
    getRowId?: (row: TData) => string;
    toolbar?: {
        paginate?: boolean;
        limit?: number;
        search?: boolean;
        onLimitChange?: (limit: number) => void;
        onSearch?: (term: string) => void;
        buttons?: any[];
    };
    pagination?: {
        totalRecords: number;
        currentPage: number;
        perPage: number;
        onPageChange: (page: Page) => void;
    };
}

// Componente interno de paginación
const InternalPagination = ({
    totalRecords,
    currentPage,
    perPage,
    onPageChange,
}: {
    totalRecords: number;
    currentPage: number;
    perPage: number;
    onPageChange: (page: Page) => void;
}) => {
    const lastPage = Math.ceil(totalRecords / perPage);
    const maxVisiblePages = 7;

    // Generar array de páginas visibles
    const getVisiblePages = () => {
        if (lastPage <= maxVisiblePages) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }

        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        const end = Math.min(lastPage, start + maxVisiblePages - 1);

        // Ajustar si estamos cerca del final
        if (end - start < maxVisiblePages - 1) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        const pages = [];
        if (start > 1) {
            pages.push(1, '...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < lastPage) {
            pages.push('...', lastPage);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= lastPage) {
            onPageChange({
                current_page: page,
                limit: perPage,
                offset: (page - 1) * perPage,
                last_page: lastPage,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-row">
            <div className="order-2 text-xs text-muted-foreground sm:order-1">
                Mostrando{' '}
                <span className="font-semibold">
                    {(currentPage - 1) * perPage + 1}
                </span>{' '}
                a{' '}
                <span className="font-semibold">
                    {Math.min(currentPage * perPage, totalRecords)}
                </span>{' '}
                de <span className="font-semibold">{totalRecords}</span>{' '}
                registros
            </div>

            <nav
                className="order-1 flex items-center space-x-1 sm:order-2"
                aria-label="Paginación"
            >
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-9 border-zinc-200 px-3 text-zinc-600 hover:bg-zinc-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                {visiblePages.map((page, index) => (
                    <Button
                        key={index}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="icon"
                        onClick={() =>
                            typeof page === 'number' && handlePageClick(page)
                        }
                        disabled={typeof page !== 'number'}
                        className={`h-9 w-9 ${
                            page === currentPage
                                ? 'bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800'
                                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="default"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="h-9 border-zinc-200 px-3 text-zinc-600 hover:bg-zinc-100"
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </nav>
        </div>
    );
};

export const DataTable = <TData, TValue>({
    columns,
    data,
    loading,
    onRowClick,
    selectedRow,
    getRowId,
    toolbar,
    pagination,
}: DataTableProps<TData, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {toolbar && (
                <AppToolbar
                    paginate={toolbar.paginate}
                    limit={toolbar.limit}
                    search={toolbar.search}
                    onLimitChange={toolbar.onLimitChange}
                    onSearch={toolbar.onSearch}
                    buttons={toolbar.buttons}
                />
            )}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Skeleton loading rows - Responsive para mobile
                            Array.from({ length: 5 }, (_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    {/* Skeleton para ID */}
                                    <TableCell className="p-2 md:p-4">
                                        <Skeleton className="h-4 w-8" />
                                    </TableCell>
                                    {/* Skeleton para Nombre */}
                                    <TableCell className="p-2 md:p-4">
                                        <Skeleton className="h-4 w-20 md:w-24" />
                                    </TableCell>
                                    {/* Skeleton para Short */}
                                    <TableCell className="p-2 md:p-4">
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    {/* Skeleton para Créditos */}
                                    <TableCell className="p-2 md:p-4">
                                        <Skeleton className="h-4 w-12" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isSelected =
                                    selectedRow && getRowId
                                        ? getRowId(row.original) ===
                                          getRowId(selectedRow)
                                        : selectedRow === row.original;

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'bg-blue-500/20 font-bold ring-1 ring-blue-400' : ''} `}
                                        onClick={() =>
                                            onRowClick &&
                                            onRowClick(row.original)
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <InternalPagination
                    totalRecords={pagination.totalRecords}
                    currentPage={pagination.currentPage}
                    perPage={pagination.perPage}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
};
