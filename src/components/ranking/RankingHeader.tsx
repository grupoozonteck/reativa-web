import { RefreshCw, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RankingHeaderProps {
    participants: number;
    totalRevenue: number;
    isFetching: boolean;
    onRefresh: () => void;
}

export function RankingHeader({ participants, isFetching, onRefresh }: RankingHeaderProps) {
    return (
        <motion.div
            className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight leading-none">
                        Ranking{' '}
                        <span className="gradient-text">de Performance</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            Ao vivo
                        </span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="text-xs text-muted-foreground">{participants} competidores</span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                            <Zap className="w-3 h-3" />
                            Mês atual
                        </span>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0"
                disabled={isFetching}
                onClick={onRefresh}
            >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Button>
        </motion.div>
    );
}
