import { Users, ShoppingCart, TrendingUp, Headphones, BarChart2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/client-utils';

interface ManagerStatsProps {
    isLoading: boolean;
    supervisorsCount: number;
    totalSales: number;
    totalReengagements: number;
    totalRevenue: number;
    totalConversion: number;
}

interface StatCard {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    iconBg: string;
}

export function ManagerStats({
    isLoading,
    supervisorsCount,
    totalSales,
    totalReengagements,
    totalRevenue,
    totalConversion,
}: ManagerStatsProps) {
    const stats: StatCard[] = [
        {
            label: 'Supervisores',
            value: isLoading ? '...' : supervisorsCount,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-600',
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
            label: 'Conversão Geral',
            value: isLoading ? '...' : `${totalConversion}%`,
            icon: BarChart2,
            color: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-600',
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 animate-fade-in">
            {stats.map(card => (
                <div
                    key={card.label}
                    className="solid-card p-4 sm:p-6 hover:scale-[1.01] transition-transform flex items-center gap-4"
                >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', card.iconBg)}>
                        <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {card.label}
                        </p>
                        <p className={cn('text-2xl font-black tracking-tight tabular-nums', card.color)}>
                            {card.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
