import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    rawValue: number;
    displayFn: (v: number) => string;
    icon: LucideIcon;
    colorClass: string;
    bgClass: string;
    trend?: string;
    delay?: number;
}

export default function StatCard({
    label, rawValue, displayFn, icon: Icon,
    colorClass, bgClass, trend, delay,
}: StatCardProps) {
    const count = useCountUp(rawValue, 1400);
    const display = displayFn(parseInt(count.replace(/\D/g, '')) || 0);

    return (
        <div
            className={cn(
                'solid-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-default animate-fade-in'
            )}
            style={{ animationDelay: `${delay ?? 0}ms`, opacity: 0 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', bgClass)}>
                    <Icon className={cn('w-5 h-5', colorClass)} />
                </div>
                {trend && (
                    <span
                        className={cn(
                            'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full',
                            trend.startsWith('+')
                                ? 'text-emerald-500 bg-emerald-500/10'
                                : 'text-rose-500 bg-rose-500/10'
                        )}
                    >
                        <ArrowUpRight className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>
            <p className={cn('text-3xl font-black tracking-tight animate-number-pop', colorClass)}>
                {display}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
        </div>
    );
}
