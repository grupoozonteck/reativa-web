import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, MessageCircle, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate, formatDateTime } from '@/utils/client-utils';
import { statusStyleMap } from '@/utils/color-ultis';
import type { PersonalReengagement } from '@/services/customer.service';

interface TeamAttendanceRowProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function TeamAttendanceRow({ reengagement, statusRecollection }: TeamAttendanceRowProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const recruiter = reengagement.recruiter;
    const leader = reengagement.leader;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <TableRow className="border-none even:bg-surface-container/30 hover:bg-surface-high/50 transition-colors">
            {/* ID */}
            <TableCell className="py-3 w-[6%] px-3">
                <span className="text-xs text-on-surface-variant font-mono">#{user.id}</span>
            </TableCell>

            {/* Cliente */}
            <TableCell className="py-3 px-3">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0',
                        colorClass
                    )}>
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{user.login}</p>
                    </div>
                </div>
            </TableCell>



            {/* Líder */}
            <TableCell className="py-3 px-3 w-[14%]">
                {leader ? (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <UserRound className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-on-surface truncate">{leader.name}</p>
                            <p className="text-on-surface-variant truncate">@{leader.login}</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-on-surface-variant">--</span>
                )}
            </TableCell>

            {/* Atendente */}
            <TableCell className="py-3 px-3 w-[14%]">
                {recruiter ? (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <UserRound className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                        <div className="min-w-0">
                            <p className="text-on-surface-variant truncate">@{recruiter.login}</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-on-surface-variant">--</span>
                )}
            </TableCell>

            {/* Status */}
            <TableCell className="py-3 text-center w-[16%] px-3">
                <Badge className={cn('border gap-1 whitespace-nowrap justify-center w-full', statusStyle.color)}>
                    <div className={cn('w-1 h-1 rounded-full shrink-0', statusStyle.dotColor)} />
                    <span className="truncate">{statusLabel}</span>
                </Badge>
            </TableCell>

            {/* Início */}
            <TableCell className="py-3 text-center w-[10%] px-3">
                <span className="text-xs text-on-surface-variant tabular-nums">
                    {formatDateTime(reengagement.created_at)}
                </span>
            </TableCell>

            {/* Ações */}
            <TableCell className="py-3 text-center w-[8%] px-3">
                <Button
                    size="sm"
                    disabled
                    onClick={() => navigate(`/customers/${user.id}`)}
                    className="h-7 text-xs px-2 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold whitespace-nowrap"
                >
                    <Eye className="w-3 h-3" />
                    Ver
                </Button>
            </TableCell>
        </TableRow>
    );
}
