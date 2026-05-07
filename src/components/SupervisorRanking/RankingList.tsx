import { Award, BarChart3, CircleDollarSign, Headphones, Loader2, ShoppingCart, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { type SupervisorRankingEntry } from '@/services/team.service';
import { formatCurrency, getAvatarColor, getInitials } from '@/utils/client-utils';

interface RankingListProps {
    supervisors: SupervisorRankingEntry[];
    isLoading: boolean;
    isFetching: boolean;
}

function RankingRowSkeleton() {
    return (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex items-center gap-3 lg:w-[320px]">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

function RankBadge({ position }: { position: number }) {
    const styles = [
        'bg-amber-500 text-slate-950',
        'bg-slate-300 text-slate-900',
        'bg-orange-500 text-white',
    ];

    return (
        <div
            className={cn(
                'flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black',
                styles[position - 1] ?? 'bg-primary/10 text-primary',
            )}
        >
            #{position}
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    highlight = false,
}: {
    icon: typeof ShoppingCart;
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className={cn('rounded-xl border border-border/60 bg-muted/30 p-3', highlight && 'bg-emerald-500/5')}>
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
            </div>
            <p className={cn('text-lg font-bold tabular-nums', highlight && 'text-emerald-600 dark:text-emerald-400')}>
                {value}
            </p>
        </div>
    );
}

export function RankingList({ supervisors, isLoading, isFetching }: RankingListProps) {
    return (
        <div className="solid-card overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Classificacao</h2>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300"
                        >
                            {supervisors.length}
                        </Badge>
                    )}
                </div>
                {isFetching && !isLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Atualizando...
                    </div>
                )}
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <RankingRowSkeleton key={index} />
                        ))}
                    </div>
                ) : supervisors.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <Award className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">Nenhum supervisor encontrado no ranking</p>
                    </div>
                ) : (
                    <div className={cn('space-y-3 transition-opacity duration-200', isFetching && 'opacity-50')}>
                        {supervisors.map((supervisor, index) => (
                            <div
                                key={supervisor.id}
                                className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                    <div className="flex items-center gap-3 lg:w-[340px]">
                                        <RankBadge position={index + 1} />
                                        <div
                                            className={cn(
                                                'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white',
                                                getAvatarColor(supervisor.user.name),
                                            )}
                                        >
                                            {getInitials(supervisor.user.name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-bold">{supervisor.user.name}</p>
                                                <Badge variant="outline" className="hidden sm:inline-flex">
                                                    {supervisor.level}
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                                <span className="inline-flex items-center gap-1">
                                                    <UserRound className="h-3.5 w-3.5" />@{supervisor.user.login}
                                                </span>
                                                {supervisor.type_label && <span>{supervisor.type_label}</span>}
                                                {supervisor.graduation_label && <span>{supervisor.graduation_label}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                                        <MetricCard icon={ShoppingCart} label="Vendas" value={supervisor.sales} />
                                        <MetricCard
                                            icon={Headphones}
                                            label="Atendimentos"
                                            value={supervisor.total_reengagements}
                                        />
                                        <MetricCard
                                            icon={BarChart3}
                                            label="Conversão"
                                            value={`${supervisor.conversion}%`}
                                        />
                                        <MetricCard
                                            icon={CircleDollarSign}
                                            label="Receita"
                                            value={formatCurrency(supervisor.revenue)}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
