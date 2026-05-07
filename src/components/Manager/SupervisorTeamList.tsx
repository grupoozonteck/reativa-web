import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, getInitials } from '@/utils/client-utils';
import { type ManagerSupervisor, type ManagerAttendant } from '@/services/team.service';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function SupervisorTeamCardSkeleton() {
    return (
        <div className="solid-card overflow-hidden">
            {/* Cabeçalho do supervisor */}
            <div className="p-4 flex items-center gap-3 border-b border-border">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                </div>
            </div>
            {/* Métricas do supervisor */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-border/50">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1 text-center">
                        <Skeleton className="h-5 w-10 mx-auto" />
                        <Skeleton className="h-3 w-14 mx-auto" />
                    </div>
                ))}
            </div>
            {/* Atendentes skeleton */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border/50 p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-2.5 w-20" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <Skeleton key={j} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Attendant mini card ──────────────────────────────────────────────────────

function AttendantMiniCard({ attendant }: { attendant: ManagerAttendant }) {


    const revenue = typeof attendant.revenue === 'string'
        ? parseFloat(attendant.revenue)
        : (attendant.revenue ?? 0);

    return (
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
            {/* Nome */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(attendant.user.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{attendant.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{attendant.user.login || '—'}</p>
                </div>
                <Badge
                    variant="outline"
                    className="text-xs px-1.5 h-5 shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                >
                    {attendant.level}
                </Badge>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-border/40">
                <div>
                    <p className="text-base font-bold tabular-nums">{attendant.sales}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Reat.</p>
                </div>
                <div>
                    <p className="text-base font-bold tabular-nums">{attendant.total_reengagements}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Atend.</p>
                </div>
                <div>
                    <p className="text-base font-bold tabular-nums">{attendant.conversion}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Conv.</p>
                </div>
                <div>
                    <p className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Receita</p>
                </div>
            </div>
        </div>
    );
}

// ─── Supervisor team card ─────────────────────────────────────────────────────

export function SupervisorTeamCard({ supervisor }: { supervisor: ManagerSupervisor }) {


    const conversionPct = Math.min(supervisor.conversion, 100);
    

    return (
        <div className="solid-card overflow-hidden hover:scale-[1.005] transition-transform">
            {/* Cabeçalho do supervisor */}
            <div className="px-5 py-4 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-border flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={'/images/logos/logo-white.webp'} alt={supervisor.user.name} />
                    <AvatarFallback>
                        {getInitials(supervisor.user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-base truncate">{supervisor.user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">@{supervisor.user.login || '—'}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge
                        variant="outline"
                        className="text-xs px-2 h-5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20"
                    >
                        {supervisor.type_label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{supervisor.graduation_label}</span>
                </div>
            </div>

            {/* Métricas do supervisor */}
            <div className="grid grid-cols-5 gap-3 px-5 py-4 border-b border-border/50">
                <div className="text-center">
                    <p className="text-xl font-bold tabular-nums">{supervisor.sales}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mt-0.5">Reativaçôes</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold tabular-nums">{supervisor.total_reengagements}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mt-0.5">Atendimentos</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold tabular-nums">{supervisor.conversion}%</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mt-0.5">Conv.</p>
                </div>
              
                <div className="text-center">
                    <p className="text-xl font-bold  text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(supervisor.revenue)}
                    </p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mt-0.5">Receita</p>
                </div>
            </div>

            {/* Barra de progresso */}
            <div className="px-5 pt-3 pb-1 flex items-center gap-2">
                <Progress value={conversionPct} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-10 text-right font-medium">{supervisor.level}</span>
            </div>

            {/* Atendentes */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Atendentes
                    </span>
                    <Badge
                        variant="outline"
                        className="text-xs px-1.5 h-5 ml-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                    >
                        {supervisor.attendants.length}
                    </Badge>
                </div>

                {supervisor.attendants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        Nenhum atendente nesta equipe
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {supervisor.attendants.map(attendant => (
                            <AttendantMiniCard key={attendant.id} attendant={attendant} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Lista de supervisores ────────────────────────────────────────────────────

interface SupervisorTeamListProps {
    supervisors: ManagerSupervisor[];
    isLoading: boolean;
    isFetching: boolean;
}

export function SupervisorTeamList({ supervisors, isLoading, isFetching }: SupervisorTeamListProps) {
    return (
        <div className="solid-card">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Supervisores e Equipes</h2>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20"
                        >
                            {supervisors.length}
                        </Badge>
                    )}
                </div>
                {isFetching && !isLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Atualizando...
                    </div>
                )}
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SupervisorTeamCardSkeleton key={i} />
                        ))}
                    </div>
                ) : supervisors.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm">Nenhum supervisor encontrado na operação</p>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'grid grid-cols-1 lg:grid-cols-2 gap-4 transition-opacity duration-200',
                            isFetching && !isLoading && 'opacity-50',
                        )}
                    >
                        {supervisors.map(supervisor => (
                            <SupervisorTeamCard key={supervisor.id} supervisor={supervisor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
