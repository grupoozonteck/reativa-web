import { Crown, Star, Zap, Flame } from 'lucide-react';
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

// Floating particles around champion
const PARTICLES = [
    { x: -44, y: -16, delay: 0,   size: 'w-3.5 h-3.5', Icon: Star,  color: 'text-amber-400', floatDelay: '0s' },
    { x:  42, y: -24, delay: 0.3, size: 'w-3 h-3',     Icon: Zap,   color: 'text-primary',   floatDelay: '0.4s' },
    { x: -32, y:  30, delay: 0.6, size: 'w-2.5 h-2.5', Icon: Star,  color: 'text-amber-300', floatDelay: '0.8s' },
    { x:  36, y:  24, delay: 0.9, size: 'w-3 h-3',     Icon: Flame, color: 'text-orange-400', floatDelay: '1.2s' },
    { x:   0, y: -46, delay: 0.4, size: 'w-2.5 h-2.5', Icon: Star,  color: 'text-primary',   floatDelay: '0.6s' },
    { x: -54, y:   4, delay: 1.1, size: 'w-2 h-2',     Icon: Zap,   color: 'text-secondary', floatDelay: '1s' },
    { x:  52, y:   4, delay: 0.7, size: 'w-2 h-2',     Icon: Star,  color: 'text-amber-500', floatDelay: '0.2s' },
];

function ChampionParticles() {
    return (
        <>
            {PARTICLES.map((p, i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none animate-float-up"
                    style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: p.x,
                        marginTop: p.y,
                        animationDelay: p.floatDelay,
                        animationDuration: `${1.6 + i * 0.2}s`,
                    }}
                >
                    <p.Icon className={cn(p.size, p.color, 'fill-current opacity-80')} />
                </div>
            ))}
        </>
    );
}

const configs = [
    {
        rank: 2,
        barH: 88,
        avatarSize: 'w-16 h-16',
        ring: 'ring-2 ring-slate-400/50',
        nameColor: 'text-foreground',
        revenueColor: 'text-slate-400',
        barGradient: 'from-slate-500/25 to-slate-600/10',
        barBorder: 'border-slate-500/20',
        digitColor: 'text-slate-400/50',
        rankBadgeBg: 'bg-slate-400 text-slate-900',
        delay: 0.25,
    },
    {
        rank: 1,
        barH: 150,
        avatarSize: 'w-24 h-24',
        ring: 'ring-4 ring-amber-400/70',
        nameColor: 'text-foreground',
        revenueColor: 'text-amber-400',
        barGradient: 'from-amber-500/30 to-primary/20',
        barBorder: 'border-amber-500/30',
        digitColor: 'text-amber-400/40',
        rankBadgeBg: 'bg-amber-400 text-amber-950',
        delay: 0.05,
    },
    {
        rank: 3,
        barH: 60,
        avatarSize: 'w-14 h-14',
        ring: 'ring-2 ring-amber-700/50',
        nameColor: 'text-foreground',
        revenueColor: 'text-amber-600 dark:text-amber-500',
        barGradient: 'from-amber-700/25 to-amber-800/10',
        barBorder: 'border-amber-700/20',
        digitColor: 'text-amber-700/50',
        rankBadgeBg: 'bg-amber-700 text-amber-100',
        delay: 0.4,
    },
];

export function PodiumSection({ sellers }: PodiumSectionProps) {

    if (sellers.length < 1) return null;

    return (
        <div className="solid-card relative overflow-hidden rounded-2xl p-6">
            {/* Background: spotlight + floor reflection */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/8 rounded-full blur-2xl" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
                {/* Animated spotlight sweep */}
                <motion.div
                    className="absolute top-0 left-0 w-32 h-full opacity-[0.04] bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{ x: ['-100%', '700%'] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear', repeatDelay: 4 }}
                />
            </div>

            {/* Header */}
            <div className="relative z-10 mb-6 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Pódio do Mês</p>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Competição ativa</span>
                </div>
            </div>

            <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-10">
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
                            className="flex flex-col items-center cursor-default"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 18, stiffness: 220, delay: cfg.delay }}
                            whileHover={{ y: isFirst ? -10 : -6, scale: isFirst ? 1.04 : 1.03 }}
                        >
                            {/* Crown + MVP badge for 1st */}
                            {isFirst && (
                                <div className="flex flex-col items-center mb-2 gap-1.5">
                                    <motion.div
                                        animate={{ rotate: [-8, 8, -8], y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                                    >
                                        <Crown className="w-7 h-7 text-amber-400 fill-amber-400/40" />
                                    </motion.div>
                                    <motion.div
                                        className="relative flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-3 py-1 overflow-hidden"
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                                    >
                                        {/* Shimmer on badge */}
                                        <div className="absolute inset-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sweep" />
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-black uppercase tracking-wider text-amber-400">MVP do Mês</span>
                                    </motion.div>
                                </div>
                            )}

                            {/* Avatar + ripple rings + particles */}
                            <div className="relative mb-3">
                                {isFirst && (
                                    <>
                                        {/* Amber glow blob */}
                                        <motion.div
                                            className="absolute -inset-6 rounded-full bg-amber-400/15"
                                            style={{ filter: 'blur(20px)' }}
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                                        />
                                        {/* CSS ripple rings */}
                                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ripple" />
                                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/25 animate-ripple-slow" />
                                        {/* Floating particles */}
                                        <ChampionParticles />
                                    </>
                                )}

                                <Avatar
                                    className={cn(
                                        'relative z-10 rounded-full bg-card transition-shadow duration-300',
                                        cfg.avatarSize,
                                        cfg.ring,
                                        isFirst && 'animate-pulse-glow-amber',
                                    )}
                                >
                                    <AvatarImage src={avatarUrl} alt={seller.user.name} className="object-cover" />
                                    <AvatarFallback className={cn(
                                        'font-bold',
                                        isFirst ? 'bg-amber-400/20 text-amber-300 text-sm' : 'bg-secondary/20 text-secondary-foreground text-xs',
                                    )}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    'absolute -bottom-2 left-1/2 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black',
                                    cfg.rankBadgeBg,
                                )}>
                                    #{cfg.rank}
                                </div>
                            </div>

                            {/* Name + Revenue */}
                            <div className="mb-3 mt-1 text-center">
                                <p className={cn('max-w-[96px] truncate text-sm font-bold', cfg.nameColor)}>{firstName}</p>
                                <p className={cn('text-xs font-black tabular-nums', cfg.revenueColor)}>{BRL.format(revenue)}</p>
                            </div>

                            {/* Podium bar */}
                            <motion.div
                                className={cn(
                                    'relative flex w-24 items-center justify-center overflow-hidden rounded-t-xl border bg-gradient-to-t',
                                    cfg.barGradient,
                                    cfg.barBorder,
                                )}
                                initial={{ height: 0 }}
                                animate={{ height: cfg.barH }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.2 }}
                            >
                                {/* Shine sweep on 1st bar */}
                                {isFirst && (
                                    <motion.div
                                        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                                        animate={{ x: [-40, 140] }}
                                        transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', repeatDelay: 2 }}
                                    />
                                )}
                                <span className={cn('text-3xl font-black opacity-40', cfg.digitColor)}>{cfg.rank}</span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
