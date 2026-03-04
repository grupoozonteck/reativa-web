import { useEffect, useRef, useState } from 'react';
import {
    Trophy, Flame, Zap, Target, Star, CheckCircle2, Lock, Clock,
    TrendingUp, RefreshCw, DollarSign, Gem, Handshake,
    Medal, ArrowUp, ArrowDown, Minus, type LucideIcon,
} from 'lucide-react';
import {
    motion, useMotionValue, useTransform,
    animate as frameAnimate, useInView, type Variants,
} from 'framer-motion';
import { teamMembers } from '@/data/mock';
import {
    monthlyGoals,
    activeMissions,
    badges,
    recentAchievements,
    currentSellerStats,
} from '@/data/gamification';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/* ─────────────────────────────────────────────────────────────────────────── */
/* Variantes reutilizáveis                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay: number = 0) => ({
        opacity: 1, y: 0,
        transition: { type: 'spring' as const, damping: 22, stiffness: 260, delay },
    }),
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.72 },
    show: (delay: number = 0) => ({
        opacity: 1, scale: 1,
        transition: { type: 'spring' as const, damping: 18, stiffness: 320, delay },
    }),
};

const staggerContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const rowItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, damping: 22, stiffness: 260 } },
};



/* ─────────────────────────────────────────────────────────────────────────── */
/* Contador de número animado                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

function AnimatedNumber({
    value,
    currency = false,
    suffix = '',
    decimals = 0,
    className,
    duration = 1.6,
}: {
    value: number;
    currency?: boolean;
    suffix?: string;
    decimals?: number;
    className?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionVal = useMotionValue(0);
    const formatted = useTransform(motionVal, (v) => {
        if (currency) return BRL.format(v);
        if (decimals === 0) return `${NUM.format(Math.round(v))}${suffix}`;
        return `${v.toFixed(decimals)}${suffix}`;
    });
    const inView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (!inView) return;
        const ctrl = frameAnimate(motionVal, value, { duration, ease: [0.22, 1, 0.36, 1] });
        return () => ctrl.stop();
    }, [inView, value, duration, motionVal]);

    return (
        <motion.span ref={ref} className={className}>
            {formatted}
        </motion.span>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Mapa de ícones                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
    Target, Flame, Zap, RefreshCw, Trophy, DollarSign, Gem, Handshake,
    TrendingUp, CheckCircle2, Star, Medal, ArrowUp,
};
function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] ?? Star;
    return <Icon className={className} />;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Partícula flutuante (decoração do campeão)                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function ChampionParticle({ i }: { i: number }) {
    const angle = (i / 8) * 360;
    const radius = 54 + (i % 3) * 14;
    const size = 3 + (i % 3);
    const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#06b6d4', '#fdba74'];
    const color = colors[i % colors.length];
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size, height: size,
                background: color,
                boxShadow: `0 0 ${size * 2}px ${color}`,
                top: '50%', left: '50%',
            }}
            animate={{
                x: [
                    Math.cos((angle * Math.PI) / 180) * radius,
                    Math.cos(((angle + 60) * Math.PI) / 180) * (radius + 10),
                    Math.cos((angle * Math.PI) / 180) * radius,
                ],
                y: [
                    Math.sin((angle * Math.PI) / 180) * radius,
                    Math.sin(((angle + 60) * Math.PI) / 180) * (radius + 10),
                    Math.sin((angle * Math.PI) / 180) * radius,
                ],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.3, 1],
            }}
            transition={{
                duration: 2.4 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Progress Ring animado                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function ProgressRing({ value, size = 140, stroke = 10, color = 'cyan', children }: {
    value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const gradientId = `ring-${color}-${size}`;
    const colorMap: Record<string, [string, string]> = {
        cyan: ['#06b6d4', '#14b8a6'],
        amber: ['#f59e0b', '#eab308'],
        emerald: ['#10b981', '#06b6d4'],
    };
    const [c1, c2] = colorMap[color] ?? colorMap.cyan;
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: '-40px' });

    return (
        <div ref={containerRef} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={c1} />
                        <stop offset="100%" stopColor={c2} />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: inView ? offset : circumference }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Delta de posição                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
function RankDelta({ delta }: { delta: number }) {
    if (delta > 0) return (
        <motion.span
            className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.6 }}
        >
            <ArrowUp className="w-2.5 h-2.5" />{delta}
        </motion.span>
    );
    if (delta < 0) return (
        <motion.span
            className="flex items-center gap-0.5 text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.6 }}
        >
            <ArrowDown className="w-2.5 h-2.5" />{Math.abs(delta)}
        </motion.span>
    );
    return <Minus className="w-3 h-3 text-muted-foreground/30" />;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Configuração do Pódio                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const PODIUM_ORDER = [1, 0, 2];
/* Delays pré-calculados do shimmer das barras (vi = 0,1,2) */
const SHIMMER_DELAYS = [0.4, 1.3, 0.7];
const PODIUM_CFG = [
    { rank: '2', heightPx: 96, barGrad: 'from-slate-400 to-slate-500', avatarGrad: 'from-slate-300 to-slate-500 shadow-slate-500/20', avatarSize: 'w-16 h-16 text-base', label: 'text-slate-300', delay: 0.25 },
    { rank: '1', heightPx: 144, barGrad: 'from-amber-400 to-yellow-500', avatarGrad: 'from-amber-300 to-yellow-500 shadow-amber-500/40', avatarSize: 'w-24 h-24 text-2xl', label: 'text-amber-300', delay: 0.1 },
    { rank: '3', heightPx: 64, barGrad: 'from-amber-700 to-amber-800', avatarGrad: 'from-amber-600 to-amber-800 shadow-amber-700/20', avatarSize: 'w-14 h-14 text-sm', label: 'text-amber-700', delay: 0.38 },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* PÁGINA PRINCIPAL                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Ranking() {
    const sellers = [...teamMembers]
        .filter(m => m.role === 'atendente')
        .sort((a, b) => b.salesValue - a.salesValue);

    const salesPct = Math.round((monthlyGoals.salesCurrent / monthlyGoals.salesTarget) * 100);
    const closingsPct = Math.round((monthlyGoals.closingsCurrent / monthlyGoals.closingsTarget) * 100);
    const xpPct = Math.round((currentSellerStats.xp / currentSellerStats.xpMax) * 100);
    const unlockedBadges = badges.filter(b => b.unlocked).length;
    const maxXp = Math.max(...sellers.map(s => s.xp));

    /* Pulse "AO VIVO" */
    const [livePulse, setLivePulse] = useState(true);
    useEffect(() => {
        const id = setInterval(() => setLivePulse(p => !p), 900);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="p-6 space-y-5 max-w-7xl mx-auto">

            {/* ═══ Top bar ═══ */}
            <motion.div
                className="glass-card rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3"
                variants={fadeUp} initial="hidden" animate="show" custom={0}
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                        whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Trophy className="w-5 h-5 text-amber-900" />
                    </motion.div>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight">Arena de Vendas</h1>
                        <p className="text-[10px] text-muted-foreground">Ciclo mensal — Março 2026</p>
                    </div>
                </div>

                {/* XP bar */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                        <motion.div
                            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        >
                            <Zap className="w-3.5 h-3.5 text-blue-400" />
                        </motion.div>
                        <span className="font-bold text-blue-400 tracking-wide">NÍVEL {currentSellerStats.level}</span>
                    </div>
                    <div className="w-44 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpPct}%` }}
                            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
                            {/* Shimmer */}
                            <motion.div
                                className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '400%'] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', delay: 2 }}
                            />
                        </motion.div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                        {currentSellerStats.xp} / {currentSellerStats.xpMax} XP
                    </span>
                </div>

                {/* Streak + conv */}
                <motion.div className="flex items-center gap-2" variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
                    <motion.div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/15"
                        whileHover={{ scale: 1.06 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                        >
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                        </motion.div>
                        <span className="text-xs font-bold text-orange-400">{currentSellerStats.streak}d</span>
                        <span className="text-[10px] text-muted-foreground">streak</span>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15"
                        whileHover={{ scale: 1.06 }}
                    >
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{currentSellerStats.winRate}%</span>
                        <span className="text-[10px] text-muted-foreground">conv.</span>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ═══ Pódio ═══ */}
            <motion.div
                className="glass-card rounded-2xl p-6 relative overflow-hidden"
                variants={fadeUp} initial="hidden" animate="show" custom={0.08}
            >
                {/* Linha topo + glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent pointer-events-none"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />

                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-8 flex items-center justify-center gap-2">
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

                <div className="flex items-end justify-center gap-6">
                    {PODIUM_ORDER.map((sellerIdx, vi) => {
                        const seller = sellers[sellerIdx];
                        const cfg = PODIUM_CFG[vi];
                        if (!seller) return null;
                        const isFirst = sellerIdx === 0;

                        return (
                            <motion.div
                                key={seller.id}
                                className="flex flex-col items-center gap-3"
                                variants={scaleIn}
                                initial="hidden"
                                animate="show"
                                custom={cfg.delay}
                            >
                                {/* Badge MVP */}
                                {isFirst && (
                                    <motion.div
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 mb-1"
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                                    >
                                        <Star className="w-3 h-3 text-amber-400" />
                                        <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">MVP do Mês</span>
                                    </motion.div>
                                )}

                                {/* Avatar */}
                                <div className="relative">
                                    {/* Partículas do campeão */}
                                    {isFirst && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {Array.from({ length: 8 }).map((_, pi) => (
                                                <ChampionParticle key={pi} i={pi} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Glow pulsante */}
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
                                        {seller.avatar}
                                    </motion.div>

                                    {/* Streak badge */}
                                    {seller.streak >= 3 && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center z-20 shadow-md shadow-orange-500/40"
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, delay: cfg.delay + 0.3 }}
                                        >
                                            <Flame className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <p className={cn('text-sm font-bold', cfg.label)}>{seller.name.split(' ')[0]}</p>
                                    <AnimatedNumber
                                        value={seller.salesValue}
                                        currency
                                        duration={1.8}
                                        className={cn('font-black tabular-nums', isFirst ? 'text-2xl text-amber-300' : 'text-lg', cfg.label)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">{seller.salesCount} vendas</p>
                                    {/* XP mini bar */}
                                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden mt-1.5 mx-auto">
                                        <motion.div
                                            className={cn('h-full rounded-full', isFirst
                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                                : 'bg-gradient-to-r from-slate-400 to-slate-500')}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.round((seller.xp / maxXp) * 100)}%` }}
                                            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.4 }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-muted-foreground mt-0.5">
                                        {seller.xp.toLocaleString()} XP · Nv.{seller.level}
                                    </p>
                                </div>

                                {/* Barra pódio — cresce de baixo */}
                                <motion.div
                                    className={cn(
                                        'w-28 rounded-t-2xl flex items-center justify-center bg-gradient-to-t relative overflow-hidden',
                                        cfg.barGrad
                                    )}
                                    initial={{ height: 0 }}
                                    animate={{ height: cfg.heightPx }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: cfg.delay + 0.15 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    {/* Shimmer na barra */}
                                    <motion.div
                                        className="absolute inset-x-0 h-10 bg-gradient-to-b from-white/15 to-transparent"
                                        animate={{ y: [-40, cfg.heightPx + 10] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', delay: SHIMMER_DELAYS[vi] }}
                                    />
                                    <span className="text-3xl font-black text-white/70 relative z-10">{cfg.rank}</span>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ═══ Leaderboard + Lateral ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Lista completa */}
                <motion.div
                    className="lg:col-span-2 glass-card rounded-2xl p-5"
                    variants={fadeUp} initial="hidden" animate="show" custom={0.32}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Medal className="w-3.5 h-3.5 text-blue-400" />
                            Leaderboard Completo
                        </h3>
                        <span className="text-[10px] text-muted-foreground">Março 2026</span>
                    </div>

                    <motion.div
                        className="space-y-2"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                    >
                        {sellers.map((s, i) => {
                            const xpPctBar = Math.round((s.xp / maxXp) * 100);
                            const rankStyle = i === 0
                                ? 'text-amber-400 font-black text-xl'
                                : i === 1
                                    ? 'text-slate-300 font-black text-xl'
                                    : i === 2
                                        ? 'text-amber-700 font-black text-xl'
                                        : 'text-muted-foreground font-bold text-base';

                            const rowBg = i === 0
                                ? 'bg-amber-500/[0.05] border-amber-500/15 hover:border-amber-500/30'
                                : i <= 2
                                    ? 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
                                    : 'bg-transparent border-transparent hover:bg-white/[0.02]';

                            return (
                                <motion.div
                                    key={s.id}
                                    variants={rowItem}
                                    className={cn('flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors', rowBg)}
                                    whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                                >
                                    {/* Posição */}
                                    <motion.div
                                        className={cn('w-7 text-center tabular-nums shrink-0', rankStyle)}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 400, delay: 0.35 + i * 0.06 }}
                                    >
                                        {i < 3 ? ['1', '2', '3'][i] : `${i + 1}`}
                                    </motion.div>

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className={cn(
                                            'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white',
                                            i === 0 ? 'from-amber-400 to-yellow-500' :
                                                i === 1 ? 'from-slate-300 to-slate-500' :
                                                    i === 2 ? 'from-amber-600 to-amber-800' :
                                                        'from-slate-600 to-slate-700'
                                        )}>
                                            {s.avatar}
                                        </div>
                                        {s.streak >= 3 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                                <Flame className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Nome + XP bar */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold truncate">{s.name.split(' ')[0]}</span>
                                            <span className="text-[9px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded font-medium">
                                                Nv.{s.level}
                                            </span>
                                            {s.streak >= 5 && (
                                                <motion.span
                                                    className="text-[9px] text-orange-400 font-bold flex items-center gap-0.5"
                                                    animate={{ scale: [1, 1.15, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1.4 }}
                                                >
                                                    <Flame className="w-2.5 h-2.5" />{s.streak}d
                                                </motion.span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={cn(
                                                        'h-full rounded-full',
                                                        i === 0
                                                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                                            : 'bg-gradient-to-r from-blue-500 to-blue-400'
                                                    )}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${xpPctBar}%` }}
                                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.05 }}
                                                />
                                            </div>
                                            <span className="text-[9px] text-muted-foreground tabular-nums shrink-0">{s.xp.toLocaleString()} xp</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                                        <div className="text-center">
                                            <p className="text-[10px] text-muted-foreground">Vendas</p>
                                            <p className="text-sm font-bold tabular-nums">{s.salesCount}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-muted-foreground">Conv.</p>
                                            <p className="text-sm font-bold tabular-nums">{s.conversionRate}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground">Receita</p>
                                            <p className={cn('text-sm font-black tabular-nums', i === 0 ? 'text-amber-400' : 'text-foreground')}>
                                                {BRL.format(s.salesValue)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delta */}
                                    <div className="shrink-0 w-10 flex justify-center">
                                        <RankDelta delta={s.rankDelta} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>

                {/* Coluna direita */}
                <div className="flex flex-col gap-4">

                    {/* Meta mensal */}
                    <motion.div
                        className="glass-card rounded-2xl p-5 flex flex-col items-center"
                        variants={fadeUp} initial="hidden" animate="show" custom={0.42}
                    >
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 self-start flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-blue-400" /> Meta Mensal
                        </h3>
                        <ProgressRing value={salesPct} size={120} stroke={9} color="cyan">
                            <AnimatedNumber
                                value={salesPct}
                                suffix="%"
                                className="text-2xl font-black text-blue-400"
                                duration={1.8}
                            />
                            <span className="text-[9px] text-muted-foreground">completo</span>
                        </ProgressRing>
                        <AnimatedNumber
                            value={monthlyGoals.salesCurrent}
                            currency
                            className="text-base font-black mt-3"
                            duration={1.8}
                        />
                        <p className="text-[10px] text-muted-foreground mt-0.5 text-center">
                            Faltam <span className="text-blue-400 font-semibold">R$ {monthlyGoals.bonusThreshold.toLocaleString('pt-BR')}</span> para o bônus
                        </p>
                        <div className="w-full mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2">
                            <div className="text-center">
                                <AnimatedNumber
                                    value={closingsPct}
                                    suffix="%"
                                    className="text-sm font-black text-emerald-400"
                                    duration={1.6}
                                />
                                <p className="text-[9px] text-muted-foreground">conversão</p>
                            </div>
                            <div className="text-center">
                                <AnimatedNumber
                                    value={monthlyGoals.closingsCurrent}
                                    className="text-sm font-black"
                                    duration={1.6}
                                />
                                <p className="text-[9px] text-muted-foreground">fechamentos</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Missões ativas */}
                    <motion.div
                        className="glass-card rounded-2xl p-5 flex-1"
                        variants={fadeUp} initial="hidden" animate="show" custom={0.52}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-amber-400" /> Missões
                            </h3>
                            <Badge variant="outline" className="text-[9px] px-1.5 border-blue-500/20 text-blue-400">
                                {activeMissions.filter(m => !m.completed).length} ativas
                            </Badge>
                        </div>
                        <div className="space-y-3">
                            {activeMissions.map((m, mi) => (
                                <motion.div
                                    key={m.id}
                                    className={cn(
                                        'rounded-xl p-3 border transition-all',
                                        m.completed
                                            ? 'bg-emerald-500/[0.05] border-emerald-500/15'
                                            : 'bg-white/[0.02] border-white/[0.05] hover:border-blue-500/15'
                                    )}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + mi * 0.09, type: 'spring', damping: 22, stiffness: 260 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <p className="text-xs font-semibold flex items-center gap-1.5">
                                            {m.completed && (
                                                <motion.div
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500 }}
                                                >
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                                </motion.div>
                                            )}
                                            {m.title}
                                        </p>
                                        <motion.span
                                            className="text-[10px] font-bold text-blue-400 shrink-0"
                                            animate={m.completed ? {} : { opacity: [1, 0.5, 1] }}
                                            transition={{ repeat: Infinity, duration: 2.2 }}
                                        >
                                            +{m.xpReward} XP
                                        </motion.span>
                                    </div>
                                    {!m.completed && (
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 relative"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${m.progress}%` }}
                                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 + mi * 0.1 }}
                                            >
                                                <motion.div
                                                    className="absolute inset-y-0 w-4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                                    animate={{ x: ['-100%', '400%'] }}
                                                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 1.5 + mi * 0.3 }}
                                                />
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ Conquistas + Badges ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Conquistas recentes */}
                <motion.div
                    className="glass-card rounded-2xl p-5"
                    variants={fadeUp} initial="hidden" animate="show" custom={0.6}
                >
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-blue-400" /> Conquistas Recentes
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {recentAchievements.map((a, ai) => (
                            <motion.div
                                key={a.id}
                                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + ai * 0.08, type: 'spring', damping: 22, stiffness: 280 }}
                                whileHover={{ scale: 1.03, borderColor: 'rgba(6,182,212,0.15)' }}
                            >
                                <motion.div
                                    className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0"
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <DynamicIcon name={a.iconName} className="w-4 h-4 text-blue-400" />
                                </motion.div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-snug">
                                        <span className="text-muted-foreground">{a.text} </span>
                                        <span className="text-blue-400 font-semibold">{a.highlight}</span>
                                    </p>
                                    <p className="text-[9px] text-muted-foreground/50 flex items-center gap-1 mt-1">
                                        <Clock className="w-2.5 h-2.5" /> {a.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Badges */}
                <motion.div
                    className="glass-card rounded-2xl p-5"
                    variants={fadeUp} initial="hidden" animate="show" custom={0.68}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Gem className="w-3.5 h-3.5 text-amber-400" /> Badges
                        </h3>
                        <span className="text-[10px] text-muted-foreground">{unlockedBadges}/{badges.length} desbloqueadas</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                        {badges.map((b, bi) => (
                            <motion.div
                                key={b.id}
                                className={cn(
                                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors',
                                    b.unlocked
                                        ? 'bg-white/[0.03] border-white/[0.07] cursor-default'
                                        : 'bg-white/[0.01] border-white/[0.03] opacity-30 grayscale'
                                )}
                                title={b.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: b.unlocked ? 1 : 0.3, scale: 1 }}
                                transition={{ delay: 0.8 + bi * 0.05, type: 'spring', stiffness: 360, damping: 18 }}
                                whileHover={b.unlocked ? { scale: 1.12, y: -3 } : {}}
                            >
                                <motion.div
                                    className={cn('w-9 h-9 rounded-xl flex items-center justify-center', b.unlocked ? 'bg-blue-500/10' : 'bg-white/5')}
                                    animate={b.unlocked ? { boxShadow: ['0 0 0px rgba(6,182,212,0)', '0 0 10px rgba(6,182,212,0.25)', '0 0 0px rgba(6,182,212,0)'] } : {}}
                                    transition={{ repeat: Infinity, duration: 3, delay: bi * 0.4 }}
                                >
                                    <DynamicIcon name={b.iconName} className={cn('w-4 h-4', b.unlocked ? 'text-blue-400' : 'text-muted-foreground')} />
                                </motion.div>
                                <span className="text-[8px] text-center leading-tight font-medium text-muted-foreground">{b.label}</span>
                                {!b.unlocked && <Lock className="w-2.5 h-2.5 text-muted-foreground/40" />}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
