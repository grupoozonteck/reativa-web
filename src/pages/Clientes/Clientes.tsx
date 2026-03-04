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
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Loader2,
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
import { getInitials, getAvatarColor } from '@/lib/client-utils';
import { customerService, type ReengagementUser } from '@/services/customer.service';
import { useDebounce } from '@/hooks/useDebounce';

type FilterStatus = 'todos' | 'sem_pedidos' | 'com_pedidos' | 'com_pagos';

function buildParams(page: number, search: string, status: FilterStatus) {
    const params: Record<string, number | string> = { page };
    if (search) params.search = search;
    if (status === 'sem_pedidos') params.without_orders = 1;
    if (status === 'com_pedidos') params.has_orders = 1;
    if (status === 'com_pagos') params.has_paid_orders = 1;
    return params;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <TableRow className="border-border">
            <TableCell className="py-3">
                <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-44 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-3.5 w-6 rounded bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-3.5 w-6 rounded bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-right">
                <div className="h-7 w-36 rounded-lg bg-muted animate-pulse ml-auto" />
            </TableCell>
        </TableRow>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Clientes() {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
    const [page, setPage] = useState(1);

    // Debounce só no search — filtros de status respondem imediatamente
    const debouncedSearch = useDebounce(search, 400);

    const params = buildParams(page, debouncedSearch, filterStatus);

    const { data, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['reengagements', params],
        queryFn: () => customerService.getReengagements(params),
        placeholderData: keepPreviousData, // mantém dados anteriores enquanto carrega nova página
        select: (res) => res.data.users,
    });

    const clients = data?.data ?? [];
    const totalItems = data?.total ?? data?.to ?? 0;
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

    // Reset para página 1 ao trocar filtros
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
        <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Reativação de Clientes
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Gerencie seus clientes inativos para reativação
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/meus-atendimentos')}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-2"
                >
                    <Headphones className="w-4 h-4" />
                    Meus atendimentos
                </Button>
            </div>

            {/* Filtros */}
            <div className="solid-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Filtros</span>
                    {hasActiveFilters && (
                        <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                            ativo
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, email ou WhatsApp..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-9 h-9 text-sm"
                            disabled={loading}
                        />
                    </div>

                    <div className="w-px h-6 bg-border hidden sm:block" />

                    {/* Switch filters */}
                    {filterOptions.map(opt => (
                        <label
                            key={opt.key}
                            className={cn(
                                'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer select-none',
                                filterStatus === opt.key
                                    ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400'
                                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground',
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

                    <div className="flex-1" />

                    <Button
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-1.5 h-9 text-xs"
                    >
                        <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                        {isFetching ? 'Carregando...' : 'Atualizar'}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={loading || !hasActiveFilters}
                        className="gap-1.5 h-9 text-xs"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpar filtros
                    </Button>
                </div>
            </div>

            {/* Tabela */}
            <div className="solid-card overflow-hidden animate-fade-in">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Clientes</h2>
                        <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                            {loading ? '...' : (totalItems > 0 ? `${totalItems} total` : clients.length)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        {isFetching && !isLoading && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Buscando...
                            </div>
                        )}
                        {showingFrom > 0 && !loading && (
                            <span className="text-xs text-muted-foreground">
                                Exibindo {showingFrom}–{showingTo}
                            </span>
                        )}
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[80px]">ID</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Cliente</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[100px]">Pedidos</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[100px]">Pagos</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right w-[180px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-muted-foreground/30" />
                                        <p className="text-muted-foreground text-sm">
                                            Nenhum cliente encontrado
                                            {hasActiveFilters && ' com os filtros aplicados'}
                                        </p>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
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

                {/* Paginação */}
                {(prevPageUrl || nextPageUrl) && !loading && (
                    <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Página {currentPage}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={!prevPageUrl || isFetching}
                                className="h-8 w-8 p-0 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={!nextPageUrl || isFetching}
                                className="h-8 w-8 p-0 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Client Row ──────────────────────────────────────────────────────────────
function ClientRow({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors">
            <TableCell className="py-3">
                <span className="text-xs text-muted-foreground font-mono">#{client.id}</span>
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    {client.personal_data?.avatar ? (
                        <img
                            src={client.personal_data.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                            colorClass
                        )}>
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{client.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.email}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 text-center">
                <span className="text-sm font-medium">{client.total_orders}</span>
            </TableCell>
            <TableCell className="py-3 text-center">
                <span className={cn(
                    'text-sm font-medium',
                    client.paid_orders > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                )}>
                    {client.paid_orders}
                </span>
            </TableCell>
            <TableCell className="py-3 text-right">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${client.id}`)}
                    className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
                >
                    <MessageCircle className="w-3 h-3" />
                    Iniciar atendimento
                </Button>
            </TableCell>
        </TableRow>
    );
}
