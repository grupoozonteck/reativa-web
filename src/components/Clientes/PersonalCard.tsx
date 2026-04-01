import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate } from '@/utils/client-utils';
import { statusStyleMap } from '@/utils/color-ultis';
import type { PersonalReengagement } from '@/services/customer.service';

interface PersonalCardProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function PersonalCard({ reengagement, statusRecollection }: PersonalCardProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <div className="solid-card p-4 space-y-3">
            <div className="flex items-start gap-3">
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0',
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

            {/* Background shift instead of border-t */}
            <div className="bg-surface-highest rounded-lg p-2.5 flex flex-col gap-2">
                {user.phone_number && (
                    <a
                        href={getWhatsAppLink(user.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-xs"
                    >
                        <MessageCircle className="w-3 h-3 shrink-0" />
                        <span>{formatWhatsApp(user.phone_number)}</span>
                    </a>
                )}
                <div className="flex items-center justify-between gap-2">
                    <Badge className={cn('text-[10px] gap-1.5 whitespace-nowrap border', statusStyle.color)}>
                        <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                        {statusLabel}
                    </Badge>
                    <span className="text-xs text-on-surface-variant">
                        {formatDate(reengagement.created_at)}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/clientes/${user.id}`)}
                className="w-full h-8 text-xs gap-1.5 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold"
            >
                <Eye className="w-3 h-3" />
                Ver detalhes
            </Button>
        </div>
    );
}
