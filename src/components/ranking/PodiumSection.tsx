import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

interface PodiumSectionProps {
    sellers: LeaderboardEntry[];
}

const PODIUM_ORDER = [1, 0, 2]; // order: 2nd, 1st, 3rd

export function PodiumSection({ sellers }: PodiumSectionProps) {
    if (sellers.length < 1) return null;

    const configs = [
        {
            rank: 2,
            barH: 80,
            avatarSize: 'w-16 h-16',
            ring: 'ring-2 ring-slate-400/60',
            glow: '',
            nameColor: 'text-slate-300',
            revenueColor: 'text-slate-400',
            delay: 0.2,
        },
        {
            rank: 1,
            barH: 128,
            avatarSize: 'w-24 h-24',
            ring: 'ring-4 ring-lime-400',
            glow: 'shadow-[0_0_40px_rgba(132,204,22,0.5)]',
            nameColor: 'text-white',
            revenueColor: 'text-lime-400',
            delay: 0.05,
        },
        {
            rank: 3,
            barH: 56,
            avatarSize: 'w-14 h-14',
            ring: 'ring-2 ring-amber-700/60',
            glow: '',
            nameColor: 'text-amber-700',
            revenueColor: 'text-amber-800',
            delay: 0.35,
        },
    ];

    return (
        <div className="solid-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-lime-500/[0.03] to-transparent pointer-events-none" />

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
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 mb-2"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                >
                                    <Star className="w-2.5 h-2.5 text-lime-400 fill-lime-400" />
                                    <span className="text-[9px] text-lime-400 font-bold uppercase tracking-wider">MVP do Mês</span>
                                </motion.div>
                            )}

                            {/* Rank badge on avatar */}
                            <div className="relative mb-3">
                                {isFirst && (
                                    <motion.div
                                        className="absolute -inset-5 rounded-full bg-lime-400/20"
                                        style={{ filter: 'blur(20px)' }}
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    />
                                )}
                                <Avatar className={cn('rounded-full relative z-10', cfg.avatarSize, cfg.ring, cfg.glow)}>
                                    <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                    <AvatarFallback className={cn(
                                        'font-bold text-white',
                                        isFirst ? 'bg-lime-900 text-sm' : 'bg-slate-700 text-xs'
                                    )}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    'absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black z-20',
                                    isFirst
                                        ? 'bg-lime-400 text-black'
                                        : cfg.rank === 2
                                            ? 'bg-slate-400 text-black'
                                            : 'bg-amber-800 text-white'
                                )}>
                                    #{cfg.rank}
                                </div>
                            </div>

                            {/* Name + revenue */}
                            <div className="text-center mb-3 mt-1">
                                <p className={cn('text-sm font-bold truncate max-w-[90px]', cfg.nameColor)}>
                                    {firstName}
                                </p>
                                <p className={cn('text-xs font-black tabular-nums', cfg.revenueColor)}>
                                    {isFirst && <span className="mr-0.5">💰</span>}
                                    {BRL.format(revenue)}
                                </p>
                            </div>

                            {/* Podium bar */}
                            <motion.div
                                className={cn(
                                    'w-24 rounded-t-xl flex items-center justify-center relative overflow-hidden',
                                    isFirst
                                        ? 'bg-gradient-to-t from-[#1a2e1a] to-[#2a4a2a] border border-lime-900/50'
                                        : cfg.rank === 2
                                            ? 'bg-gradient-to-t from-[#1a1e2e] to-[#252a3a] border border-slate-700/50'
                                            : 'bg-gradient-to-t from-[#1e1a10] to-[#2a2210] border border-amber-900/30'
                                )}
                                initial={{ height: 0 }}
                                animate={{ height: cfg.barH }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.1 }}
                            >
                                <span className={cn(
                                    'text-3xl font-black opacity-20',
                                    isFirst ? 'text-lime-300' : cfg.rank === 2 ? 'text-slate-300' : 'text-amber-700'
                                )}>
                                    {cfg.rank}
                                </span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
