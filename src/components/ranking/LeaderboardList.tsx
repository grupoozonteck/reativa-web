import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const rowItem: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, damping: 22, stiffness: 260 } },
};

const staggerContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function LevelBadge({ label }: { label: string }) {
    const lower = label.toLowerCase();
    const isJunior = lower.includes('junior') || lower.includes('júnior');
    return (
        <span className={cn(
            'text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide',
            isJunior
                ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
                : 'bg-green-900/50 text-green-400 border border-green-700/50'
        )}>
            {label}
        </span>
    );
}

interface LeaderboardListProps {
    sellers: LeaderboardEntry[];
}

const VISIBLE_ROWS = 3;

export function LeaderboardList({ sellers }: LeaderboardListProps) {
    const maxRevenue = Math.max(...sellers.map(s => Number(s.revenue ?? 0)), 1);
    const visible = sellers.slice(0, VISIBLE_ROWS);
    const hidden = sellers.length - VISIBLE_ROWS;

    return (
        <div className="solid-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">Lista de Elite</h3>
                <span className="text-[10px] text-muted-foreground">{sellers.length} Participantes</span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[36px_1fr_72px_52px_80px_90px] items-center px-4 py-2 border-b border-white/5">
                {['RANK', 'MEMBRO', 'NÍVEL', 'VENDAS', 'CONV. %', 'RECEITA'].map(col => (
                    <span key={col} className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
                {visible.map((s, i) => {
                    const revenue = Number(s.revenue ?? 0);
                    const convPct = s.conversion;
                    const initials = getInitials(s.user.name);
                    const avatarUrl = s.user.personal_data?.avatar ?? undefined;
                    const isFirst = i === 0;

                    return (
                        <motion.div
                            key={s.id}
                            variants={rowItem}
                            className={cn(
                                'grid grid-cols-[36px_1fr_72px_52px_80px_90px] items-center px-4 py-3 border-b border-white/5',
                                isFirst ? 'bg-lime-500/[0.04]' : 'hover:bg-white/[0.02]'
                            )}
                        >
                            {/* Rank */}
                            <span className={cn(
                                'text-sm font-black tabular-nums',
                                isFirst ? 'text-lime-400' : 'text-muted-foreground'
                            )}>
                                {String(i + 1).padStart(2, '0')}
                            </span>

                            {/* Member */}
                            <div className="flex items-center gap-2 min-w-0">
                                <Avatar className={cn(
                                    'w-8 h-8 shrink-0',
                                    isFirst ? 'ring-2 ring-lime-400/50' : ''
                                )}>
                                    <AvatarImage src={avatarUrl} alt={s.user.name} className="object-cover" />
                                    <AvatarFallback className={cn(
                                        'text-[10px] font-bold',
                                        isFirst ? 'bg-lime-900 text-lime-300' : 'bg-slate-700 text-slate-300'
                                    )}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-white truncate">
                                            {s.user.name.split(' ')[0]}
                                        </span>
                                        {isFirst && (
                                            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-400 border border-rose-700/50 uppercase tracking-wide shrink-0">
                                                Top Performer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Level */}
                            <div>
                                <LevelBadge label={s.graduation_label} />
                            </div>

                            {/* Sales */}
                            <span className="text-xs font-bold text-white tabular-nums">
                                {s.sales}
                            </span>

                            {/* Conv% */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted-foreground tabular-nums">{convPct}%</span>
                                {convPct > 0 && (
                                    <div className="h-1 w-10 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(convPct, 100)}%` }}
                                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.05 }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Revenue */}
                            <span className={cn(
                                'text-xs font-black tabular-nums text-right',
                                isFirst ? 'text-lime-400' : 'text-white'
                            )}>
                                {BRL.format(revenue)}
                            </span>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Footer */}
            {hidden > 0 && (
                <div className="px-4 py-3 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        + {hidden} outros membros em campo
                    </span>
                </div>
            )}
        </div>
    );
}
