import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    Search,
    Filter,
    X,
    Headphones,
    RefreshCcw,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { customerService } from '@/services/customer.service';
import { useDebounce } from '@/hooks/useDebounce';
import { ClientRow } from '@/components/Clientes/ClientRow';
import { ClientCard } from '@/components/Clientes/ClientCard';
import { SkeletonRow } from '@/components/Clientes/SkeletonRow';
import { Pagination } from '@/components/ui/pagination';

type FilterStatus = 'todos' | 'sem_pedidos' | 'com_pedidos' | 'com_pagos';

function buildParams(page: number, search: string, status: FilterStatus) {
    const params: Record<string, number | string> = { page };
    if (search) params.login = search;
    if (status === 'sem_pedidos') params.without_orders = 1;
    if (status === 'com_pedidos') params.has_orders = 1;
    if (status === 'com_pagos') params.has_paid_orders = 1;
    return params;
}


// ─── Main ────────────────────────────────────────────────────────────────────
export default function Clientes() {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(search, 400);

    const params = buildParams(page, debouncedSearch, filterStatus);

    const { data, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['reengagements', params],
        queryFn: () => customerService.getReengagements(params),
        placeholderData: keepPreviousData,
        select: (res) => res.data.users,
    });

    const clients = data?.data ?? [];
    const currentPage = data?.current_page ?? page;
    const nextPageUrl = data?.next_page_url ?? null;
    const prevPageUrl = data?.prev_page_url ?? null;
    const showingFrom = data?.from ?? 0;
    const showingTo = data?.to ?? 0;

    

    const loading = isLoading;
    const hasActiveFilters = search !== '' || filterStatus !== 'todos';

    const handleClearFilters = () => {
        setSearch('');
        setFilterStatus('todos');
        setPage(1);
    };

    const handleNextPage = () => {
        if (nextPageUrl) {
            const url = new URL(nextPageUrl, window.location.origin);
            setPage(Number(url.searchParams.get('page')));
        }
    };

    const handlePrevPage = () => {
        if (prevPageUrl) {
            const url = new URL(prevPageUrl, window.location.origin);
            setPage(Number(url.searchParams.get('page')));
        }
    };

    const handleStatusToggle = (key: FilterStatus) => {
        setFilterStatus(prev => prev === key ? 'todos' : key);
        setPage(1);
    };

    const filterOptions: { key: FilterStatus; label: string }[] = [
        { key: 'sem_pedidos', label: 'Sem pedidos' },
        { key: 'com_pedidos', label: 'Com Pedidos' },
        { key: 'com_pagos', label: 'Com Pedidos Pagos' },
    ];

    return (
        <div className="p-4 py-8 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in flex-col sm:flex-row gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="bg-primary/10 rounded-lg p-1.5">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">
                            Reativação de Clientes
                        </h1>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-0.5 hidden sm:block ml-0.5">
                        Gerencie seus clientes inativos para reativação
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/meus-atendimentos')}
                    className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-2 font-semibold"
                >
                    <Headphones className="w-4 h-4" />
                    Meus atendimentos
                </Button>
            </div>

            {/* Filtros */}
            <div className="solid-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-display text-sm font-semibold text-on-surface">Filtros</span>
                    {hasActiveFilters && (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                            ativo
                        </Badge>
                    )}
                </div>

                <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3">
                    {/* Search */}
                    <div className="relative w-full md:flex-1 md:min-w-[200px] md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input
                            placeholder="Pesquisar por nome, email ou WhatsApp..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                            disabled={loading}
                        />
                    </div>

                    {/* Switch filters */}
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {filterOptions.map(opt => (
                            <label
                                key={opt.key}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
                                    filterStatus === opt.key
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-high hover:text-on-surface',
                                    isFetching && 'opacity-60 pointer-events-none'
                                )}
                            >
                                <Switch
                                    checked={filterStatus === opt.key}
                                    onCheckedChange={() => handleStatusToggle(opt.key)}
                                    disabled={isFetching}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>

                    <div className="hidden md:block md:flex-1" />

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Button
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 h-9 text-xs font-semibold w-full md:w-auto"
                        >
                            <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                            {isFetching ? 'Carregando...' : 'Atualizar'}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleClearFilters}
                            disabled={loading || !hasActiveFilters}
                            className="gap-1.5 h-9 text-xs w-full md:w-auto text-on-surface-variant hover:text-primary disabled:opacity-40"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="solid-card overflow-hidden animate-fade-in">
                <div className="px-5 py-4 bg-surface-highest/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-on-surface-variant" />
                        <h2 className="font-display text-sm font-semibold text-on-surface">Clientes</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {showingFrom > 0 && !loading && (
                            <span className="bg-surface-container rounded-full px-2.5 py-0.5 text-xs text-on-surface-variant">
                                Exibindo {showingFrom}–{showingTo}
                            </span>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden">
                    {/* Vista Desktop - Tabela */}
                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent bg-surface-highest/80 backdrop-blur-sm">
                                        <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant w-[15%] px-4">ID</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant px-4">Cliente</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-center w-[12%] px-4">Pedidos</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-center w-[12%] px-4">Pagos</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-right w-[20%] px-4">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </div>
                        <div className="overflow-y-auto max-h-[600px] overflow-x-auto">
                            <Table>
                                <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                    {loading ? (
                                        Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                                    ) : clients.length === 0 ? (
                                        <TableRow className="border-none">
                                            <TableCell colSpan={5} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="w-8 h-8 text-on-surface-variant/30" />
                                                    <p className="text-on-surface-variant text-sm">
                                                        Nenhum cliente encontrado
                                                        {hasActiveFilters && ' com os filtros aplicados'}
                                                    </p>
                                                    {hasActiveFilters && (
                                                        <button
                                                            onClick={handleClearFilters}
                                                            className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
                                                        >
                                                            Limpar filtros
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.map(client => (
                                            <ClientRow key={client.id} client={client} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Vista Mobile - Cards */}
                    <div className="md:hidden">
                        <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="arena-card p-4 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-surface-container animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 bg-surface-container animate-pulse rounded-md" />
                                            <div className="h-3 w-32 bg-surface-container animate-pulse rounded-md" />
                                        </div>
                                    </div>
                                ))
                            ) : clients.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-on-surface-variant/30" />
                                        <p className="text-on-surface-variant text-sm">
                                            Nenhum cliente encontrado
                                            {hasActiveFilters && ' com os filtros aplicados'}
                                        </p>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
                                            >
                                                Limpar filtros
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className={cn('space-y-3 transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                    {clients.map(client => (
                                        <ClientCard key={client.id} client={client} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Paginação */}
                {(prevPageUrl || nextPageUrl) && !loading && (
                    <Pagination
                        page={currentPage}
                        hasPrev={!!prevPageUrl}
                        hasNext={!!nextPageUrl}
                        onPrev={handlePrevPage}
                        onNext={handleNextPage}
                        isFetching={isFetching}
                    />
                )}
            </div>
        </div>
    );
}

