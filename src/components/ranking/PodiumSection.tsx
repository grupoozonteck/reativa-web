import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

interface PodiumSectionProps {
    sellers: LeaderboardEntry[];
}

const PODIUM_ORDER = [1, 0, 2];

export function PodiumSection({ sellers }: PodiumSectionProps) {
    if (sellers.length < 1) return null;

    const configs = [
        {
            rank: 2,
            barH: 80,
            avatarSize: 'w-16 h-16',
            ring: 'ring-2 ring-slate-400/40 dark:ring-slate-400/60',
            glow: '',
            nameColor: 'text-foreground',
            revenueColor: 'text-muted-foreground',
            barStyle: 'from-slate-200 to-slate-300 border-slate-300 dark:from-slate-800 dark:to-slate-700 dark:border-slate-700/50',
            digitColor: 'text-slate-500 dark:text-slate-300',
            delay: 0.2,
        },
        {
            rank: 1,
            barH: 128,
            avatarSize: 'w-24 h-24',
            ring: 'ring-4 ring-primary',
            glow: 'shadow-[0_0_40px_hsl(var(--primary)/0.35)]',
            nameColor: 'text-foreground',
            revenueColor: 'text-primary',
            barStyle: 'from-primary/20 to-primary/10 border-primary/30',
            digitColor: 'text-primary/60',
            delay: 0.05,
        },
        {
            rank: 3,
            barH: 56,
            avatarSize: 'w-14 h-14',
            ring: 'ring-2 ring-amber-500/40 dark:ring-amber-700/60',
            glow: '',
            nameColor: 'text-foreground',
            revenueColor: 'text-amber-600 dark:text-amber-400',
            barStyle: 'from-amber-500/15 to-amber-500/5 border-amber-500/20',
            digitColor: 'text-amber-600/60 dark:text-amber-400/60',
            delay: 0.35,
        },
    ];

    return (
        <div className="solid-card relative overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

            <div className="flex items-end justify-center gap-6">
                {PODIUM_ORDER.map((sellerIdx, vi) => {
                    const seller = sellers[sellerIdx];
                    const cfg = configs[vi];
                    if (!seller) return null;

                    const isFirst = cfg.rank === 1;
                    const revenue = Number(seller.revenue ?? 0);
                    const initials = getInitials(seller.user.name);
                    const avatarUrl = seller.user.personal_data?.avatar ?? undefined;
                    const firstName = seller.user.name.split(' ')[0];

                    return (
                        <motion.div
                            key={seller.id}
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: cfg.delay }}
                        >
                            {isFirst && (
                                <motion.div
                                    className="mb-2 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                >
                                    <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary">MVP do Mes</span>
                                </motion.div>
                            )}

                            <div className="relative mb-3">
                                {isFirst && (
                                    <motion.div
                                        className="absolute -inset-5 rounded-full bg-primary/20"
                                        style={{ filter: 'blur(20px)' }}
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    />
                                )}
                                <Avatar className={cn('relative z-10 rounded-full bg-card', cfg.avatarSize, cfg.ring, cfg.glow)}>
                                    <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                    <AvatarFallback className={cn(
                                        'font-bold',
                                        isFirst ? 'bg-primary text-primary-foreground text-sm' : 'bg-secondary text-secondary-foreground text-xs',
                                    )}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        'absolute -bottom-2 left-1/2 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black',
                                        isFirst
                                            ? 'bg-primary text-primary-foreground'
                                            : cfg.rank === 2
                                                ? 'bg-slate-300 text-slate-900 dark:bg-slate-400 dark:text-slate-950'
                                                : 'bg-amber-500 text-amber-950',
                                    )}
                                >
                                    #{cfg.rank}
                                </div>
                            </div>

                            <div className="mb-3 mt-1 text-center">
                                <p className={cn('max-w-[90px] truncate text-sm font-bold', cfg.nameColor)}>{firstName}</p>
                                <p className={cn('text-xs font-black tabular-nums', cfg.revenueColor)}>{BRL.format(revenue)}</p>
                            </div>

                            <motion.div
                                className={cn(
                                    'relative flex w-24 items-center justify-center overflow-hidden rounded-t-xl border bg-gradient-to-t',
                                    cfg.barStyle,
                                )}
                                initial={{ height: 0 }}
                                animate={{ height: cfg.barH }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.1 }}
                            >
                                <span className={cn('text-3xl font-black opacity-40', cfg.digitColor)}>{cfg.rank}</span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
