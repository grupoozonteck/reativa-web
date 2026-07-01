import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
    AlertCircle,
    Crown,
    Star,
    Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/useAuth';
import {
    type RecruiterRankingEntry,
    recruiterRankingService,
} from '@/services/recruiter-ranking.service';
import { getCurrentMonthDateRange } from '@/utils/date-range';
import {
    formatCurrencyInput,
    formatDateTime,
    getAvatarColor,
    getInitials,
    parseCurrencyInput,
} from '@/utils/client-utils';
import { cn } from '@/lib/utils';
import { formatBRL } from '@/utils/format-ultis';
import { RecruitersRankingFilters } from './RecruitersRankingFilters';



const PODIUM_ORDER = [1, 0, 2];

const PODIUM_CONFIGS = [
    {
        rank: 2,
        barHeight: 96,
        avatarSize: 'h-16 w-16',
        ring: 'ring-2 ring-slate-400/45',
        valueColor: 'text-slate-300',
        barGradient: 'from-slate-500/25 to-slate-700/10',
        barBorder: 'border-slate-500/20',
        digitColor: 'text-slate-400/45',
        badgeClassName: 'bg-slate-300 text-slate-900',
        delay: 0.2,
    },
    {
        rank: 1,
        barHeight: 166,
        avatarSize: 'h-24 w-24',
        ring: 'ring-4 ring-amber-400/70',
        valueColor: 'text-amber-300',
        barGradient: 'from-amber-500/30 to-primary/20',
        barBorder: 'border-amber-500/30',
        digitColor: 'text-amber-300/35',
        badgeClassName: 'bg-amber-400 text-amber-950',
        delay: 0.05,
    },
    {
        rank: 3,
        barHeight: 68,
        avatarSize: 'h-14 w-14',
        ring: 'ring-2 ring-orange-500/45',
        valueColor: 'text-orange-300',
        barGradient: 'from-orange-700/20 to-orange-900/10',
        barBorder: 'border-orange-600/20',
        digitColor: 'text-orange-400/35',
        badgeClassName: 'bg-orange-500 text-orange-50',
        delay: 0.35,
    },
];

function RankingSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-[360px] rounded-2xl" />
            <Skeleton className="h-[320px] rounded-2xl" />
        </div>
    );
}

function ChampionParticles() {
    const particles = [
        { x: -42, y: -20, Icon: Star, color: 'text-amber-400', size: 'h-3 w-3' },
        { x: 42, y: -24, Icon: Zap, color: 'text-primary', size: 'h-3 w-3' },
        { x: -30, y: 28, Icon: Star, color: 'text-amber-300', size: 'h-2.5 w-2.5' },
        { x: 34, y: 24, Icon: Zap, color: 'text-orange-400', size: 'h-2.5 w-2.5' },
        { x: 0, y: -48, Icon: Star, color: 'text-primary', size: 'h-2.5 w-2.5' },
    ];

    return (
        <>
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="absolute pointer-events-none animate-float-up"
                    style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: particle.x,
                        marginTop: particle.y,
                        animationDelay: `${index * 0.25}s`,
                        animationDuration: `${1.6 + index * 0.18}s`,
                    }}
                >
                    <particle.Icon
                        className={cn(
                            particle.size,
                            particle.color,
                            'fill-current opacity-80',
                        )}
                    />
                </div>
            ))}
        </>
    );
}

function RecruitersPodium({
    recruiters,
    rankingType,
}: {
    recruiters: RecruiterRankingEntry[];
    rankingType: '0' | '1';
}) {
    if (recruiters.length < 1) return null;

    return (
        <div className="solid-card relative overflow-hidden rounded-2xl px-6 py-5">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-4 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/6 blur-3xl" />
                <div className="absolute left-1/2 top-16 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <div className="absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            </div>

            <div className="relative z-10 mb-6 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Podio do mês
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <Crown className="h-3.5 w-3.5" />
                    <span>Competição ativa</span>
                </div>
            </div>

            <div className="relative z-10 flex min-h-[290px] items-end justify-center gap-3 sm:min-h-[390px] sm:gap-12">
                {PODIUM_ORDER.map((sellerIndex, visualIndex) => {
                    const recruiter = recruiters[sellerIndex];
                    const config = PODIUM_CONFIGS[visualIndex];
                    if (!recruiter) return null;

                    const isFirst = config.rank === 1;
                    const mainValue =
                        rankingType === '1'
                            ? formatBRL(recruiter.total_sale)
                            : `${recruiter.recruiter_quantity} recrut.`;

                    return (
                        <motion.div
                            key={`${recruiter.login}-${config.rank}`}
                            className="flex cursor-default flex-col items-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: 'spring',
                                damping: 18,
                                stiffness: 220,
                                delay: config.delay,
                            }}
                        >
                            {isFirst && (
                                <div className="mb-2 flex flex-col items-center gap-1 sm:gap-1.5">
                                    <div>
                                        <Crown className="h-6 w-6 fill-amber-400/30 text-amber-400 sm:h-7 sm:w-7" />
                                    </div>
                                    <div className="relative overflow-hidden rounded-full border border-amber-400/45 bg-amber-400/12 px-2.5 py-1 sm:px-3">
                                        <span className="relative z-10 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 sm:gap-1.5 sm:text-xs">
                                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 sm:h-3 sm:w-3" />
                                            MVP do Mes
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="relative mb-2 sm:mb-3">
                                {isFirst && (
                                    <>
                                        <div className="absolute -inset-6 rounded-full bg-amber-400/15 blur-2xl" />
                                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/35 animate-ripple" />
                                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ripple-slow" />
                                        <ChampionParticles />
                                    </>
                                )}

                                <Avatar
                                    className={cn(
                                        'relative z-10 rounded-full bg-card',
                                        visualIndex === 1
                                            ? 'h-20 w-20 sm:h-24 sm:w-24'
                                            : visualIndex === 0
                                                ? 'h-12 w-12 sm:h-16 sm:w-16'
                                                : 'h-11 w-11 sm:h-14 sm:w-14',
                                        config.ring,
                                        isFirst && 'animate-pulse-glow-amber',
                                    )}
                                >
                                    <AvatarImage
                                        src={recruiter.avatar ?? undefined}
                                        alt={recruiter.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback
                                        className={cn(
                                            'font-bold text-white',
                                            getAvatarColor(recruiter.name),
                                        )}
                                    >
                                        {getInitials(recruiter.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div
                                    className={cn(
                                        'absolute -bottom-2 left-1/2 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black',
                                        config.badgeClassName,
                                    )}
                                >
                                    #{config.rank}
                                </div>
                            </div>

                            <div className="mb-2 mt-1 text-center sm:mb-3">
                                <p className="max-w-[88px] truncate text-sm font-bold text-foreground sm:max-w-[120px] sm:text-base">
                                    {recruiter.name.split(' ')[0]}
                                </p>
                                <p
                                    className={cn(
                                        'text-xs font-black tabular-nums sm:text-sm',
                                        config.valueColor,
                                    )}
                                >
                                    {mainValue}
                                </p>
                            </div>

                            <motion.div
                                className={cn(
                                    'relative flex w-20 items-center justify-center overflow-hidden rounded-t-2xl border bg-gradient-to-t sm:w-28',
                                    config.barGradient,
                                    config.barBorder,
                                )}
                                initial={{ height: 0 }}
                                animate={{
                                    height:
                                        visualIndex === 1
                                            ? 148
                                            : visualIndex === 0
                                                ? 92
                                                : 64,
                                }}
                                transition={{
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: config.delay + 0.2,
                                }}
                            >
                                <span
                                    className={cn(
                                        'text-2xl font-black opacity-40 sm:text-3xl',
                                        config.digitColor,
                                    )}
                                >
                                    {config.rank}
                                </span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function RecruitersList({
    recruiters,
}: {
    recruiters: RecruiterRankingEntry[];
}) {
    return (
        <div className="solid-card overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
                <h3 className="text-sm font-bold text-foreground">
                    Lista de Recrutadores
                </h3>
                <span className="text-xs text-muted-foreground">
                    {recruiters.length} participantes
                </span>
            </div>

            <div className="hidden grid-cols-[72px_minmax(320px,1fr)_150px_180px_190px] items-center border-b border-border/60 bg-muted/25 px-5 py-3 lg:grid">
                {[
                    'Rank',
                    'Membro',
                    'Recrutamentos',
                    'Venda',
                    'Último recrutamento',
                ].map((col) => (
                    <span
                        key={col}
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                        {col}
                    </span>
                ))}
            </div>

            <div>
                {recruiters.map((recruiter, index) => {
                    const accents = [
                        'text-amber-400 border-l-amber-400 bg-amber-500/5',
                        'text-slate-300 border-l-slate-400 bg-slate-500/3',
                        'text-orange-300 border-l-orange-500 bg-orange-700/5',
                    ];
                    const accent = accents[index] ?? '';
                    const isTop3 = index < 3;

                    return (
                        <div
                            key={`${recruiter.login}-${index}`}
                            className={cn(
                                'cursor-default border-b border-border/50 border-l-2 px-4 py-3.5 last:border-b-0 transition-colors',
                                isTop3
                                    ? accent
                                    : 'border-l-transparent',
                            )}
                        >
                            <div className="grid gap-4 lg:hidden">
                                <div className="flex items-start gap-3">
                                    <span
                                        className={cn(
                                            'w-8 shrink-0 text-lg font-black tabular-nums',
                                            isTop3
                                                ? accent.split(' ')[0]
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <Avatar className="h-10 w-10 ring-1 ring-white/10">
                                        <AvatarImage
                                            src={recruiter.avatar ?? undefined}
                                            alt={recruiter.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback
                                            className={cn(
                                                'text-xs font-bold text-white',
                                                getAvatarColor(recruiter.name),
                                            )}
                                        >
                                            {getInitials(recruiter.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <span className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                                            {recruiter.name}
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            @{recruiter.login}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <MobileMetric
                                        label="Recrutamentos"
                                        value={recruiter.recruiter_quantity}
                                    />
                                    <MobileMetric
                                        label="Venda"
                                        value={formatBRL(recruiter.total_sale)}
                                    />
                                    <MobileMetric
                                        className="col-span-2"
                                        label="Ultimo"
                                        value={formatDateTime(recruiter.last_recruiter)}
                                    />
                                </div>
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-[72px_minmax(320px,1fr)_150px_180px_190px] lg:items-center">
                                <span
                                    className={cn(
                                        'text-sm font-black tabular-nums',
                                        isTop3
                                            ? accent.split(' ')[0]
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className="h-10 w-10 ring-1 ring-white/10">
                                        <AvatarImage
                                            src={recruiter.avatar ?? undefined}
                                            alt={recruiter.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback
                                            className={cn(
                                                'text-xs font-bold text-white',
                                                getAvatarColor(recruiter.name),
                                            )}
                                        >
                                            {getInitials(recruiter.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <span className="truncate text-sm font-semibold text-foreground">
                                            {recruiter.name}
                                        </span>
                                        <p className="truncate text-xs text-muted-foreground">
                                            @{recruiter.login}
                                        </p>
                                    </div>
                                </div>

                                <span className="pr-4 text-sm font-bold tabular-nums text-cyan-300">
                                    {recruiter.recruiter_quantity}
                                </span>

                                <span
                                    className={cn(
                                        'pr-4 text-sm font-black tabular-nums',
                                        index === 0 ? 'text-amber-400' : 'text-foreground',
                                    )}
                                >
                                    {formatBRL(recruiter.total_sale)}
                                </span>

                                <span className="text-sm text-muted-foreground">
                                    {formatDateTime(recruiter.last_recruiter)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MobileMetric({
    className,
    label,
    value,
}: {
    className?: string;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'rounded-xl border border-border/50 bg-muted/20 px-3 py-2',
                className,
            )}
        >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div className="pt-1 text-sm font-bold leading-5 tabular-nums text-foreground">
                {value}
            </div>
        </div>
    );
}

export default function RecruitersRanking() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate =
        searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const appliedRankingType =
        searchParams.get('ranking_type') === '1' ? '1' : '0';
    const appliedMinValue = Number(searchParams.get('min_value')) || 150;

    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);
    const [rankingType, setRankingType] = useState<'0' | '1'>(
        appliedRankingType,
    );
    const [minValueDisplay, setMinValueDisplay] = useState(
        formatCurrencyInput(String(Math.round(appliedMinValue * 100))),
    );
    const minValue = (() => {
        const parsed = parseCurrencyInput(minValueDisplay);
        return isNaN(parsed) ? 0 : parsed;
    })();

    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: [
            'recruiters-ranking',
            user?.id,
            appliedStartDate,
            appliedEndDate,
            appliedRankingType,
            appliedMinValue,
        ],
        queryFn: () =>
            recruiterRankingService.getRanking({
                start_date: appliedStartDate || undefined,
                end_date: appliedEndDate || undefined,
                ranking_type: Number(appliedRankingType) as 0 | 1,
                min_value: appliedMinValue,
            }),
        enabled: !!user?.id,
        staleTime: 60 * 1000,
        refetchInterval: 2 * 60 * 1000,
    });

    const hasActiveFilters =
        appliedStartDate !== defaultRange.startDate ||
        appliedEndDate !== defaultRange.endDate ||
        appliedRankingType !== '0' ||
        appliedMinValue !== 150;

    const hasDraftChanges =
        startDate !== appliedStartDate ||
        endDate !== appliedEndDate ||
        rankingType !== appliedRankingType ||
        minValue !== appliedMinValue;

    const handleApplyFilters = () => {
        setSearchParams(
            (params) => {
                if (startDate && startDate !== defaultRange.startDate)
                    params.set('start_date', startDate);
                else params.delete('start_date');

                if (endDate && endDate !== defaultRange.endDate)
                    params.set('end_date', endDate);
                else params.delete('end_date');

                if (rankingType !== '0')
                    params.set('ranking_type', rankingType);
                else params.delete('ranking_type');

                if (minValue !== 150)
                    params.set('min_value', String(minValue));
                else params.delete('min_value');

                return params;
            },
            { replace: true },
        );
    };

    const handleClearFilters = () => {
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setRankingType('0');
        setMinValueDisplay(formatCurrencyInput(String(Math.round(150 * 100))));
        setSearchParams(
            (params) => {
                params.delete('start_date');
                params.delete('end_date');
                params.delete('ranking_type');
                params.delete('min_value');
                return params;
            },
            { replace: true },
        );
    };

    const recruiters = [...(data ?? [])].sort((a, b) => {
        if (appliedRankingType === '1') {
            const salesDiff = b.total_sale - a.total_sale;
            if (salesDiff !== 0) return salesDiff;
            return b.recruiter_quantity - a.recruiter_quantity;
        }

        const quantityDiff = b.recruiter_quantity - a.recruiter_quantity;
        if (quantityDiff !== 0) return quantityDiff;
        return b.total_sale - a.total_sale;
    });

    if (isLoading) {
        return (
            <div className="mx-auto max-w-screen-2xl p-6">
                <RankingSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-screen-2xl p-6">
                <div className="solid-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-rose-400" />
                        <div>
                            <h2 className="text-base font-bold">
                                Não foi possível carregar o ranking
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Verifique sua conexão e tente novamente.
                            </p>
                            <Button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-4"
                            >
                                Tentar novamente
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-screen-2xl space-y-5 p-3 py-6 sm:p-6 sm:py-8">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute right-1/3 top-0 h-[500px] w-[500px] rounded-full bg-amber-500/4 blur-3xl" />
                <div className="absolute left-0 top-1/2 h-96 w-96 rounded-full bg-primary/4 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary/4 blur-3xl" />
            </div>

            <RecruitersRankingFilters
                participants={recruiters.length}
                isFetching={isFetching}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                rankingType={rankingType}
                onRankingTypeChange={(v) => setRankingType(v)}
                minValueDisplay={minValueDisplay}
                onMinValueChange={(v) =>
                    setMinValueDisplay(formatCurrencyInput(v))
                }
                onRefresh={() => refetch()}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                hasDraftChanges={hasDraftChanges}
            />

            {recruiters.length > 0 ? (
                <div className="space-y-5">
                    <RecruitersPodium
                        recruiters={recruiters}
                        rankingType={appliedRankingType}
                    />
                    <RecruitersList recruiters={recruiters} />
                </div>
            ) : (
                <div className="solid-card rounded-2xl border border-border/60 p-6 text-center">
                    <h2 className="text-base font-bold">
                        Nenhum recrutador no ranking
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Assim que houver movimentação no período, o ranking aparecerá
                        aqui.
                    </p>
                </div>
            )}
        </div>
    );
}
