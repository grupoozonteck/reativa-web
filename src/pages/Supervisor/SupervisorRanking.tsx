import { useRef, useState } from 'react';
import { AlertCircle, CalendarRange, Crown, Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { teamService } from '@/services/team.service';
import { useAuth } from '@/contexts/useAuth';
import { RankingHeader } from '@/components/SupervisorRanking/RankingHeader';
import { RankingStats } from '@/components/SupervisorRanking/RankingStats';
import { RankingList } from '@/components/SupervisorRanking/RankingList';
import { formatCurrency } from '@/utils/client-utils';
import { cn } from '@/lib/utils';

export default function SupervisorRanking() {
    const { user } = useAuth();
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const currentMonthStart = `${currentYear}-${currentMonth}-01`;
    const today = `${currentYear}-${currentMonth}-${currentDay}`;

    const [startDate, setStartDate] = useState(currentMonthStart);
    const [endDate, setEndDate] = useState(today);
    const [appliedStartDate, setAppliedStartDate] = useState(currentMonthStart);
    const [appliedEndDate, setAppliedEndDate] = useState(today);

    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ['supervisor-ranking', user?.id, appliedStartDate, appliedEndDate],
        queryFn: () => teamService.getSupervisorRanking({
            start_date: appliedStartDate || undefined,
            end_date: appliedEndDate || undefined,
        }),
        enabled: !!user?.id,
        staleTime: 60 * 1000,
        refetchInterval: 2 * 60 * 1000,
    });

    const supervisors = [...(data?.supervisors ?? [])].sort((a, b) => {
        const revenueDiff = Number(b.revenue ?? 0) - Number(a.revenue ?? 0);
        if (revenueDiff !== 0) return revenueDiff;

        const salesDiff = b.sales - a.sales;
        if (salesDiff !== 0) return salesDiff;

        return b.conversion - a.conversion;
    });

    const totalRevenue = supervisors.reduce((acc, supervisor) => acc + Number(supervisor.revenue ?? 0), 0);
    const totalSales = supervisors.reduce((acc, supervisor) => acc + supervisor.sales, 0);
    const totalReengagements = supervisors.reduce((acc, supervisor) => acc + supervisor.total_reengagements, 0);
    const bestConversion = supervisors.reduce((acc, supervisor) => Math.max(acc, supervisor.conversion), 0);
    const hasDraftChanges = startDate !== appliedStartDate || endDate !== appliedEndDate;
    const hasActiveFilters = appliedStartDate !== currentMonthStart || appliedEndDate !== today;

    const handleApplyFilters = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    const clearFilters = () => {
        setStartDate(currentMonthStart);
        setEndDate(today);
        setAppliedStartDate(currentMonthStart);
        setAppliedEndDate(today);
    };

    const openDatePicker = (input: HTMLInputElement | null) => {
        if (!input) return;
        input.focus();
        input.showPicker?.();
    };

    if (isError) {
        return (
            <div className="mx-auto max-w-screen-2xl p-6">
                <div className="solid-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-rose-400" />
                        <div>
                            <h2 className="text-base font-bold">Nao foi possivel carregar o ranking</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Verifique sua conexao com a API e tente novamente.
                            </p>
                            <Button type="button" onClick={() => refetch()} className="mt-4">
                                Tentar novamente
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-screen-2xl space-y-6 p-4 py-8 sm:p-6">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-16 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-[26rem] w-[26rem] rounded-full bg-sky-500/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            <RankingHeader isFetching={isFetching} onRefresh={refetch} />

            <div className="solid-card p-4 animate-fade-in">
                <div className="mb-3 flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Periodo</span>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleApplyFilters();
                    }}
                    className="space-y-3"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_180px_1fr]">
                        <Field>
                            <FieldLabel htmlFor="supervisor-ranking-start-date">Data inicial</FieldLabel>
                            <Input
                                ref={startDateRef}
                                id="supervisor-ranking-start-date"
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                onClick={() => openDatePicker(startDateRef.current)}
                                className="date-input-trigger h-9 border-none bg-muted/40 text-sm"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="supervisor-ranking-end-date">Data final</FieldLabel>
                            <Input
                                ref={endDateRef}
                                id="supervisor-ranking-end-date"
                                type="date"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                onClick={() => openDatePicker(endDateRef.current)}
                                className="date-input-trigger h-9 border-none bg-muted/40 text-sm"
                            />
                        </Field>

                        <div className="flex flex-col justify-end gap-2 md:flex-row">
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isFetching || !hasDraftChanges}
                                className="h-9 gap-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400"
                            >
                                <Search className="h-3.5 w-3.5" />
                                Filtrar
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="destructive"
                                onClick={clearFilters}
                                disabled={!hasActiveFilters && !hasDraftChanges}
                                className="h-9 gap-1.5"
                            >
                                <X className="h-3.5 w-3.5" />
                                Limpar filtros
                            </Button>
                        </div>
                    </div>

                    <p className={cn('text-xs text-muted-foreground', hasDraftChanges && 'text-amber-600 dark:text-amber-400')}>
                        {hasActiveFilters
                            ? `Consultando a API com start_date=${appliedStartDate} e end_date=${appliedEndDate}.`
                            : 'Usando o periodo padrao do mes atual.'}
                        {hasDraftChanges && ' Existem alteracoes pendentes para aplicar.'}
                    </p>
                </form>
            </div>

            <RankingStats
                isLoading={isLoading}
                supervisorsCount={supervisors.length}
                totalRevenue={totalRevenue}
                totalSales={totalSales}
                totalReengagements={totalReengagements}
                bestConversion={bestConversion}
            />

            {!isLoading && supervisors[0] && (
                <div className="solid-card overflow-hidden border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-background to-background">
                    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950">
                                <Crown className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                                    Lider do Ranking
                                </p>
                                <h2 className="text-xl font-black tracking-tight">{supervisors[0].user.name}</h2>
                                <p className="text-sm text-muted-foreground">@{supervisors[0].user.login}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Receita</p>
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(supervisors[0].revenue)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Vendas</p>
                                <p className="text-lg font-bold">{supervisors[0].sales}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Conversao</p>
                                <p className="text-lg font-bold">{supervisors[0].conversion}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <RankingList supervisors={supervisors} isLoading={isLoading} isFetching={isFetching} />
        </div>
    );
}
