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
        },
        {
            label: 'Total de Vendas',
            value: isLoading ? '...' : totalSales,
            icon: ShoppingCart,
            color: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-600',
        },
        {
            label: 'Atendimentos',
            value: isLoading ? '...' : totalReengagements,
            icon: Headphones,
            color: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-600',
        },
        {
            label: 'Receita Total',
            value: isLoading ? '...' : formatCurrency(totalRevenue),
            icon: TrendingUp,
            color: 'text-amber-500 dark:text-amber-400',
            iconBg: 'bg-amber-500',
        },
        {
            label: 'Conv. Média',
            value: isLoading ? '...' : `${avgConversion}%`,
            icon: BarChart2,
            color: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-600',
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
            {stats.map(card => (
                <div
                    key={card.label}
                    className="solid-card p-4 sm:p-5 hover:scale-[1.01] transition-transform flex items-center gap-3"
                >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.iconBg)}>
                        <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                            {card.label}
                        </p>
                        <p className={cn('text-xl font-black tracking-tight tabular-nums', card.color)}>
                            {card.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
