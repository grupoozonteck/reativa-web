import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, getInitials } from '@/utils/client-utils';
import {
    type ManagerSupervisor,
    type ManagerAttendant,
} from '@/services/team.service';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function SupervisorTeamCardSkeleton() {
    return (
        <div className="solid-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border p-4">
                <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="space-y-1 rounded-2xl border border-border/50 p-3 text-center"
                    >
                        <Skeleton className="mx-auto h-5 w-12" />
                        <Skeleton className="mx-auto h-3 w-16" />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 px-4 pb-4">
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-10" />
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 2xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-border/50 p-4"
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <Skeleton key={j} className="h-9 w-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MiniMetric({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <div className="space-y-0.5">
            <p
                className={cn(
                    'font-bold tabular-nums text-foreground',
                    valueClassName,
                )}
            >
                {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

function SupervisorMetric({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <div className="space-y-1 rounded-2xl bg-muted/25 px-3 py-3 text-center">
            <p
                className={cn(
                    'text-lg font-bold tabular-nums text-foreground sm:text-xl',
                    valueClassName,
                )}
            >
                {value}
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                {label}
            </p>
        </div>
    );
}

function AttendantMiniCard({ attendant }: { attendant: ManagerAttendant }) {
    const revenue =
        typeof attendant.revenue === 'string'
            ? parseFloat(attendant.revenue)
            : (attendant.revenue ?? 0);

    return (
        <div className="px-0 py-3 transition-colors lg:rounded-2xl lg:border lg:border-border/60 lg:bg-card/70 lg:px-4 lg:hover:border-primary/20 lg:hover:bg-muted/25">
            <div className="flex flex-col gap-3 lg:hidden">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                        {getInitials(attendant.user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                            {attendant.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            @{attendant.user.login || '-'}
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className="h-5 shrink-0 border-primary/20 bg-primary/10 px-1.5 text-xs text-primary"
                    >
                        {attendant.level}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/20 pt-2.5 text-left">
                    <MiniMetric
                        label="Reat."
                        value={attendant.sales}
                        valueClassName="text-[15px]"
                    />
                    <MiniMetric
                        label="Atend."
                        value={attendant.total_reengagements}
                        valueClassName="text-[15px]"
                    />
                    <MiniMetric
                        label="Conv."
                        value={`${attendant.conversion}%`}
                        valueClassName="text-[15px]"
                    />
                    <MiniMetric
                        label="Receita"
                        value={formatCurrency(revenue)}
                        valueClassName="text-[15px] text-emerald-600 dark:text-emerald-400"
                    />
                </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.6fr)_72px_72px_72px_120px_68px] lg:items-center lg:gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                        {getInitials(attendant.user.name)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                            {attendant.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            @{attendant.user.login || '-'}
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm font-bold tabular-nums text-foreground">
                    {attendant.sales}
                </p>
                <p className="text-center text-sm font-bold tabular-nums text-foreground">
                    {attendant.total_reengagements}
                </p>
                <p className="text-center text-sm font-bold tabular-nums text-foreground">
                    {attendant.conversion}%
                </p>
                <p className="truncate text-right text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(revenue)}
                </p>

                <div className="flex justify-end">
                    <Badge
                        variant="outline"
                        className="h-5 shrink-0 border-primary/20 bg-primary/10 px-1.5 text-xs text-primary"
                    >
                        {attendant.level}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

function AttendantsTableHeader() {
    return (
        <div className="hidden rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 lg:grid lg:grid-cols-[minmax(0,1.6fr)_72px_72px_72px_120px_68px] lg:items-center lg:gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Atendente
            </span>
            <span className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Reat.
            </span>
            <span className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Atend.
            </span>
            <span className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Conv.
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Receita
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Nivel
            </span>
        </div>
    );
}

export function SupervisorTeamCard({
    supervisor,
}: {
    supervisor: ManagerSupervisor;
}) {
    const conversionPct = Math.min(supervisor.conversion, 100);

    return (
        <div className="solid-card overflow-hidden transition-transform hover:scale-[1.005]">
            <div className="border-b border-border bg-indigo-500/[0.06] px-5 py-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-primary/15 bg-secondary/10">
                        <AvatarFallback className="bg-secondary text-sm font-bold text-secondary-foreground">
                            {getInitials(supervisor.user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="truncate text-base font-bold">
                                    {supervisor.user.name}
                                </p>
                                <p className="truncate text-sm text-muted-foreground">
                                    @{supervisor.user.login || '-'}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-1.5 sm:items-end">
                                <Badge
                                    variant="outline"
                                    className="h-5 border-indigo-500/20 bg-indigo-500/10 px-2 text-xs text-indigo-300"
                                >
                                    {supervisor.type_label}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {supervisor.graduation_label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <SupervisorMetric
                        label="Reativacoes"
                        value={supervisor.sales}
                    />
                    <SupervisorMetric
                        label="Atendimentos"
                        value={supervisor.total_reengagements}
                    />
                    <SupervisorMetric
                        label="Conversao"
                        value={`${supervisor.conversion}%`}
                    />
                    <SupervisorMetric
                        label="Receita"
                        value={formatCurrency(supervisor.revenue)}
                        valueClassName="text-emerald-600 dark:text-emerald-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
                <Progress value={conversionPct} className="h-2 flex-1" />
                <span className="w-12 text-right text-xs font-medium text-muted-foreground">
                    {supervisor.level}
                </span>
            </div>

            <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Atendentes
                    </span>
                    <Badge
                        variant="outline"
                        className="ml-1 h-5 border-primary/20 bg-primary/10 px-1.5 text-xs text-primary"
                    >
                        {supervisor.attendants.length}
                    </Badge>
                </div>

                {supervisor.attendants.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Nenhum atendente nesta equipe
                    </p>
                ) : (
                    <div className="space-y-0 lg:space-y-3">
                        <AttendantsTableHeader />
                        <div className="grid grid-cols-1 divide-y divide-border/25 lg:gap-3 lg:divide-y-0">
                            {supervisor.attendants.map((attendant) => (
                                <AttendantMiniCard
                                    key={attendant.id}
                                    attendant={attendant}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface SupervisorTeamListProps {
    supervisors: ManagerSupervisor[];
    isLoading: boolean;
    isFetching: boolean;
}

export function SupervisorTeamList({
    supervisors,
    isLoading,
    isFetching,
}: SupervisorTeamListProps) {
    return (
        <div className="solid-card overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">
                        Supervisores e Equipes
                    </h2>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-300"
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

            <div className="p-4 sm:p-5">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SupervisorTeamCardSkeleton key={i} />
                        ))}
                    </div>
                ) : supervisors.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <Users className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">
                            Nenhum supervisor encontrado na operacao
                        </p>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-4 xl:grid-cols-2 transition-opacity duration-200',
                            isFetching && !isLoading && 'opacity-50',
                        )}
                    >
                        {supervisors.map((supervisor) => (
                            <SupervisorTeamCard
                                key={supervisor.id}
                                supervisor={supervisor}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
