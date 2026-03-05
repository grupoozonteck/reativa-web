import { useEffect, useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChampionParticle } from './ChampionParticle';
import { AnimatedNumber } from './AnimatedNumber';
import type { LeaderboardEntry } from './types';

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.72 },
    show: (delay: number = 0) => ({
        opacity: 1, scale: 1,
        transition: { type: 'spring' as const, damping: 18, stiffness: 320, delay },
    }),
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay: number = 0) => ({
        opacity: 1, y: 0,
        transition: { type: 'spring' as const, damping: 22, stiffness: 260, delay },
    }),
};

const PODIUM_ORDER = [1, 0, 2];
const PODIUM_CFG = [
    { rank: '2', heightPx: 96, barGrad: 'from-slate-400 to-slate-500', avatarGrad: 'from-slate-300 to-slate-500 shadow-slate-500/20', avatarSize: 'w-16 h-16 text-base', label: 'text-slate-300', delay: 0.25 },
    { rank: '1', heightPx: 144, barGrad: 'from-amber-400 to-yellow-500', avatarGrad: 'from-amber-300 to-yellow-500 shadow-amber-500/40', avatarSize: 'w-20 h-20 sm:w-24 sm:h-24 text-xl sm:text-2xl', label: 'text-amber-300', delay: 0.1 },
    { rank: '3', heightPx: 64, barGrad: 'from-amber-700 to-amber-800', avatarGrad: 'from-amber-600 to-amber-800 shadow-amber-700/20', avatarSize: 'w-14 h-14 text-sm', label: 'text-amber-700', delay: 0.38 },
];

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

interface PodiumSectionProps {
    sellers: LeaderboardEntry[];
}

export function PodiumSection({ sellers }: PodiumSectionProps) {
    const [livePulse, setLivePulse] = useState(true);
    useEffect(() => {
        const id = setInterval(() => setLivePulse(p => !p), 900);
        return () => clearInterval(id);
    }, []);

    if (sellers.length < 1) return null;

    return (
        <motion.div
            className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden"
            variants={fadeUp} initial="hidden" animate="show" custom={0.08}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent pointer-events-none"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />

            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-6 sm:mb-8 flex items-center justify-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Pódio do Mês
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/15">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-orange-400"
                        animate={{ opacity: livePulse ? 1 : 0.2, scale: livePulse ? 1.1 : 0.9 }}
                        transition={{ duration: 0.3 }}
                    />
                    <span className="text-[9px] text-orange-400 font-bold">AO VIVO</span>
                </span>
            </h2>

            <div className="flex items-end justify-center gap-3 sm:gap-6">
                {PODIUM_ORDER.map((sellerIdx, vi) => {
                    const seller = sellers[sellerIdx];
                    const cfg = PODIUM_CFG[vi];
                    if (!seller) return null;
                    const isFirst = sellerIdx === 0;
                    const revenue = Number(seller.revenue ?? 0);
                    const initials = getInitials(seller.user.name);
                    const avatarUrl = seller.user.personal_data?.avatar ?? undefined;

                    return (
                        <motion.div
                            key={seller.id}
                            className="flex flex-col items-center gap-2 sm:gap-3"
                            variants={scaleIn}
                            initial="hidden"
                            animate="show"
                            custom={cfg.delay}
                        >
                            {isFirst && (
                                <motion.div
                                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 mb-1"
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                                >
                                    <Star className="w-3 h-3 text-amber-400" />
                                    <span className="text-[8px] sm:text-[9px] text-amber-400 font-bold uppercase tracking-wider">MVP do Mês</span>
                                </motion.div>
                            )}

                            <div className="relative">
                                {isFirst && (
                                    <div className="absolute inset-0 pointer-events-none hidden sm:block">
                                        {Array.from({ length: 8 }).map((_, pi) => (
                                            <ChampionParticle key={pi} i={pi} />
                                        ))}
                                    </div>
                                )}

                                {isFirst && (
                                    <motion.div
                                        className="absolute -inset-4 rounded-full bg-amber-400/15"
                                        style={{ filter: 'blur(16px)' }}
                                        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    />
                                )}

                                <motion.div
                                    className={cn(
                                        'rounded-full bg-gradient-to-br flex items-center justify-center font-black text-white shadow-xl relative z-10',
                                        cfg.avatarSize, cfg.avatarGrad
                                    )}
                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                        <AvatarFallback className="bg-transparent text-inherit font-inherit">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>
                            </div>

                            <div className="text-center">
                                <p className={cn('text-xs sm:text-sm font-bold truncate max-w-[80px] sm:max-w-none', cfg.label)}>
                                    {seller.user.name.split(' ')[0]}
                                </p>
                                <AnimatedNumber
                                    value={revenue}
                                    currency
                                    duration={1.8}
                                    className={cn('font-black tabular-nums block', isFirst ? 'text-lg sm:text-2xl text-amber-300' : 'text-base sm:text-lg', cfg.label)}
                                />
                                <p className="text-[10px] text-muted-foreground">{seller.sales} vendas</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">
                                    {seller.graduation_label} · {seller.level}
                                </p>
                            </div>

                            <motion.div
                                className={cn(
                                    'w-20 sm:w-28 rounded-t-2xl flex items-center justify-center bg-gradient-to-t relative overflow-hidden',
                                    cfg.barGrad
                                )}
                                initial={{ height: 0 }}
                                animate={{ height: cfg.heightPx }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.15 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <span className="text-3xl font-black text-white/70 relative z-10">{cfg.rank}</span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
