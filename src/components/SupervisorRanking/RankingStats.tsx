import { BarChart3, CircleDollarSign, Headphones, Trophy, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/client-utils';

interface SupervisorRankingStatsProps {
    isLoading: boolean;
    supervisorsCount: number;
    totalRevenue: number;
    totalSales: number;
    totalReengagements: number;
    bestConversion: number;
}

interface StatCard {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconBg: string;
    valueColor: string;
    cardBg: string;
}

export function RankingStats({
    isLoading,
    supervisorsCount,
    totalRevenue,
    totalSales,
    totalReengagements,
    bestConversion,
}: SupervisorRankingStatsProps) {
    const stats: StatCard[] = [
        {
            label: 'Supervisores',
            value: isLoading ? '...' : supervisorsCount,
            icon: Users,
            iconBg: 'bg-sky-600',
            valueColor: 'text-sky-600 dark:text-sky-400',
            cardBg: 'from-sky-500/10 via-background to-background',
        },
        {
            label: 'Receita Total',
            value: isLoading ? '...' : formatCurrency(totalRevenue),
            icon: CircleDollarSign,
            iconBg: 'bg-emerald-600',
            valueColor: 'text-emerald-600 dark:text-emerald-400',
            cardBg: 'from-emerald-500/10 via-background to-background',
        },
        {
            label: 'Vendas',
            value: isLoading ? '...' : totalSales,
            icon: Trophy,
            iconBg: 'bg-amber-500',
            valueColor: 'text-amber-500 dark:text-amber-400',
            cardBg: 'from-amber-500/10 via-background to-background',
        },
        {
            label: 'Reengajamentos',
            value: isLoading ? '...' : totalReengagements,
            icon: Headphones,
            iconBg: 'bg-violet-600',
            valueColor: 'text-violet-600 dark:text-violet-400',
            cardBg: 'from-violet-500/10 via-background to-background',
        },
        {
            label: 'Melhor Conversao',
            value: isLoading ? '...' : `${bestConversion}%`,
            icon: BarChart3,
            iconBg: 'bg-rose-600',
            valueColor: 'text-rose-600 dark:text-rose-400',
            cardBg: 'from-rose-500/10 via-background to-background',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5 animate-fade-in">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={cn(
                        'solid-card flex items-center gap-3 bg-gradient-to-br p-4 transition-transform hover:scale-[1.01] sm:p-5',
                        stat.cardBg,
                    )}
                >
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', stat.iconBg)}>
                        <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {stat.label}
                        </p>
                        <p className={cn('text-xl font-black tracking-tight tabular-nums', stat.valueColor)}>
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
