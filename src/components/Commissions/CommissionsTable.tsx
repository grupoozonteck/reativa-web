import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime } from '@/utils/client-utils';
import { cn } from '@/lib/utils';
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
            login: string;
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
                    <h2 className="font-display text-base font-semibold text-on-surface">Detalhes das Comissões</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    {showingFrom > 0 && !isLoading && (
                        <span className="bg-surface-container rounded-full px-2.5 py-0.5 text-xs text-on-surface-variant">
                            Exibindo {showingFrom}–{showingTo}
                        </span>
                    )}
                </div>
            </div>

            {/* Mobile: Cards View */}
            <div className="block md:hidden">
                {isLoading ? (
                    <div className="space-y-3 px-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="h-40 bg-surface-container animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-sm text-destructive">
                        Erro ao carregar comissões. Tente atualizar.
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8 text-sm text-on-surface-variant">
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
                            <TableRow className="border-none hover:bg-transparent bg-surface-highest/80 backdrop-blur-sm">
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                                    #ID
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                                    Cliente
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                                    Número do Pedido
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant text-right">
                                    Valor do Pedido
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant text-right">
                                    Comissão
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                                    Data
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <TableRow key={`skeleton-${index}`} className="border-none">
                                        <TableCell className="py-4 sm:py-5" colSpan={7}>
                                            <div className="h-4 w-full bg-surface-container animate-pulse rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : isError ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="text-center py-8 sm:py-10 text-sm text-destructive">
                                        Erro ao carregar comissões. Tente atualizar.
                                    </TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="text-center py-8 sm:py-10 text-sm text-on-surface-variant">
                                        Nenhuma comissão encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item: CommissionItem, index: number) => (
                                    <TableRow
                                        key={item.id ?? item.order_id ?? index}
                                        className="border-none even:bg-surface-container/30 hover:bg-surface-high/50 transition-colors"
                                    >
                                        <TableCell className="font-mono text-xs sm:text-sm text-on-surface-variant">
                                            {item.id ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            <p className="text-on-surface font-medium">{item.personal_order?.user?.name ?? 'NA'}</p>
                                            <p className="text-on-surface-variant text-xs">
                                                ({item.personal_order?.user?.login ?? 'NA'})
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-on-surface-variant">
                                            {item.order_id ?? 'NA'}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-xs sm:text-sm text-secondary">
                                            {formatCurrency(item.personal_order?.value ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-semibold text-xs sm:text-sm text-primary [text-shadow:0_0_8px_hsl(83_98%_64%_/_0.4)]">
                                            {formatCurrency(item.value ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-on-surface-variant">
                                            {item.created_at ? formatDateTime(item.created_at) : 'NA'}
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
