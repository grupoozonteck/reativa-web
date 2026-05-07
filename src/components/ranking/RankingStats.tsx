import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';
import { formatCurrency } from '@/utils/client-utils';

interface RankingStatsProps {
    summary?: {
        total_revenue: number;
        total_sales: number;
        total_reengagements: number;
        conversion_percentage: number;
    };
}

export function RankingStats({ summary }: RankingStatsProps) {
    if (!summary) return null;

    return (
        <motion.div
            className="solid-card overflow-hidden rounded-2xl border-l-2 border-l-primary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.1 }}
        >
            <div className="border-b border-border/60 px-5 pb-3 pt-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Resumo da Equipe
                </p>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <p className="mb-1 text-xs text-muted-foreground">Receita Total</p>
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="text-4xl font-black leading-none text-foreground">
                                {formatCurrency(summary.total_revenue)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/60" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="mb-1 text-xs text-muted-foreground">Vendas Totais</p>
                        <AnimatedNumber
                            value={summary.total_sales}
                            duration={1.4}
                            className="text-2xl font-black text-foreground"
                        />
                    </div>
                    <div>
                        <p className="mb-1 text-xs text-muted-foreground">Conv. Media</p>
                        <AnimatedNumber
                            value={summary.conversion_percentage}
                            suffix="%"
                            duration={1.4}
                            className="text-2xl font-black text-secondary"
                        />
                    </div>
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="mb-1 text-xs text-muted-foreground">Atendimentos</p>
                        <AnimatedNumber
                            value={summary.total_reengagements}
                            duration={1.4}
                            className="text-2xl font-black text-foreground"
                        />
                    </div>
                    <div className="rounded-xl border border-accent/20 bg-accent/10 p-2">
                        <RefreshCw className="h-5 w-5 text-accent" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
