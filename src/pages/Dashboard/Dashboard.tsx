import { useState } from 'react';
import {
    UserX,
    DollarSign,
    TrendingUp,
    Users,
    Award,
    RefreshCcw,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import TopSellersCard from '@/components/dashboard/TopSellersCard';
import InativosCard from '@/components/dashboard/InativosCard';
import RecentSalesCard from '@/components/dashboard/RecentSalesCard';
import { dashboardService } from '@/services/dashboard.service';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import {
    getCurrentMonthDateRange,
    getPreviousMonthEquivalentRange,
} from '@/utils/date-range';

const REVENUE_GOAL = 150000;

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const name = user?.name ?? 'Usuario';
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate =
        searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);
    const previousRange = getPreviousMonthEquivalentRange(
        appliedStartDate,
        appliedEndDate,
    );

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['dashboard', user?.id, appliedStartDate, appliedEndDate],
        queryFn: () =>
            dashboardService.getDashboard({
                start_date: appliedStartDate || undefined,
                end_date: appliedEndDate || undefined,
            }),
        enabled: !!user?.id,
        refetchInterval: 5 * 60 * 1000,
    });

    const { data: previousPeriodData } = useQuery({
        queryKey: [
            'dashboard-previous-period',
            user?.id,
            previousRange.startDate,
            previousRange.endDate,
        ],
        queryFn: () =>
            dashboardService.getDashboard({
                start_date: previousRange.startDate,
                end_date: previousRange.endDate,
            }),
        enabled: !!user?.id,
        refetchInterval: 5 * 60 * 1000,
    });

    const hasActiveFilters =
        appliedStartDate !== defaultRange.startDate ||
        appliedEndDate !== defaultRange.endDate;
    const hasDraftChanges =
        startDate !== appliedStartDate || endDate !== appliedEndDate;

    const handleApplyFilters = () => {
        setSearchParams(
            (params) => {
                if (startDate && startDate !== defaultRange.startDate)
                    params.set('start_date', startDate);
                else params.delete('start_date');
                if (endDate && endDate !== defaultRange.endDate)
                    params.set('end_date', endDate);
                else params.delete('end_date');
                return params;
            },
            { replace: true },
        );
    };

    const handleClearFilters = () => {
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setSearchParams(
            (params) => {
                params.delete('start_date');
                params.delete('end_date');
                return params;
            },
            { replace: true },
        );
    };

    const stats = data?.stats;
    const monthlyRevenue = Number(stats?.monthly_revenue ?? 0);
    const previousMonthlyRevenue = Number(
        previousPeriodData?.stats?.monthly_revenue ?? 0,
    );
    const inactiveSummary = data?.inactive_clients_summary;
    const topAttendants = (data?.top_attendants ?? []).filter(
        (item) => item.type === undefined || item.type === 3,
    );
    const recentSales = data?.recent_sales ?? [];
    const revenueGoalProgress = Math.min(
        (monthlyRevenue / REVENUE_GOAL) * 100,
        100,
    );
    const revenueTrend =
        previousMonthlyRevenue > 0
            ? ((monthlyRevenue - previousMonthlyRevenue) /
                  previousMonthlyRevenue) *
              100
            : null;
    const revenueTrendText =
        revenueTrend === null
            ? undefined
            : `${revenueTrend >= 0 ? '+' : ''}${new Intl.NumberFormat('pt-BR', {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
              }).format(revenueTrend)}%`;
    const handleOpenRevenueReport = () => {
        const query = searchParams.toString();
        navigate(`/dashboard/meta-report${query ? `?${query}` : ''}`);
    };

    return (
        <div className="relative mx-auto max-w-screen-2xl space-y-6 px-4 py-4 sm:p-6">
            <div
                className="animate-fade-in"
                style={{ animationDelay: '0ms', opacity: 0 }}
            >
                <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-2 sm:items-center">
                        <div className="w-1 h-6 rounded-full bg-primary" />
                        <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
                            {getGreeting()},{' '}
                            <span className="gradient-text">
                                {name.split(' ')[0]}
                            </span>
                            <Award className="w-5 h-5 text-primary" />
                        </h1>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="h-8 self-start sm:self-auto"
                    >
                        <RefreshCcw
                            className={`w-3.5 h-3.5 mr-1 ${isFetching ? 'animate-spin' : ''}`}
                        />
                        {isFetching ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm ml-3">
                    Visao geral do sistema de reativacao
                </p>
                <button
                    type="button"
                    onClick={handleOpenRevenueReport}
                    className="ml-3 mt-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                    Meta atual: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                    }).format(REVENUE_GOAL)}
                </button>
            </div>

            <DateRangeFilterCard
                title="Periodo"
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                isFetching={isFetching}
                hasActiveFilters={hasActiveFilters}
                hasDraftChanges={hasDraftChanges}
                applyLabel="Filtrar"
                startId="dashboard-start-date"
                endId="dashboard-end-date"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    label="Clientes Inativos"
                    rawValue={stats?.inactive_customers ?? 0}
                    displayFn={(v) => new Intl.NumberFormat('pt-BR').format(v)}
                    icon={UserX}
                    colorClass="text-accent"
                    bgClass="bg-accent/10"
                    delay={80}
                />
                <StatCard
                    label="Receita Mensal"
                    rawValue={Number(stats?.monthly_revenue ?? 0)}
                    displayFn={(v) =>
                        new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                        }).format(v)
                    }
                    icon={DollarSign}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                    trend={revenueTrendText}
                    trendLabel={
                        revenueTrendText
                            ? `vs. ${previousRange.startDate.split('-').reverse().join('/')} a ${previousRange.endDate.split('-').reverse().join('/')}`
                            : 'Sem base comparativa no mês anterior'
                    }
                    helperText={`${new Intl.NumberFormat('pt-BR', {
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                    }).format(revenueGoalProgress)}% da meta de ${new Intl.NumberFormat(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                        },
                    ).format(REVENUE_GOAL)}`}
                    delay={160}
                />
                <StatCard
                    label="Atendentes Ativos"
                    rawValue={stats?.active_attendants ?? 0}
                    displayFn={(v) => String(v)}
                    icon={Users}
                    colorClass="text-secondary"
                    bgClass="bg-secondary/10"
                    delay={240}
                />
                <StatCard
                    label="Taxa de Conversao"
                    rawValue={stats?.conversion_rate ?? 0}
                    displayFn={(v) => `${v}%`}
                    icon={TrendingUp}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-500/10"
                    delay={320}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <TopSellersCard sellers={topAttendants} isLoading={isLoading} />
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <InativosCard
                        summary={inactiveSummary}
                        totalInactive={stats?.inactive_customers ?? 0}
                        isLoading={isLoading}
                    />
                    <RecentSalesCard
                        sales={recentSales}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
