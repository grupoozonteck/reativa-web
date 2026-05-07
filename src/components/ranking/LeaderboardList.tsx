import { Flame, Medal } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedNumber } from './AnimatedNumber';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const rowItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20, stiffness: 280 } },
};

const staggerContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function LevelBadge({ label }: { label: string }) {
    const lower = label.toLowerCase();
    const isJunior = lower.includes('junior') || lower.includes('júnior');

    return (
        <span
            className={cn(
                'rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
                isJunior
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            )}
        >
            {label}
        </span>
    );
}

interface LeaderboardListProps {
    sellers: LeaderboardEntry[];
}

const VISIBLE_ROWS = 8;

const MEDAL_COLORS = [
    { text: 'text-amber-400', border: 'border-l-amber-400', bg: 'bg-amber-500/5', ring: 'ring-2 ring-amber-400/40' },
    { text: 'text-slate-400', border: 'border-l-slate-400', bg: 'bg-slate-500/3', ring: 'ring-1 ring-slate-400/30' },
    { text: 'text-amber-700 dark:text-amber-600', border: 'border-l-amber-700', bg: 'bg-amber-700/5', ring: 'ring-1 ring-amber-700/30' },
];

const CONV_BAR_COLORS = ['bg-amber-400', 'bg-slate-400', 'bg-amber-700', 'bg-secondary'];

export function LeaderboardList({ sellers }: LeaderboardListProps) {
    const visible = sellers.slice(0, VISIBLE_ROWS);
    const hidden = sellers.length - VISIBLE_ROWS;

    return (
        <div className="solid-card overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
                <h3 className="text-sm font-bold text-foreground">Lista de Elite</h3>
                <span className="text-xs text-muted-foreground">{sellers.length} participantes</span>
            </div>

            <div className="hidden grid-cols-[56px_minmax(220px,1fr)_86px_64px_92px_120px] items-center border-b border-border/60 bg-muted/25 px-4 py-2 lg:grid">
                {['Rank', 'Membro', 'Nivel', 'Vendas', 'Conv. %', 'Receita'].map((col) => (
                    <span key={col} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {col}
                    </span>
                ))}
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="show">
                {visible.map((seller, index) => {
                    const revenue = Number(seller.revenue ?? 0);
                    const convPct = seller.conversion;
                    const initials = getInitials(seller.user.name);
                    const avatarUrl = seller.user.personal_data?.avatar ?? undefined;
                    const isTop3 = index < 3;
                    const medal = MEDAL_COLORS[index];
                    const convBarColor = CONV_BAR_COLORS[Math.min(index, 3)];
                    const isFirst = index === 0;

                    return (
                        <motion.div
                            key={seller.id}
                            variants={rowItem}
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                            className={cn(
                                'border-b border-border/50 px-4 py-3.5 last:border-b-0 border-l-2 transition-colors cursor-default',
                                isTop3
                                    ? `${medal.bg} ${medal.border}`
                                    : 'border-l-transparent hover:bg-muted/20',
                            )}
                        >
                            <div className="grid gap-4 lg:hidden">
                                <div className="flex items-center gap-3">
                                    <span className={cn('text-lg font-black tabular-nums w-8 shrink-0', isTop3 ? medal.text : 'text-muted-foreground')}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <Avatar className={cn('h-10 w-10', isTop3 && medal.ring)}>
                                        <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                        <AvatarFallback className={cn(
                                            'text-xs font-bold',
                                            isFirst ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                                        )}>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-sm font-semibold text-foreground">{seller.user.name}</span>
                                            {index === 0 && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50 shrink-0" />}
                                            {index === 1 && <Medal className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                            {index === 2 && <Medal className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                                            {isFirst && (
                                                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-400">
                                                    Top performer
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">@{seller.user.login}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <MobileMetric label="Nivel" value={<LevelBadge label={seller.graduation_label} />} />
                                    <MobileMetric label="Vendas" value={seller.sales} />
                                    <MobileMetric label="Conv." value={`${convPct}%`} />
                                    <MobileMetric label="Receita" value={BRL.format(revenue)} valueClassName={isTop3 ? medal.text : 'text-foreground'} />
                                </div>
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-[56px_minmax(220px,1fr)_86px_64px_92px_120px] lg:items-center">
                                <span className={cn('text-sm font-black tabular-nums', isTop3 ? medal.text : 'text-muted-foreground')}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className={cn('h-10 w-10', isTop3 && medal.ring)}>
                                        <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                        <AvatarFallback className={cn(
                                            'text-xs font-bold',
                                            isFirst ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                                        )}>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-sm font-semibold text-foreground">{seller.user.name}</span>
                                            {index === 0 && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50 shrink-0" />}
                                            {index === 1 && <Medal className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                            {index === 2 && <Medal className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                                            {isFirst && (
                                                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-400 shrink-0">
                                                    Top performer
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">@{seller.user.login}</p>
                                    </div>
                                </div>

                                <LevelBadge label={seller.graduation_label} />

                                <span className="text-sm font-bold tabular-nums text-foreground ml-4">{seller.sales}</span>

                                <div className="space-y-1.5">
                                    <span className={cn('text-xs font-bold tabular-nums', isTop3 ? medal.text : 'text-muted-foreground')}>{convPct}%</span>
                                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                                        <motion.div
                                            className={cn('h-full rounded-full', convBarColor)}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(convPct, 100)}%` }}
                                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 + index * 0.05 }}
                                        />
                                    </div>
                                </div>

                                <AnimatedNumber
                                    value={revenue}
                                    currency
                                    duration={1.2}
                                    className={cn('text-right text-sm font-black tabular-nums block', isTop3 ? medal.text : 'text-foreground')}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {hidden > 0 && (
                <div className="px-4 py-3 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        + {hidden} outros membros em campo
                    </span>
                </div>
            )}
        </div>
    );
}

function MobileMetric({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
}) {
    return (
        <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <div className={cn('pt-1 text-sm font-bold tabular-nums text-foreground', valueClassName)}>{value}</div>
        </div>
    );
}
