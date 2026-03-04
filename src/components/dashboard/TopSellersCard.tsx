import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { teamMembers } from '@/data/mock';
import { cn } from '@/lib/utils';

const topSellers = [...teamMembers]
    .filter(m => m.role === 'atendente')
    .sort((a, b) => b.salesValue - a.salesValue)
    .slice(0, 4);

const rankColors = [
    'text-amber-500', 'text-slate-400', 'text-amber-700', 'text-muted-foreground',
];

const rankBadge = [
    'bg-amber-500/20 text-amber-500 border-amber-500/30',
    'bg-slate-400/15 text-slate-400 border-slate-400/25',
    'bg-amber-800/20 text-amber-700 border-amber-700/30',
    'bg-white/5 text-muted-foreground border-white/10',
];

export default function TopSellersCard() {
    const max = topSellers[0]?.salesValue ?? 1;

    return (
        <div
            className="lg:col-span-3 solid-card rounded-2xl p-5 animate-fade-in relative overflow-hidden"
            style={{ animationDelay: '400ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-500" />
                    Top Atendentes — Mês
                </h2>
                <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
                    Ao vivo
                </Badge>
            </div>

            <div className="space-y-5">
                {topSellers.map((s, i) => {
                    const pct = Math.round((s.salesValue / max) * 100);
                    return (
                        <div
                            key={s.id}
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
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                                {s.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className={cn('text-sm font-semibold truncate', rankColors[i])}>{s.name}</span>
                                    <span className="text-sm font-bold gradient-text-blue ml-2 shrink-0">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(s.salesValue)}
                                    </span>
                                </div>
                                <div className="relative h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                                        style={{ width: `${pct}%`, transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                                    />
                                </div>
                                <div className="flex gap-3 mt-1.5">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <ShoppingCart className="w-2.5 h-2.5" />{s.salesCount} vendas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{s.conversionRate}% conv.</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
