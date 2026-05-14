import { BarChart2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PerformanceHeaderProps {
    isFetching: boolean;
    onRefresh: () => void;
}

export function PerformanceHeader({
    isFetching,
    onRefresh,
}: PerformanceHeaderProps) {
    return (
        <div className="flex items-center justify-between animate-fade-in flex-col sm:flex-row gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Desempenho da Equipe
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5 hidden sm:block">
                    Acompanhe as métricas dos membros da sua equipe
                </p>
            </div>
            <Button
                onClick={onRefresh}
                disabled={isFetching}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-2"
            >
                <RefreshCcw
                    className={cn('w-4 h-4', isFetching && 'animate-spin')}
                />
                {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Button>
        </div>
    );
}
