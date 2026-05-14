import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type ManagerAttendant } from '@/services/team.service';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/client-utils';
import { cn } from '@/lib/utils';
import { UserRound } from 'lucide-react';
import { typeColors } from '@/utils/color-ultis';

export function AttendantCardSkeleton() {
    return (
        <div className="solid-card p-4 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="bg-surface-highest rounded-lg p-2.5 space-y-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    );
}

export function AttendantCard({ attendant }: { attendant: ManagerAttendant }) {
    const badgeColor = typeColors[attendant.type] ?? '';

    return (
        <div className="solid-card p-4 transition-transform hover:scale-[1.01]">
            {/* Topo: avatar + nome + cargo */}
            <div className="flex items-center gap-3">
                <Avatar className="size-11 shrink-0">
                    <AvatarImage
                        src={attendant.user?.personal_data?.avatar ?? undefined}
                    />
                    <AvatarFallback className="text-sm font-bold">
                        {getInitials(attendant.user?.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">
                        {attendant.user?.name}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                        @{attendant.user?.login}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={cn('text-[10px] px-2 h-5 shrink-0', badgeColor)}
                >
                    {attendant.type_label}
                </Badge>
            </div>

            {/* Detalhes: status, graduação, líder */}
            <div className="flex flex-col gap-2 rounded-lg bg-surface-highest p-2.5">
                <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={attendant.status ?? null} />
                    {attendant.graduation_label && (
                        <span className="text-xs text-on-surface-variant">
                            {attendant.graduation_label}
                        </span>
                    )}
                </div>
                {attendant.parent?.user?.name && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <UserRound className="size-3.5 shrink-0 text-on-surface-variant" />
                        <div className="min-w-0">
                            <span className="text-[11px] uppercase tracking-wide font-semibold text-on-surface-variant mr-1">
                                Líder:
                            </span>
                            <span className="text-xs text-on-surface truncate">
                                {attendant.parent.user.name}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
