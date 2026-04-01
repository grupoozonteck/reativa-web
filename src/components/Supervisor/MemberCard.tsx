import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/client-utils';
import { type TeamMemberPerformance } from '@/services/team.service';

export function MemberCardSkeleton() {
    return (
        <div className="solid-card p-4 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1 text-center">
                        <Skeleton className="h-5 w-10 mx-auto" />
                        <Skeleton className="h-3 w-14 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MemberCard({ member }: { member: TeamMemberPerformance }) {
    const initials = member.user.name
        .split(' ')
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const conversionPct = Math.min(member.conversion, 100);

    return (
        <div className="solid-card p-4 hover:scale-[1.01] transition-transform">
            {/* Topo: avatar + nome */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{member.user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">@{member.user.login}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 h-4 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                    >
                        {member.type_label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{member.graduation_label}</span>
                </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50">
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{member.sales}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Vendas</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{member.total_reengagements}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Reat.</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{member.conversion}%</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Conv.</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums text-amber-500 dark:text-amber-400">{member.xp.toFixed(2)}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">XP</p>
                </div>
            </div>

            {/* Receita + barra de conversão */}
            <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Receita</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(member.revenue)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Progress value={conversionPct} className="h-1.5 flex-1" />
                    <span className={cn('text-[10px] text-muted-foreground w-8 text-right')}>{member.level}</span>
                </div>
            </div>
        </div>
    );
}
