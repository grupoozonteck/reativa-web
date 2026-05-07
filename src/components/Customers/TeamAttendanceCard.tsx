import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatDate, formatWhatsApp, getWhatsAppLink } from '@/utils/client-utils';
import { statusStyleMap } from '@/utils/color-ultis';
import type { PersonalReengagement } from '@/services/customer.service';

interface TeamAttendanceCardProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function TeamAttendanceCard({ reengagement, statusRecollection }: TeamAttendanceCardProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const recruiter = reengagement.recruiter;
    const leader = reengagement.leader;
    const whatsapp = user.personal_data?.whatsapp || user.personal_data?.phone_number || user.phone_number;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <div className="solid-card p-4 space-y-3">
            {/* Cabeçalho: avatar + nome + id */}
            <div className="flex items-start gap-3">
                <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0',
                    colorClass
                )}>
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.login}</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">#{user.id}</p>
                </div>
            </div>

            {/* Detalhes */}
            <div className="bg-surface-highest rounded-lg p-2.5 flex flex-col gap-2">
                {/* WhatsApp */}
                {whatsapp && (
                    <a
                        href={getWhatsAppLink(whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-xs"
                    >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatWhatsApp(whatsapp)}</span>
                    </a>
                )}

                {/* Líder */}
                {leader && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <UserRound className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[11px] uppercase tracking-wide font-semibold text-on-surface-variant mr-1">Líder:</span>
                            <span className="text-xs font-medium text-on-surface truncate">{leader.name || leader.login}</span>
                            <p className="text-[11px] text-on-surface-variant truncate">@{leader.login}</p>
                        </div>
                    </div>
                )}

                {/* Atendente */}
                {recruiter && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <UserRound className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[11px] uppercase tracking-wide font-semibold text-on-surface-variant mr-1">Atendente:</span>
                            <span className="text-xs font-medium text-on-surface truncate">{recruiter.name}</span>
                            <p className="text-[11px] text-on-surface-variant truncate">@{recruiter.login}</p>
                        </div>
                    </div>
                )}

                {/* Status + Data */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <Badge className={cn('text-xs gap-1.5 whitespace-nowrap border py-0.5', statusStyle.color)}>
                        <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                        {statusLabel}
                    </Badge>
                    <span className="text-xs text-on-surface-variant tabular-nums shrink-0">
                        {formatDate(reengagement.created_at)}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/customers/${user.id}`)}
                className="w-full h-9 text-xs gap-1.5 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold"
            >
                <Eye className="w-3.5 h-3.5" />
                Ver detalhes
            </Button>
        </div>
    );
}
