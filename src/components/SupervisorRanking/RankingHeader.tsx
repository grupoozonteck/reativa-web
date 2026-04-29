import { Crown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RankingHeaderProps {
    isFetching: boolean;
    onRefresh: () => void;
}

export function RankingHeader({ isFetching, onRefresh }: RankingHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
            <div>
                <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-amber-500" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Ranking de Supervisores</h1>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Compare receita, vendas, reengajamentos e conversao entre os supervisores.
                </p>
            </div>

            <Button
                onClick={onRefresh}
                disabled={isFetching}
                className="gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
                <RefreshCcw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
                {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Button>
        </div>
    );
}
