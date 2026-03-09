import { Building2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ManagerHeaderProps {
    isFetching: boolean;
    onRefresh: () => void;
}

export function ManagerHeader({ isFetching, onRefresh }: ManagerHeaderProps) {
    return (
        <div className="flex items-center justify-between animate-fade-in flex-col sm:flex-row gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Visão Geral da Operação</h1>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5 hidden sm:block">
                    Acompanhe o desempenho de todos os supervisores e suas equipes
                </p>
            </div>
            <Button
                onClick={onRefresh}
                disabled={isFetching}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white gap-2"
            >
                <RefreshCcw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
                {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Button>
        </div>
    );
}
