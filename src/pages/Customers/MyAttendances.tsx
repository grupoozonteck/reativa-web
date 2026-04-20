import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    Headphones,
    RefreshCcw,
    TrendingUp,
    Target,
    Users,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { SkeletonRow } from '@/components/Customers/SkeletonRow';
import { SkeletonStat } from '@/components/Customers/SkeletonStat';
import { PersonalRow } from '@/components/Customers/PersonalRow';
import { PersonalCard } from '@/components/Customers/PersonalCard';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { customerService } from '@/services/customer.service';


export default function MeusAtendimentos() {
    const navigate = useNavigate();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const currentMonthStart = `${currentYear}-${currentMonth}-01`;
    const today = `${currentYear}-${currentMonth}-${currentDay}`;

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(currentMonthStart);
    const [endDate, setEndDate] = useState(today);
    const [statusFilter, setStatusFilter] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState(currentMonthStart);
    const [appliedEndDate, setAppliedEndDate] = useState(today);
    const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
    const effectiveEndDate = appliedStartDate && !appliedEndDate ? today : (appliedEndDate || undefined);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['personal-reengagements', page, appliedSearch, appliedStartDate, effectiveEndDate, appliedStatusFilter],
        queryFn: () => customerService.getPersonalReengagements({
            page,
            search: appliedSearch || undefined,
            start_date: appliedStartDate || undefined,
            end_date: effectiveEndDate,
            status: appliedStatusFilter ? Number(appliedStatusFilter) : undefined,
        }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: true,
        refetchInterval: 5 * 60 * 1000, 
        select: (res) => res.data,
    });
    
    const allReengagements = data?.customer_reengagement.data ?? [];
    const nextPageUrl = data?.customer_reengagement.next_page_url ?? null;
    const prevPageUrl = data?.customer_reengagement.prev_page_url ?? null;
    const currentPage = data?.customer_reengagement.current_page ?? page;
    const showingFrom = data?.customer_reengagement.from ?? 0;
    const showingTo = data?.customer_reengagement.to ?? 0;
    const totalAttendances = data?.total_attendances ?? 0;
    const totalReactivated = data?.total_reactivated ?? 0;
    const conversionRate = data?.conversion_rate ?? 0;
    const statusRecollection = data?.status_recollection ?? {};

    const filteredList = allReengagements;

    const handleNextPage = () => { if (nextPageUrl) setPage(p => p + 1); };
    const handlePrevPage = () => { if (prevPageUrl) setPage(p => Math.max(1, p - 1)); };
    const handleApplyFilters = () => {
        setAppliedSearch(search);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setAppliedStatusFilter(statusFilter);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch('');
        setStartDate(currentMonthStart);
        setEndDate(today);
        setStatusFilter('');
        setAppliedSearch('');
        setAppliedStartDate(currentMonthStart);
        setAppliedEndDate(today);
        setAppliedStatusFilter('');
        setPage(1);
    };

    const isDefaultPeriod = startDate === currentMonthStart && endDate === today;
    const hasActiveFilters = appliedSearch !== '' || appliedStartDate !== currentMonthStart || appliedEndDate !== today || appliedStatusFilter !== '';
    const hasDraftChanges = search !== appliedSearch
        || startDate !== appliedStartDate
        || endDate !== appliedEndDate
        || statusFilter !== appliedStatusFilter;

    const statsCards = [
        { label: 'Meus Atendimentos (no período)', value: totalAttendances, icon: Headphones, color: 'text-secondary', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
        { label: 'Reativados (no período)', value: totalReactivated, icon: RefreshCcw, color: 'text-primary [text-shadow:0_0_10px_hsl(83_98%_64%_/_0.35)]', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
        { label: 'Taxa de Conversão (no período)', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-accent', iconBg: 'bg-accent/10', iconColor: 'text-accent' },
    ];

    return (
        <div className="p-4 py-8 sm:p-12 space-y-5 max-w-screen-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in flex-col sm:flex-row gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="bg-secondary/10 rounded-lg p-1.5">
                            <Headphones className="w-5 h-5 text-secondary" />
                        </div>
                        <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">Meus Atendimentos</h1>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-0.5 hidden sm:block ml-0.5">
                        Clientes que estou atendendo no período selecionado
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/customers')}
                    className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-2 font-semibold"
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
                            className="solid-card p-4 sm:p-5 flex items-center gap-4"
                        >
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.iconBg)}>
                                <card.icon className={cn('w-5 h-5', card.iconColor)} />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                                    {card.label}
                                </p>
                                <p className={cn('font-display text-2xl font-black tracking-tight tabular-nums', card.color)}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Filtros */}
            <div className="solid-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-display text-sm font-semibold text-on-surface">Filtros</span>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleApplyFilters();
                    }}
                    className="space-y-3"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.5fr)_160px_160px_220px]">
                        <Field>
                            <FieldLabel htmlFor="meus-atendimentos-search">Buscar</FieldLabel>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                                <Input
                                    id="meus-atendimentos-search"
                                    placeholder="Pesquisar por nome, email ou WhatsApp..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="meus-atendimentos-start-date">Data inicial</FieldLabel>
                            <Input
                                id="meus-atendimentos-start-date"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="meus-atendimentos-end-date">Data final</FieldLabel>
                            <Input
                                id="meus-atendimentos-end-date"
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="meus-atendimentos-status">Status</FieldLabel>
                            <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                                <SelectTrigger id="meus-atendimentos-status" className="h-9 text-sm w-full bg-surface-highest border-none focus:ring-0">
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    {Object.entries(statusRecollection).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="text-xs text-on-surface-variant">
                            {hasActiveFilters ? 'Filtros aplicados na listagem atual.' : 'Nenhum filtro aplicado no momento.'}
                            {hasDraftChanges && ' Existem alterações pendentes para aplicar.'}
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isFetching || !hasDraftChanges}
                                className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 h-9 text-xs font-semibold w-full md:w-auto"
                            >
                                <Search className="w-3.5 h-3.5" />
                                Filtrar
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 h-9 text-xs font-semibold w-full md:w-auto"
                            >
                                <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                                {isFetching ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={clearFilters}
                                className="h-9 text-xs w-full md:w-auto gap-1.5 text-on-surface-variant hover:text-primary disabled:opacity-40"
                                disabled={!search && isDefaultPeriod && !statusFilter && !hasActiveFilters}
                            >
                                <X className="w-3.5 h-3.5" />
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tabela */}
            <div className="solid-card overflow-hidden animate-fade-in">
                {/* Header Info */}
                <div className="px-5 py-4 bg-surface-highest/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-on-surface-variant" />
                        <h2 className="font-display text-sm font-semibold text-on-surface">Clientes em Atendimento</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {showingFrom > 0 && !isLoading && (
                            <span className="bg-surface-container rounded-full px-2.5 py-0.5 text-xs text-on-surface-variant">
                                Exibindo {showingFrom}–{showingTo}
                            </span>
                        )}
                    </div>
                </div>

                {/* Desktop - Tabela */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent bg-surface-highest/80 backdrop-blur-sm">
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant w-[8%] px-3">ID</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant px-3">Cliente</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant w-[18%] px-3">WhatsApp</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-center w-[18%] px-3">Status</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-center w-[15%] px-3">Início</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant text-center w-[12%] px-3">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] overflow-x-auto">
                        <Table>
                            <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, idx) => <SkeletonRow key={idx} />)
                                ) : filteredList.length === 0 ? (
                                    <TableRow className="border-none">
                                        <TableCell colSpan={6} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-8 h-8 text-on-surface-variant/30" />
                                                <p className="text-on-surface-variant text-sm">
                                                    {appliedSearch ? 'Nenhum resultado para a pesquisa' : 'Nenhum atendimento encontrado'}
                                                </p>
                                                {appliedSearch && (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
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
                    </div>
                </div>

                {/* Mobile - Cards */}
                <div className="md:hidden">
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="arena-card p-4 space-y-3">
                                    <div className="h-12 w-12 rounded-xl bg-surface-container animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-surface-container animate-pulse rounded-md" />
                                        <div className="h-3 w-32 bg-surface-container animate-pulse rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : filteredList.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="flex flex-col items-center gap-2">
                                    <Users className="w-8 h-8 text-on-surface-variant/30" />
                                    <p className="text-on-surface-variant text-sm">
                                        {appliedSearch ? 'Nenhum resultado para a pesquisa' : 'Nenhum atendimento encontrado'}
                                    </p>
                                    {appliedSearch && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
                                        >
                                            Limpar pesquisa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={cn('space-y-3 transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                {filteredList.map(r => (
                                    <PersonalCard key={r.id} reengagement={r} statusRecollection={statusRecollection} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Paginação */}
                {(prevPageUrl || nextPageUrl) && !isLoading && (
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
