import { Target, TrendingUp, DollarSign, Users } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';
import type { LeaderboardEntry } from './types';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay: number = 0) => ({
        opacity: 1, y: 0,
        transition: { type: 'spring' as const, damping: 22, stiffness: 260, delay },
    }),
};

interface RankingStatsProps {
    sellers: LeaderboardEntry[];
}

export function RankingStats({ sellers }: RankingStatsProps) {
    const totalSales = sellers.reduce((acc, s) => acc + s.sales, 0);
    const totalRevenue = sellers.reduce((acc, s) => acc + Number(s.revenue ?? 0), 0);
    const totalReengagements = sellers.reduce((acc, s) => acc + s.total_reengagements, 0);
    const avgConversion = sellers.length > 0
        ? Math.round(sellers.reduce((acc, s) => acc + s.conversion, 0) / sellers.length)
        : 0;

    return (
        <motion.div
            className="glass-card rounded-2xl p-4 sm:p-5"
            variants={fadeUp} initial="hidden" animate="show" custom={0.42}
        >
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-blue-400" /> Resumo da Equipe
            </h3>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <AnimatedNumber
                        value={totalRevenue}
                        currency
                        className="text-sm sm:text-base font-black text-emerald-400 block"
                        duration={1.8}
                    />
                    <p className="text-[9px] text-muted-foreground mt-0.5">Receita Total</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <AnimatedNumber
                        value={totalSales}
                        className="text-sm sm:text-base font-black block"
                        duration={1.6}
                    />
                    <p className="text-[9px] text-muted-foreground mt-0.5">Vendas Totais</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <Target className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <AnimatedNumber
                        value={avgConversion}
                        suffix="%"
                        className="text-sm sm:text-base font-black text-amber-400 block"
                        duration={1.6}
                    />
                    <p className="text-[9px] text-muted-foreground mt-0.5">Conv. Média</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <AnimatedNumber
                        value={totalReengagements}
                        className="text-sm sm:text-base font-black text-purple-400 block"
                        duration={1.6}
                    />
                    <p className="text-[9px] text-muted-foreground mt-0.5">Reengajamentos</p>
                </div>
            </div>
        </motion.div>
    );
}
