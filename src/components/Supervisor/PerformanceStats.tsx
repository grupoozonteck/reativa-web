import { Users, ShoppingCart, TrendingUp, Headphones, BarChart2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/client-utils';

interface PerformanceStatsProps {
    isLoading: boolean;
    membersCount: number;
    totalSales: number;
    totalReengagements: number;
    totalRevenue: number;
    avgConversion: number;
}

interface StatCard {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    iconBg: string;
    cardBg: string;
}

export function PerformanceStats({
    isLoading,
    membersCount,
    totalSales,
    totalReengagements,
    totalRevenue,
    avgConversion,
}: PerformanceStatsProps) {
    const stats: StatCard[] = [
        {
            label: 'Membros da Equipe',
            value: isLoading ? '...' : membersCount,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-600',
            cardBg: 'from-blue-500/10 via-background to-background',
        },
        {
            label: 'Total de Vendas',
            value: isLoading ? '...' : totalSales,
            icon: ShoppingCart,
            color: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-600',
            cardBg: 'from-emerald-500/10 via-background to-background',
        },
        {
            label: 'Atendimentos',
            value: isLoading ? '...' : totalReengagements,
            icon: Headphones,
            color: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-600',
            cardBg: 'from-violet-500/10 via-background to-background',
        },
        {
            label: 'Receita Total',
            value: isLoading ? '...' : formatCurrency(totalRevenue),
            icon: TrendingUp,
            color: 'text-amber-500 dark:text-amber-400',
            iconBg: 'bg-amber-500',
            cardBg: 'from-amber-500/10 via-background to-background',
        },
        {
            label: 'Conv. Media',
            value: isLoading ? '...' : `${avgConversion}%`,
            icon: BarChart2,
            color: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-600',
            cardBg: 'from-rose-500/10 via-background to-background',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 animate-fade-in sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
            {stats.map((card) => (
                <div
                    key={card.label}
                    className={cn(
                        'solid-card flex items-center gap-3 bg-gradient-to-br p-4 transition-transform hover:scale-[1.01] sm:p-5',
                        card.cardBg,
                    )}
                >
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', card.iconBg)}>
                        <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {card.label}
                        </p>
                        <p className={cn('text-xl font-black tracking-tight tabular-nums', card.color)}>{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
