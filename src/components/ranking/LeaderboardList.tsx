import { Medal, DollarSign, TrendingUp, Users } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay: number = 0) => ({
        opacity: 1, y: 0,
        transition: { type: 'spring' as const, damping: 22, stiffness: 260, delay },
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

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

interface LeaderboardListProps {
    sellers: LeaderboardEntry[];
}

export function LeaderboardList({ sellers }: LeaderboardListProps) {
    const maxRevenue = Math.max(...sellers.map(s => Number(s.revenue ?? 0)), 1);

    return (
        <motion.div
            className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-5"
            variants={fadeUp} initial="hidden" animate="show" custom={0.32}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Medal className="w-3.5 h-3.5 text-blue-400" />
                    Leaderboard Completo
                </h3>
                <span className="text-[10px] text-muted-foreground">{sellers.length} participantes</span>
            </div>

            <motion.div
                className="space-y-2"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >
                {sellers.map((s, i) => {
                    const revenue = Number(s.revenue ?? 0);
                    const revenuePct = Math.round((revenue / maxRevenue) * 100);
                    const initials = getInitials(s.user.name);
                    const avatarUrl = s.user.personal_data?.avatar ?? undefined;

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
                                <Avatar
                                    className={cn(
                                        'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white',
                                        i === 0 ? 'from-amber-400 to-yellow-500' :
                                            i === 1 ? 'from-slate-300 to-slate-500' :
                                                i === 2 ? 'from-amber-600 to-amber-800' :
                                                    'from-slate-600 to-slate-700'
                                    )}
                                >
                                    <AvatarImage src={avatarUrl} alt={s.user.name} className="object-cover" />
                                    <AvatarFallback className="bg-transparent text-inherit font-inherit">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Nome + barra de receita */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold truncate">{s.user.name.split(' ')[0]}</span>
                                    <span className="text-[9px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded font-medium">
                                        {s.graduation_label}
                                    </span>
                                    <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-medium hidden sm:inline">
                                        {s.level}
                                    </span>
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
                                            animate={{ width: `${revenuePct}%` }}
                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.05 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stats desktop */}
                            <div className="hidden sm:flex items-center gap-4 shrink-0">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-center">
                                        <TrendingUp className="w-2.5 h-2.5" /> Vendas
                                    </p>
                                    <p className="text-sm font-bold tabular-nums">{s.sales}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-center">
                                        <Users className="w-2.5 h-2.5" /> Conv.
                                    </p>
                                    <p className="text-sm font-bold tabular-nums">{s.conversion}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                                        <DollarSign className="w-2.5 h-2.5" /> Receita
                                    </p>
                                    <p className={cn('text-sm font-black tabular-nums', i === 0 ? 'text-amber-400' : 'text-foreground')}>
                                        {BRL.format(revenue)}
                                    </p>
                                </div>
                            </div>

                            {/* Stats mobile */}
                            <div className="sm:hidden shrink-0 text-right">
                                <p className={cn('text-xs font-black tabular-nums', i === 0 ? 'text-amber-400' : 'text-foreground')}>
                                    {BRL.format(revenue)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{s.sales} vendas</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
