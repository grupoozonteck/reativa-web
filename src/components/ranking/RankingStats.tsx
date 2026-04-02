import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';

interface RankingStatsProps {
    summary?: {
        total_revenue: number;
        total_sales: number;
        total_reengagements: number;
        conversion_percentage: number;
    };
}

export function RankingStats( {summary} : RankingStatsProps) {
    console.log(`sumary`, summary);

    if (!summary) return null;

    return (
        <motion.div
            className="solid-card rounded-2xl overflow-hidden border-l-2 border-l-lime-400"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.1 }}
        >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-white/5">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.18em]">
                    Resumo da Equipe
                </p>
            </div>

            <div className="p-5 space-y-4">
                {/* Receita Total */}
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Receita Total</p>
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="text-base font-black text-white leading-none">R$</p>
                            <p className="text-4xl font-black text-white leading-none">
                                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(summary.total_revenue)}
                            </p>
                        </div>
                        <span className="mt-1 text-[8px] font-bold px-2 py-1 rounded bg-lime-500/20 text-lime-400 border border-lime-500/30 leading-tight">
                            +12% vs last<br />month
                        </span>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Vendas + Conv */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Vendas Totais</p>
                        <AnimatedNumber
                            value={summary.total_sales}
                            duration={1.4}
                            className="text-2xl font-black text-white"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Conv. Média</p>
                        <AnimatedNumber
                            value={summary.conversion_percentage}
                            suffix="%"
                            duration={1.4}
                            className="text-2xl font-black text-blue-400"
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Reengajamentos */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Atendimentos</p>
                        <AnimatedNumber
                            value={summary.total_reengagements}
                            duration={1.4}
                            className="text-2xl font-black text-white"
                        />
                    </div>
                    <RefreshCw className="w-6 h-6 text-pink-500" />
                </div>
            </div>
        </motion.div>
    );
}
