import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Award,
    CalendarRange,
    CheckCircle2,
    Crown,
    RefreshCcw,
    Sparkles,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import { useAuth } from '@/contexts/useAuth';
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardTopAttendant } from '@/services/dashboard.service';
import { getCurrentMonthDateRange } from '@/utils/date-range';
import {
    formatCurrency,
    formatDateTime,
    getAvatarColor,
    getInitials,
} from '@/utils/client-utils';
import { cn } from '@/lib/utils';

const REVENUE_GOAL = 150000;
const reveal = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    viewport: { once: true, amount: 0.18 },
};

function AvatarBadge({
    attendant,
    size = 'md',
}: {
    attendant: DashboardTopAttendant;
    size?: 'sm' | 'md' | 'lg';
}) {
    const avatarName = attendant.user.name ?? 'Sem nome';
    const avatarUrl = attendant.user.personal_data?.avatar ?? undefined;
    const sizeClass =
        size === 'lg'
            ? 'h-20 w-20 text-xl'
            : size === 'sm'
              ? 'h-10 w-10 text-sm'
              : 'h-12 w-12 text-sm';

    return (
        <div
            className={cn(
                'overflow-hidden rounded-full ring-1 ring-white/8 shadow-lg shadow-black/20',
                sizeClass,
            )}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={avatarName}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div
                    className={cn(
                        'flex h-full w-full items-center justify-center font-bold text-white',
                        getAvatarColor(avatarName),
                    )}
                >
                    {getInitials(avatarName)}
                </div>
            )}
        </div>
    );
}

function MetricCard({
    label,
    value,
    tone = 'default',
}: {
    label: string;
    value: string;
    tone?: 'default' | 'primary' | 'success';
}) {
    return (
        <div
            className={cn(
                'rounded-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
                tone === 'primary' &&
                    'bg-primary/[0.04] text-primary',
                tone === 'success' &&
                    'bg-emerald-400/[0.04] text-emerald-300',
                tone === 'default' &&
                    'bg-white/[0.018] text-white',
            )}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight tabular-nums sm:text-3xl">
                {value}
            </p>
        </div>
    );
}

export default function GoalMilestoneReport() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate =
        searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: [
            'goal-milestone-report',
            user?.id,
            appliedStartDate,
            appliedEndDate,
        ],
        queryFn: () =>
            dashboardService.getDashboard({
                start_date: appliedStartDate || undefined,
                end_date: appliedEndDate || undefined,
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

    const topAttendants = useMemo(
        () =>
            [...(data?.top_attendants ?? [])]
                .filter((item) => item.type === undefined || item.type === 3)
                .sort(
                    (a, b) => Number(b.revenue ?? 0) - Number(a.revenue ?? 0),
                ),
        [data?.top_attendants],
    );

    const championByRevenue = topAttendants[0];
    const championBySales = [...topAttendants].sort(
        (a, b) => b.sales - a.sales,
    )[0];
    const totalRevenue = Number(data?.stats.monthly_revenue ?? 0);
    const totalSales = topAttendants.reduce((sum, item) => sum + item.sales, 0);
    const totalActiveAttendants = Number(data?.stats.active_attendants ?? 0);
    const conversion = Number(data?.stats.conversion_rate ?? 0);
    const progress = Math.min((totalRevenue / REVENUE_GOAL) * 100, 100);
    const recentSales = data?.recent_sales ?? [];
    const attendantsByName = useMemo(
        () =>
            new Map(
                topAttendants.map((attendant) => [attendant.user.name, attendant]),
            ),
        [topAttendants],
    );

    return (
        <div className="relative mx-auto max-w-[1680px] space-y-6 px-4 pb-8 pt-4 sm:px-6">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
                <div className="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-500/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
            </div>

            <motion.section
                {...reveal}
                className="overflow-hidden rounded-[30px] bg-[#0b1324] shadow-[inset_0_0_0_1px_rgba(163,255,18,0.06)]"
            >
                <div className="relative px-6 py-7 sm:px-8 sm:py-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(163,255,18,0.14),_transparent_34%),radial-gradient(circle_at_right,_rgba(56,189,248,0.1),_transparent_38%)]" />

                    <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_360px]">
                        <div className="min-w-0 space-y-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/18 bg-primary/8 text-primary">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                                    Meta alcançada
                                </p>
                                <h1 className="max-w-[11ch] text-4xl font-black leading-[0.94] tracking-tight text-white sm:text-5xl xl:text-[4.4rem]">
                                    Resumo da conquista do período
                                </h1>
                                <p className="max-w-3xl text-base leading-7 text-slate-300">
                                    Receita consolidada, liderança do time e a
                                    sequência das conversões que empurraram a
                                    operação até a meta.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-[24px] bg-white/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                                <div className="flex items-center gap-2 text-primary">
                                    <Target className="h-4 w-4" />
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                                        Receita final
                                    </p>
                                </div>
                                <p className="mt-3 text-3xl font-black tracking-tight text-white">
                                    {formatCurrency(totalRevenue)}
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    {progress.toFixed(1)}% da meta mensal de{' '}
                                    {formatCurrency(REVENUE_GOAL)}.
                                </p>
                            </div>

                            <div className="rounded-[24px] bg-emerald-400/[0.06] p-5 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.08)]">
                                <div className="flex items-center gap-2 text-emerald-300">
                                    <Award className="h-4 w-4" />
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                                        Destaque do período
                                    </p>
                                </div>
                                <p className="mt-3 text-lg font-bold text-white">
                                    {championByRevenue?.user.name ?? '--'}
                                </p>
                                <p className="mt-2 text-sm text-emerald-300">
                                    {championByRevenue
                                        ? formatCurrency(
                                              championByRevenue.revenue,
                                          )
                                        : '--'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-6 flex flex-wrap gap-3">
                        {topAttendants.slice(0, 4).map((attendant, index) => (
                            <motion.div
                                key={attendant.user.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: index * 0.07 }}
                                className="flex min-w-[210px] items-center gap-3 rounded-full bg-white/[0.016] px-2 py-2 pr-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                            >
                                <AvatarBadge attendant={attendant} size="sm" />
                                <div className="min-w-0">
                                    <p className="max-w-40 truncate text-sm font-semibold text-white">
                                        {attendant.user.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {formatCurrency(attendant.revenue)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="relative mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            label="Receita do período"
                            value={formatCurrency(totalRevenue)}
                            tone="primary"
                        />
                        <MetricCard
                            label="Vendas fechadas"
                            value={String(totalSales)}
                        />
                        <MetricCard
                            label="Atendentes ativos"
                            value={String(totalActiveAttendants)}
                        />
                        <MetricCard
                            label="Conversão média"
                            value={`${conversion.toFixed(1)}%`}
                            tone="success"
                        />
                    </div>
                </div>
            </motion.section>

            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.04 }}>
                <DateRangeFilterCard
                    title="Período"
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
                    startId="goal-report-start-date"
                    endId="goal-report-end-date"
                />
            </motion.div>

            <motion.section
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.08 }}
                className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
            >
                <div className="rounded-[28px] bg-[#0f1728] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-6">
                    <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-400" />
                        <h2 className="text-xl font-black tracking-tight text-white">
                            Campeã da rodada
                        </h2>
                    </div>

                    {championByRevenue ? (
                        <div className="mt-6 grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
                            <div className="flex flex-col items-center gap-3">
                                <AvatarBadge
                                    attendant={championByRevenue}
                                    size="lg"
                                />
                                <div className="rounded-full bg-amber-400/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.08)]">
                                    1º em receita
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-2xl font-black tracking-tight text-white">
                                        {championByRevenue.user.name}
                                    </p>
                                    <p className="mt-1 max-w-2xl text-base text-slate-400">
                                        Liderou o período em receita com uma
                                        entrega consistente ao longo do mês.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <MetricCard
                                        label="Receita"
                                        value={formatCurrency(
                                            championByRevenue.revenue,
                                        )}
                                        tone="primary"
                                    />
                                    <MetricCard
                                        label="Vendas"
                                        value={String(
                                            championByRevenue.sales,
                                        )}
                                    />
                                    <MetricCard
                                        label="Conversão"
                                        value={`${championByRevenue.conversion}%`}
                                        tone="success"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl bg-white/[0.016] px-4 py-8 text-center text-sm text-slate-400 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                            Sem dados de liderança para o período selecionado.
                        </div>
                    )}
                </div>

                <div className="rounded-[28px] bg-[#0f1728] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-6">
                    <div className="flex items-center gap-2 text-primary">
                        <CalendarRange className="h-4 w-4" />
                        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                            Leitura rápida
                        </p>
                    </div>
                    <div className="mt-5 space-y-4">
                        <div className="border-b border-white/[0.05] pb-4">
                            <p className="text-sm text-slate-400">
                                Melhor em receita
                            </p>
                            <p className="mt-1 text-lg font-bold text-white">
                                {championByRevenue?.user.name ?? '--'}
                            </p>
                            <p className="mt-1 text-sm text-primary">
                                {championByRevenue
                                    ? formatCurrency(championByRevenue.revenue)
                                    : '--'}
                            </p>
                        </div>
                        <div className="border-b border-white/[0.05] pb-4">
                            <p className="text-sm text-slate-400">
                                Quem mais atendeu
                            </p>
                            <p className="mt-1 text-lg font-bold text-white">
                                {championBySales?.user.name ?? '--'}
                            </p>
                            <p className="mt-1 text-sm text-emerald-300">
                                {championBySales
                                    ? `${championBySales.sales} vendas no período`
                                    : '--'}
                            </p>
                        </div>
                        <div className="border-b border-white/[0.05] pb-4">
                            <p className="text-sm text-slate-400">
                                Participação do topo
                            </p>
                            <p className="mt-1 text-lg font-bold text-white">
                                {topAttendants.length > 0
                                    ? `${topAttendants.length} nomes no ranking consolidado`
                                    : '--'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">
                                Fechamento do período
                            </p>
                            <p className="mt-1 text-lg font-bold text-white">
                                {totalRevenue >= REVENUE_GOAL
                                    ? 'Objetivo concluído'
                                    : 'Abaixo da meta'}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {totalRevenue >= REVENUE_GOAL
                                    ? 'A operação ultrapassou a meta mensal.'
                                    : `Faltaram ${formatCurrency(REVENUE_GOAL - totalRevenue)} para concluir.`}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.12 }}
                className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]"
            >
                <div className="rounded-[28px] bg-[#0f1728] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-6">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-sky-300" />
                        <h2 className="text-xl font-black tracking-tight text-white">
                            Destaques do time
                        </h2>
                    </div>

                    <div className="mt-6 space-y-4">
                        {topAttendants.slice(0, 5).map((attendant, index) => (
                            <div
                                key={`${attendant.user.name}-${index}`}
                                className="rounded-2xl bg-white/[0.016] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-black text-slate-300">
                                            {index + 1}
                                        </div>
                                        <AvatarBadge
                                            attendant={attendant}
                                            size="md"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate font-semibold text-white">
                                                {attendant.user.name}
                                            </p>
                                            <span className="text-sm font-bold text-primary">
                                                {formatCurrency(
                                                    attendant.revenue,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                                            <span>{attendant.sales} vendas</span>
                                            <span>
                                                {attendant.conversion}%
                                                conversão
                                            </span>
                                        </div>
                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/7">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-primary via-lime-300 to-emerald-400"
                                                style={{
                                                    width: `${
                                                        championByRevenue
                                                            ? Math.max(
                                                                  10,
                                                                  (Number(
                                                                      attendant.revenue,
                                                                  ) /
                                                                      Number(
                                                                          championByRevenue.revenue,
                                                                      )) *
                                                                      100,
                                                              )
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isLoading && topAttendants.length === 0 && (
                        <div className="rounded-2xl bg-white/[0.016] px-4 py-8 text-center text-sm text-slate-400 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                                Sem dados de ranking para o período
                                selecionado.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-[28px] bg-[#0f1728] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-300" />
                        <h2 className="text-xl font-black tracking-tight text-white">
                            Linha do tempo das vendas
                        </h2>
                    </div>

                    <div className="mt-6 space-y-4">
                        {recentSales.map((sale, index) => {
                            const relatedAttendant = attendantsByName.get(
                                sale.attendant_name,
                            );

                            return (
                                <div
                                    key={`${sale.attendant_name}-${sale.customer_name}-${index}`}
                                    className="relative pl-8"
                                >
                                    {index < recentSales.length - 1 && (
                                        <div className="absolute left-[19px] top-10 h-[calc(100%+0.5rem)] w-px bg-white/5" />
                                    )}
                                    <div className="absolute left-0 top-0">
                                        {relatedAttendant ? (
                                            <AvatarBadge
                                                attendant={relatedAttendant}
                                                size="sm"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary ring-1 ring-white/5">
                                                {getInitials(
                                                    sale.attendant_name,
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl bg-white/[0.016] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {sale.attendant_name}
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    {sale.customer_name}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                                                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300">
                                                        {sale.type}
                                                    </span>
                                                    {sale.created_at && (
                                                        <span>
                                                            {formatDateTime(
                                                                sale.created_at,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-lg font-black text-primary">
                                                    {formatCurrency(sale.value)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {!isLoading && recentSales.length === 0 && (
                            <div className="rounded-2xl bg-white/[0.016] px-4 py-8 text-center text-sm text-slate-400 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                                Nenhuma venda recente encontrada para este
                                período.
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            <motion.section
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.16 }}
                className="rounded-[28px] bg-[#0f1728] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-6"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <h2 className="text-xl font-black tracking-tight text-white">
                        Fechamento executivo
                    </h2>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white/[0.016] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-sm text-slate-400">
                            Receita consolidada
                        </p>
                        <p className="mt-2 text-lg font-bold text-white">
                            {formatCurrency(totalRevenue)}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Resultado principal do período selecionado na
                            dashboard.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.016] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-sm text-slate-400">
                            Volume operacional
                        </p>
                        <p className="mt-2 text-lg font-bold text-white">
                            {totalSales} vendas distribuídas entre{' '}
                            {totalActiveAttendants} atendentes ativos.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Leitura rápida do esforço necessário para empurrar a
                            operação até a meta.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.016] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-sm text-slate-400">
                            Liderança do período
                        </p>
                        <p className="mt-2 text-lg font-bold text-white">
                            {championByRevenue?.user.name ?? '--'}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Maior receita individual no recorte atual.
                        </p>
                    </div>
                </div>
            </motion.section>

            <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.2 }}
                className="flex flex-col gap-3 sm:flex-row"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="border-transparent bg-white/[0.025] text-white hover:bg-white/[0.05] hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="border-transparent bg-white/[0.025] text-white hover:bg-white/[0.05] hover:text-white"
                >
                    <RefreshCcw
                        className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
                    />
                    {isFetching ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </motion.div>
        </div>
    );
}
