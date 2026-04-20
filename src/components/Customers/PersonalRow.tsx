import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate } from '@/utils/client-utils';
import { statusStyleMap } from '@/utils/color-ultis';
import type { PersonalReengagement } from '@/services/customer.service';

interface PersonalRowProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function PersonalRow({ reengagement, statusRecollection }: PersonalRowProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const phone = user.personal_data?.whatsapp || user.personal_data?.phone_number || user.phone_number || null;
    const avatar = user.personal_data?.avatar ?? null;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <TableRow className="border-none even:bg-surface-container/30 hover:bg-surface-high/50 transition-colors">
            <TableCell className="py-3 w-[8%] px-3">
                <span className="text-xs text-on-surface-variant font-mono">#{user.id}</span>
            </TableCell>
            <TableCell className="py-3 px-3">
                <div className="flex items-center gap-2">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                    ) : (
                        <div className={cn(
                            'w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0',
                            colorClass
                        )}>
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.login}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 px-3 w-[18%]">
                {phone ? (
                    <a
                        href={getWhatsAppLink(phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors min-w-0"
                    >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs truncate">{formatWhatsApp(phone)}</span>
                    </a>
                ) : (
                    <span className="text-sm text-on-surface-variant">--</span>
                )}
            </TableCell>
            <TableCell className="py-3 text-center w-[18%] px-3">
                <Badge className={cn('border gap-1 whitespace-nowrap justify-center w-full', statusStyle.color)}>
                    <div className={cn('w-1 h-1 rounded-full shrink-0', statusStyle.dotColor)} />
                    <span className="truncate">{statusLabel}</span>
                </Badge>
            </TableCell>
            <TableCell className="py-3 text-center w-[15%] px-3">
                <span className="text-xs text-on-surface-variant tabular-nums">
                    {formatDate(reengagement.created_at)}
                </span>
            </TableCell>
            <TableCell className="py-3 text-center w-[12%] px-3">
                <Button
                    size="sm"
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
