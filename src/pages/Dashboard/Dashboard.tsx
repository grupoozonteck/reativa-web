import { useState } from 'react';
import { UserX, DollarSign, TrendingUp, Users, Award, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import TopSellersCard from '@/components/dashboard/TopSellersCard';
import InativosCard from '@/components/dashboard/InativosCard';
import RecentSalesCard from '@/components/dashboard/RecentSalesCard';
import { dashboardService } from '@/services/dashboard.service';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import { getCurrentMonthDateRange } from '@/utils/date-range';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function Dashboard() {
    const { user } = useAuth();
    const name = user?.name ?? 'Usuario';
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate = searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['dashboard', user?.id, appliedStartDate, appliedEndDate],
        queryFn: () => dashboardService.getDashboard({
            start_date: appliedStartDate || undefined,
            end_date: appliedEndDate || undefined,
        }),
        enabled: !!user?.id,
        refetchInterval: 5 * 60 * 1000,
    });

    const hasActiveFilters = appliedStartDate !== defaultRange.startDate || appliedEndDate !== defaultRange.endDate;
    const hasDraftChanges = startDate !== appliedStartDate || endDate !== appliedEndDate;

    const handleApplyFilters = () => {
        setSearchParams((params) => {
            if (startDate && startDate !== defaultRange.startDate) params.set('start_date', startDate); else params.delete('start_date');
            if (endDate && endDate !== defaultRange.endDate) params.set('end_date', endDate); else params.delete('end_date');
            return params;
        }, { replace: true });
    };

    const handleClearFilters = () => {
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setSearchParams((params) => {
            params.delete('start_date');
            params.delete('end_date');
            return params;
        }, { replace: true });
    };

    const stats = data?.stats;
    const inactiveSummary = data?.inactive_clients_summary;
    const topAttendants = (data?.top_attendants ?? []).filter((item) => item.type === undefined || item.type === 3);
    const recentSales = data?.recent_sales ?? [];

    return (
        <div className="p-6 space-y-6 max-w-screen-2xl mx-auto relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/4 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary/4 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/3 rounded-full blur-3xl" />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0ms', opacity: 0 }}>
                <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 rounded-full bg-primary" />
                        <h1 className="md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                            {getGreeting()},{' '}
                            <span className="gradient-text">{name.split(' ')[0]}</span>
                            <Award className="w-5 h-5 text-primary" />
                        </h1>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="h-8"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm ml-3">Visao geral do sistema de reativacao</p>
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
                    displayFn={v => new Intl.NumberFormat('pt-BR').format(v)}
                    icon={UserX}
                    colorClass="text-accent"
                    bgClass="bg-accent/10"
                    delay={80}
                />
                <StatCard
                    label="Receita Mensal"
                    rawValue={Number(stats?.monthly_revenue ?? 0)}
                    displayFn={v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v)}
                    icon={DollarSign}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                    trend="+18%"
                    delay={160}
                />
                <StatCard
                    label="Atendentes Ativos"
                    rawValue={stats?.active_attendants ?? 0}
                    displayFn={v => String(v)}
                    icon={Users}
                    colorClass="text-secondary"
                    bgClass="bg-secondary/10"
                    delay={240}
                />
                <StatCard
                    label="Taxa de Conversao"
                    rawValue={stats?.conversion_rate ?? 0}
                    displayFn={v => `${v}%`}
                    icon={TrendingUp}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-500/10"
                    trend="+5%"
                    delay={320}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <TopSellersCard sellers={topAttendants} isLoading={isLoading} />
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <InativosCard summary={inactiveSummary} totalInactive={stats?.inactive_customers ?? 0} isLoading={isLoading} />
                    <RecentSalesCard sales={recentSales} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
