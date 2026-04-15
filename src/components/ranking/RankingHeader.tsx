import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RankingHeaderProps {
    participants: number;
    totalRevenue: number;
    isFetching: boolean;
    onRefresh: () => void;
}

export function RankingHeader({ isFetching, onRefresh }: RankingHeaderProps) {
    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">
                    Ranking de Performance
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="default"
                    className="text-muted"
                    disabled={isFetching}
                    onClick={onRefresh}
                >
                    <RefreshCw className={ `h-4 w-4 ${isFetching && 'animate-spin'}`} />
                    {isFetching ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </div>
        </div>
    );
}
