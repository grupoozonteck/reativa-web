import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/client-utils';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { CommissionCard } from './CommissionCard';

interface CommissionItem {
    id?: number;
    order_id?: number;
    attendant_name?: string;
    customer_name?: string;
    order_value?: number | string;
    value?: number | string;
    status?: string;
    created_at?: string;
    personal_order: {
        user: {
            name: string;
        };
        value: number | string;
    };
}

interface CommissionsTableProps {
    items: CommissionItem[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    showingFrom: number;
    showingTo: number;
    currentPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
}

export function CommissionsTable({
    items,
    isLoading,
    isFetching,
    isError,
    showingFrom,
    showingTo,
    currentPage,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
}: CommissionsTableProps) {
    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="px-3 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Detalhes das Comissões</h2>
                    <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                        {isLoading ? '...' : `${items.length}`}
                    </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs">
                    {isFetching && !isLoading && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Buscando...</span>
                        </div>
                    )}
                    {showingFrom > 0 && !isLoading && (
                        <span className="text-muted-foreground">
                            Exibindo {showingFrom}-{showingTo}
                        </span>
                    )}
                </div>
            </div>

            {/* Mobile: Cards View */}
            <div className="block md:hidden">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="h-48 bg-muted animate-pulse rounded" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-sm text-red-500">
                        Erro ao carregar comissões. Tente atualizar.
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        Nenhuma comissão encontrada.
                    </div>
                ) : (
                    <div className="space-y-3 px-3">
                        {items.map((item: CommissionItem, index: number) => (
                            <CommissionCard key={item.id ?? item.order_id ?? index} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block solid-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent bg-secondary/80 dark:bg-secondary/90 backdrop-blur-sm">
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Atendente
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Cliente
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Pedido
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                                    Valor
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                                    Comissão
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Status
                                </TableHead>
                                <TableHead className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Data
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-60')}>
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <TableRow key={`skeleton-${index}`}>
                                        <TableCell className="py-4 sm:py-5" colSpan={7}>
                                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 sm:py-10 text-sm text-red-500">
                                        Erro ao carregar comissões. Tente atualizar.
                                    </TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 sm:py-10 text-sm text-muted-foreground">
                                        Nenhuma comissão encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item: CommissionItem, index: number) => (
                                    <TableRow key={item.id ?? item.order_id ?? index}>
                                        <TableCell className="font-medium text-xs sm:text-sm">
                                            {item.attendant_name ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.personal_order?.user?.name ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.order_id ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-xs sm:text-sm">
                                            {formatCurrency(item.personal_order?.value ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                                            {formatCurrency(item.value ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.status ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.created_at ? formatDate(item.created_at) : 'NA'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {(hasPrevPage || hasNextPage) && !isLoading && (
                <div className="px-3 md:px-0">
                    <Pagination
                        page={currentPage}
                        hasPrev={hasPrevPage}
                        hasNext={hasNextPage}
                        onPrev={onPrevPage}
                        onNext={onNextPage}
                        isFetching={isFetching}
                    />
                </div>
            )}
        </div>
    );
}
