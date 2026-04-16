import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DashboardTopAttendant } from '@/services/dashboard.service';

const rankColors = [
    'text-amber-500', 'text-slate-400', 'text-amber-700', 'text-muted-foreground',
];

const rankBadge = [
    'bg-amber-500/20 text-amber-500 border-amber-500/30',
    'bg-slate-400/15 text-slate-400 border-slate-400/25',
    'bg-amber-800/20 text-amber-700 border-amber-700/30',
    'bg-white/5 text-muted-foreground border-white/10',
];

interface TopSellersCardProps {
    sellers: DashboardTopAttendant[];
    isLoading?: boolean;
}

function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function TopSellersCard({ sellers, isLoading = false }: TopSellersCardProps) {
    const topSellers = [...sellers].sort((a, b) => Number(b.revenue) - Number(a.revenue)).slice(0, 4);
    const max = Number(topSellers[0]?.revenue ?? 1);

    return (
        <div
            className="lg:col-span-3 solid-card rounded-2xl p-5 animate-fade-in relative overflow-hidden"
            style={{ animationDelay: '400ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Top Atendentes — Mês
                </h2>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
                    Ao vivo
                </Badge>
            </div>

            <div className="space-y-5">
                {!isLoading && topSellers.length === 0 && (
                    <p className="text-xs text-muted-foreground">Sem dados de atendentes no momento.</p>
                )}

                {topSellers.map((s, i) => {
                    const pct = Math.round((Number(s.revenue) / max) * 100);
                    return (
                        <div
                            key={`${s.user.name}-${i}`}
                            className="flex items-center gap-3 animate-fade-in"
                            style={{ animationDelay: `${500 + i * 80}ms`, opacity: 0 }}
                        >
                            {/* Rank badge */}
                            <span className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black border shrink-0',
                                rankBadge[i]
                            )}>
                                {i + 1}º
                            </span>

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full btn-primary-arena flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                                {getInitials(s.user.name)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className={cn('text-sm font-semibold truncate', rankColors[i])}>{s.user.name}</span>
                                    <span className="text-sm font-bold gradient-text-blue ml-2 shrink-0">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(Number(s.revenue))}
                                    </span>
                                </div>
                                <div className="relative h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-container"
                                        style={{ width: `${pct}%`, transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                                    />
                                </div>
                                <div className="flex gap-3 mt-1.5">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <ShoppingCart className="w-2.5 h-2.5" />{s.sales} vendas
                                    </span>
                                    <span className="text-xs text-muted-foreground">{s.conversion}% conv.</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
