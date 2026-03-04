import { ShoppingCart, TrendingUp, Star, Medal } from 'lucide-react';
import type { TeamMember } from '@/data/mock';
import { cn } from '@/lib/utils';

const RANK_BADGE = [
    { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    { bg: 'bg-slate-400/15', text: 'text-slate-300', border: 'border-slate-400/25' },
    { bg: 'bg-amber-800/20', text: 'text-amber-700', border: 'border-amber-700/30' },
];

interface LeaderboardCardProps {
    sellers: TeamMember[];
}

export default function LeaderboardCard({ sellers }: LeaderboardCardProps) {
    const maxValue = sellers[0]?.salesValue ?? 1;

    return (
        <div
            className="glass-card rounded-2xl p-5 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: '400ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">
                Classificação Geral
            </h2>

            <div className="space-y-2">
                {sellers.map((s, i) => {
                    const pct = Math.round((s.salesValue / maxValue) * 100);
                    const badge = RANK_BADGE[i];
                    return (
                        <div
                            key={s.id}
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-px animate-fade-in',
                                i < 3
                                    ? 'bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] hover:border-blue-500/20'
                                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                            )}
                            style={{ animationDelay: `${450 + i * 50}ms`, opacity: 0 }}
                        >
                            {/* Rank */}
                            {i < 3 ? (
                                <div className={cn(
                                    'w-7 h-7 rounded-lg flex items-center justify-center border shrink-0',
                                    badge.bg, badge.border
                                )}>
                                    <Medal className={cn('w-3.5 h-3.5', badge.text)} />
                                </div>
                            ) : (
                                <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                    {i + 1}
                                </span>
                            )}

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {s.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-semibold truncate">{s.name}</span>
                                    <span className="text-sm font-bold gradient-text-blue ml-2 shrink-0">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(s.salesValue)}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                                        style={{ width: `${pct}%`, transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                                    />
                                </div>
                                <div className="flex gap-3 mt-1.5">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <ShoppingCart className="w-2.5 h-2.5" />{s.salesCount} vendas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <TrendingUp className="w-2.5 h-2.5" />{s.conversionRate}% conv.
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Star className="w-2.5 h-2.5" />{s.activeClients} clientes
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
