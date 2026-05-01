import { useState } from 'react';
import { AlertCircle, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { teamService } from '@/services/team.service';
import { useAuth } from '@/contexts/useAuth';
import { RankingHeader } from '@/components/SupervisorRanking/RankingHeader';
import { RankingStats } from '@/components/SupervisorRanking/RankingStats';
import { RankingList } from '@/components/SupervisorRanking/RankingList';
import { formatCurrency } from '@/utils/client-utils';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import { getCurrentMonthDateRange } from '@/utils/date-range';

export default function SupervisorRanking() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate = searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);

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
    const hasActiveFilters = appliedStartDate !== defaultRange.startDate || appliedEndDate !== defaultRange.endDate;

    const handleApplyFilters = () => {
        setSearchParams((params) => {
            if (startDate && startDate !== defaultRange.startDate) params.set('start_date', startDate); else params.delete('start_date');
            if (endDate && endDate !== defaultRange.endDate) params.set('end_date', endDate); else params.delete('end_date');
            return params;
        }, { replace: true });
    };

    const clearFilters = () => {
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setSearchParams((params) => {
            params.delete('start_date');
            params.delete('end_date');
            return params;
        }, { replace: true });
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

            <DateRangeFilterCard
                title="Periodo"
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApplyFilters}
                onClear={clearFilters}
                isFetching={isFetching}
                hasActiveFilters={hasActiveFilters}
                hasDraftChanges={hasDraftChanges}
                applyLabel="Filtrar"
                startId="supervisor-ranking-start-date"
                endId="supervisor-ranking-end-date"
            />

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
