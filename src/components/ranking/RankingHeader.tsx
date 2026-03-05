import { Trophy, Users, DollarSign, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from './AnimatedNumber';

interface RankingHeaderProps {
    participants: number;
    totalRevenue: number;
    isFetching: boolean;
    onRefresh: () => void;
}

export function RankingHeader({ participants, totalRevenue, isFetching, onRefresh }: RankingHeaderProps) {
    return (
        <motion.div
            className="glass-card rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Trophy className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                    <h1 className="text-lg font-extrabold tracking-tight">Arena de Vendas</h1>
                    <p className="text-[10px] text-muted-foreground">Ranking em tempo real</p>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-muted-foreground">Participantes:</span>
                <span className="text-xs font-bold text-blue-400 tabular-nums">{participants}</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-muted-foreground">Receita total:</span>
                    <AnimatedNumber
                        value={totalRevenue}
                        currency
                        className="font-bold text-emerald-400 tabular-nums"
                        duration={1.4}
                    />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="h-8 border-white/10 hover:border-blue-500/20"
                >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                    Atualizar
                </Button>
            </div>
        </motion.div>
    );
}
