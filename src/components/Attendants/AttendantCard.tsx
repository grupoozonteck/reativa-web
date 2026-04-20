import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/client-utils';
import { type ManagerAttendant } from '@/services/team.service';

export function AttendantCardSkeleton() {
    return (
        <div className="solid-card p-4 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1 text-center">
                        <Skeleton className="h-5 w-10 mx-auto" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const typeColors: Record<number, string> = {
    1: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    2: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    3: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
};

const avatarColors: Record<number, string> = {
    1: 'bg-purple-600',
    2: 'bg-blue-600',
    3: 'bg-emerald-600',
};

export function AttendantCard({ attendant }: { attendant: ManagerAttendant }) {
    const initials = (attendant.user?.name ?? '?')
        .split(' ')
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const avatarColor = avatarColors[attendant.type] ?? 'bg-slate-600';
    const badgeColor = typeColors[attendant.type] ?? '';

    return (
        <div className="solid-card p-4 hover:scale-[1.01] transition-transform">
            {/* Topo: avatar + nome */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{attendant.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{attendant.user?.login}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-xs px-1.5 h-4 ${badgeColor}`}>
                        {attendant.type_label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{attendant.graduation_label}</span>
                </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{attendant.sales}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendas</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{attendant.total_reengagements}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Reat.</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(attendant.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Receita</p>
                </div>
            </div>
        </div>
    );
}
