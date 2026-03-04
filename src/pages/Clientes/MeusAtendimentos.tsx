import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    Search,
    Headphones,
    RefreshCcw,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    ExternalLink,
    Eye,
    Loader2,
    Target,
    Users,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    getInitials,
    getAvatarColor,
    formatWhatsApp,
    getWhatsAppLink,
    formatDate,
} from '@/lib/client-utils';
import {
    customerService,
    type PersonalReengagement,
} from '@/services/customer.service';

// ─── Status styling map ───────────────────────────────────────────────────────

const statusStyleMap: Record<number, { color: string; dotColor: string }> = {
    1: {
        color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
        dotColor: 'bg-blue-500',
    },
    2: {
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
        dotColor: 'bg-emerald-500',
    },
    3: {
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
        dotColor: 'bg-amber-500',
    },
    4: {
        color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
        dotColor: 'bg-rose-500',
    },
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <TableRow className="border-border">
            <TableCell className="py-3">
                <div className="h-3.5 w-10 rounded bg-muted animate-pulse" />
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-40 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-5 w-24 rounded-full bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-3.5 w-20 rounded bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-right">
                <div className="h-7 w-14 rounded-lg bg-muted animate-pulse ml-auto" />
            </TableCell>
        </TableRow>
    );
}

function SkeletonStat() {
    return (
        <div className="solid-card p-4 sm:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted animate-pulse shrink-0" />
            <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                <div className="h-6 w-14 rounded bg-muted animate-pulse" />
            </div>
        </div>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function MeusAtendimentos() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const effectiveEndDate = startDate && !endDate ? today : (endDate || undefined);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['personal-reengagements', page, search, startDate, effectiveEndDate, statusFilter],
        queryFn: () => customerService.getPersonalReengagements({
            page,
            search: search || undefined,
            start_date: startDate || undefined,
            end_date: effectiveEndDate,
            status: statusFilter ? Number(statusFilter) : undefined,
        }),
        placeholderData: keepPreviousData,
        select: (res) => res.data,
    });

    const allReengagements = data?.customerReengagement.data ?? [];
    const nextPageUrl = data?.customerReengagement.next_page_url ?? null;
    const prevPageUrl = data?.customerReengagement.prev_page_url ?? null;
    const currentPage = data?.customerReengagement.current_page ?? page;
    const showingFrom = data?.customerReengagement.from ?? 0;
    const showingTo = data?.customerReengagement.to ?? 0;
    const totalAttendances = data?.totalAttendances ?? 0;
    const totalReactivated = data?.totalReactivated ?? 0;
    const conversionRate = data?.conversionRate ?? 0;
    const statusRecollection = data?.statusRecollection ?? {};

    // Busca acontece no backend
    const filteredList = allReengagements;

    const handleNextPage = () => { if (nextPageUrl) setPage(p => p + 1); };
    const handlePrevPage = () => { if (prevPageUrl) setPage(p => Math.max(1, p - 1)); };
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // Volta para a primeira página ao buscar
    };
    const handleStartDate = (value: string) => {
        setStartDate(value);
        setPage(1);
    };
    const handleEndDate = (value: string) => {
        setEndDate(value);
        setPage(1);
    };
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };
    const clearFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('');
        setPage(1);
    };

    const statsCards = [
        { label: 'Meus Atendimentos', value: totalAttendances, icon: Headphones, color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-600' },
        { label: 'Reativados', value: totalReactivated, icon: RefreshCcw, color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-600' },
        { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-500' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Meus Atendimentos</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Clientes que estou atendendo neste mês
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/clientes')}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-2"
                >
                    <Target className="w-4 h-4" />
                    Lista Geral
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => <SkeletonStat key={idx} />)
                    : statsCards.map(card => (
                        <div
                            key={card.label}
                            className="solid-card p-4 sm:p-5 hover:scale-[1.01] transition-transform flex items-center gap-4"
                        >
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.iconBg)}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                    {card.label}
                                </p>
                                <p className={cn('text-2xl font-black tracking-tight tabular-nums', card.color)}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Search + refresh */}
            <div className="solid-card p-4 animate-fade-in">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, email ou WhatsApp..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                        {search && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={e => handleStartDate(e.target.value)}
                        className="h-9 w-[160px] text-xs"
                        aria-label="Data inicial"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={e => handleEndDate(e.target.value)}
                        className="h-9 w-[160px] text-xs"
                        aria-label="Data final"
                    />
                    <select
                        value={statusFilter}
                        onChange={e => handleStatusFilter(e.target.value)}
                        className="h-9 min-w-[180px] rounded-md border border-input bg-background px-3 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Filtrar por status"
                    >
                        <option value="">Todos os status</option>
                        {Object.entries(statusRecollection).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={clearFilters}
                        className="h-9 text-xs"
                        disabled={!search && !startDate && !endDate && !statusFilter}
                    >
                        Limpar filtros
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-1.5 h-9 text-xs"
                    >
                        <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                        {isFetching ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </div>
            </div>

            {/* Tabela */}
            <div className="solid-card overflow-hidden animate-fade-in">

                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Clientes em Atendimento</h2>
                        <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                            {isLoading ? '...' : filteredList.length}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        {isFetching && !isLoading && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Buscando...
                            </div>
                        )}
                        {showingFrom > 0 && !isLoading && (
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
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">WhatsApp</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[130px]">Status</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[100px]">Início</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right w-[80px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => <SkeletonRow key={idx} />)
                        ) : filteredList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-muted-foreground/30" />
                                        <p className="text-muted-foreground text-sm">
                                            {search ? 'Nenhum resultado para a pesquisa' : 'Nenhum atendimento encontrado'}
                                        </p>
                                        {search && (
                                            <button
                                                onClick={() => handleSearch('')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                            >
                                                Limpar pesquisa
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredList.map(r => <PersonalRow key={r.id} reengagement={r} statusRecollection={statusRecollection} />)
                        )}
                    </TableBody>
                </Table>

                {/* Paginação */}
                {(prevPageUrl || nextPageUrl) && !isLoading && (
                    <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Página {currentPage}</span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm" variant="outline"
                                onClick={handlePrevPage}
                                disabled={!prevPageUrl || isFetching}
                                className="h-8 w-8 p-0 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm" variant="outline"
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

// ─── Row ─────────────────────────────────────────────────────────────────────

function PersonalRow({ reengagement, statusRecollection }: { reengagement: PersonalReengagement; statusRecollection: Record<string, string> }) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors">
            <TableCell className="py-3">
                <span className="text-xs text-muted-foreground font-mono">#{user.id}</span>
            </TableCell>

            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                        colorClass
                    )}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
            </TableCell>

            <TableCell className="py-3">
                {user.phone_number ? (
                    <a
                        href={getWhatsAppLink(user.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group/wa"
                    >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm">{formatWhatsApp(user.phone_number)}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/wa:opacity-100 transition-opacity shrink-0" />
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">--</span>
                )}
            </TableCell>

            <TableCell className="py-3 text-center">
                <Badge className={cn('text-[10px] border gap-1.5 whitespace-nowrap', statusStyle.color)}>
                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                    {statusLabel}
                </Badge>
            </TableCell>

            <TableCell className="py-3 text-center">
                <span className="text-xs text-muted-foreground tabular-nums">
                    {formatDate(reengagement.created_at)}
                </span>
            </TableCell>

            <TableCell className="py-3 text-right">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${user.id}`)}
                    className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
                >
                    <Eye className="w-3 h-3" />
                    Ver
                </Button>
            </TableCell>
        </TableRow>
    );
}
