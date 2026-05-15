import {
    Users,
    ShoppingCart,
    TrendingUp,
    Headphones,
    BarChart2,
    type LucideIcon,
} from 'lucide-react';
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
    helper: string;
    icon: LucideIcon;
    color: string;
    iconBg: string;
    desktopSpan?: string;
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
            helper: 'Base ativa na operacao',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-600',
        },
        {
            label: 'Total de vendas',
            value: isLoading ? '...' : totalSales,
            helper: 'Reativacoes concluídas',
            icon: ShoppingCart,
            color: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-600',
        },
        {
            label: 'Atendimentos',
            value: isLoading ? '...' : totalReengagements,
            helper: 'Contatos realizados',
            icon: Headphones,
            color: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-600',
        },
        {
            label: 'Receita total',
            value: isLoading ? '...' : formatCurrency(totalRevenue),
            helper: 'Volume financeiro do periodo',
            icon: TrendingUp,
            color: 'text-amber-500 dark:text-amber-400',
            iconBg: 'bg-amber-500',
            desktopSpan: 'lg:col-span-1',
        },
        {
            label: 'Conversão Geral',
            value: isLoading ? '...' : `${totalConversion}%`,
            helper: 'Média consolidada do periodo', 
            icon: BarChart2,
            color: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 animate-fade-in lg:grid-cols-5">
            {stats.map((card) => (
                <div
                    key={card.label}
                    className={cn(
                        'solid-card flex min-w-0 flex-col gap-4 p-4 transition-transform hover:scale-[1.01] sm:p-5',
                        card.desktopSpan,
                    )}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div
                            className={cn(
                                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                                card.iconBg,
                            )}
                        >
                            <card.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {card.label}
                        </p>
                    </div>

                    <div className="min-w-0">
                        <p
                            className={cn(
                                'text-[1.75rem] font-black leading-none tracking-tight tabular-nums sm:text-[2rem]',
                                card.color,
                                card.label === 'Receita total' &&
                                    'text-[clamp(1.3rem,4vw,1.8rem)]',
                            )}
                        >
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {card.helper}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
