import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/client-utils';
import { type TeamMemberPerformance } from '@/services/team.service';
import { useNavigate } from 'react-router-dom';

export function MemberCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/60 bg-card px-4 py-4">
            <div className="hidden lg:grid lg:grid-cols-[72px_minmax(260px,1fr)_88px_70px_70px_82px_120px_96px] lg:items-center lg:gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                ))}
            </div>
            <div className="space-y-3 lg:hidden">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function MemberCard({ member, index }: { member: TeamMemberPerformance; index: number }) {
    const navigate = useNavigate();
    const initials = (member.user?.name ?? 'Membro')
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const conversionPct = Math.min(Number(member.conversion ?? 0), 100);
    const xpValue = Number(member.xp ?? 0);
    const revenueValue = Number(member.revenue ?? 0);
    const isTopPerformer = index === 0;
    const goToDetails = () => navigate(`/attendants/${member.id}`);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={goToDetails}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToDetails();
                }
            }}
            className={cn(
                'cursor-pointer rounded-2xl border px-4 py-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
                isTopPerformer
                    ? 'border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary/50 hover:shadow-[0_10px_34px_rgba(0,0,0,0.08)]'
                    : 'border-border/60 bg-card hover:border-primary/30 hover:bg-muted/20',
            )}
        >
            <div className="grid gap-4 lg:hidden">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">{member.user?.name ?? 'Membro sem nome'}</p>
                            {isTopPerformer && (
                                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                                    Top 1
                                </span>
                            )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">@{member.user?.login ?? 'sem-login'}</p>
                    </div>
                    <span className={cn('text-lg font-black tabular-nums', isTopPerformer ? 'text-primary' : 'text-muted-foreground')}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MobileMetric label="Cargo" value={member.type_label} />
                    <MobileMetric label="Graduacao" value={member.graduation_label} />
                    <MobileMetric label="Vendas" value={member.sales} />
                    <MobileMetric label="Reat." value={member.total_reengagements} />
                    <MobileMetric label="Conv." value={`${member.conversion}%`} />
                    <MobileMetric label="XP" value={xpValue.toFixed(2)} />
                    <MobileMetric label="Receita" value={formatCurrency(revenueValue)} valueClassName="text-emerald-600 dark:text-emerald-400" />
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Nivel</p>
                        <div className="flex items-center gap-2">
                            <Progress value={conversionPct} className="h-1.5 flex-1" />
                            <span className="w-10 text-right text-xs text-muted-foreground">{member.level}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[56px_minmax(260px,1fr)_88px_70px_70px_82px_120px_96px] lg:items-center lg:gap-3">
                <div className="flex items-center gap-2">
                    <span className={cn('text-lg font-black tabular-nums', isTopPerformer ? 'text-primary' : 'text-muted-foreground')}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    {isTopPerformer && <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.55)]" />}
                </div>

                <div className="flex min-w-0 items-center gap-3">
                    <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                        isTopPerformer ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                    )}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">{member.user?.name ?? 'Membro sem nome'}</p>
                            {isTopPerformer && (
                                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                                    Top 1
                                </span>
                            )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">@{member.user?.login ?? 'sem-login'}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <Badge
                        variant="outline"
                        className={cn(
                            'h-5 px-2 text-xs',
                            isTopPerformer
                                ? 'border-primary/30 bg-primary/10 text-primary'
                                : 'border-border bg-muted text-foreground',
                        )}
                    >
                        {member.type_label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{member.graduation_label}</p>
                </div>

                <Metric value={member.sales} />
                <Metric value={member.total_reengagements} />
                <Metric value={`${member.conversion}%`} />
                <Metric value={formatCurrency(revenueValue)} valueClassName="text-emerald-600 dark:text-emerald-400" />

                <div className="space-y-1">
                    <p className="text-sm font-bold tabular-nums text-foreground">{member.level}</p>
                    <Progress value={conversionPct} className="h-1.5" />
                </div>
            </div>
        </div>
    );
}

function Metric({
    value,
    valueClassName,
}: {
    value: string | number;
    valueClassName?: string;
}) {
    return <p className={cn('text-sm font-bold tabular-nums text-foreground', valueClassName)}>{value}</p>;
}

function MobileMetric({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <div className="space-y-1 rounded-xl border border-border/50 bg-muted/20 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={cn('text-sm font-bold tabular-nums text-foreground', valueClassName)}>{value}</p>
        </div>
    );
}
