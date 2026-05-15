import { Building2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ManagerHeaderProps {
    isFetching: boolean;
    onRefresh: () => void;
}

export function ManagerHeader({ isFetching, onRefresh }: ManagerHeaderProps) {
    return (
        <div className="solid-card animate-fade-in overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-300">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Manager performance
                            </p>
                            <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
                                Visao geral da operacao
                            </h1>
                        </div>
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                        Acompanhe supervisores, compare conversao e identifique
                        rapidamente onde a operacao precisa de apoio.
                    </p>
                </div>

                <Button
                    onClick={onRefresh}
                    disabled={isFetching}
                    className="h-11 gap-2 self-start bg-indigo-600 px-4 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:self-auto"
                >
                    <RefreshCcw
                        className={cn('h-4 w-4', isFetching && 'animate-spin')}
                    />
                    {isFetching ? 'Atualizando...' : 'Atualizar dados'}
                </Button>
            </div>
        </div>
    );
}
