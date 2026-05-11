import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Eye, MessageCircle, UserRound } from 'lucide-react';
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
    const leader = reengagement.leader;
    const whatsapp = user.personal_data?.whatsapp || user.personal_data?.phone_number || user.phone_number;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <div className="solid-card overflow-hidden">
            <div className="border-b border-white/5 bg-surface-highest/50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant/85">
                            Atendimento #{reengagement.id}
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                            Cliente em acompanhamento
                        </p>
                    </div>
                    <div className="rounded-full border border-white/5 bg-background/40 px-2.5 py-1 text-[11px] font-medium text-on-surface-variant tabular-nums">
                        {formatDate(reengagement.created_at)}
                    </div>
                </div>

                <Badge
                    className={cn(
                        'mt-3 inline-flex h-auto max-w-full items-center gap-1.5 whitespace-normal rounded-full border px-2.5 py-1 text-[11px] leading-tight',
                        statusStyle.color
                    )}
                >
                    <div className={cn('h-1.5 w-1.5 shrink-0 rounded-full', statusStyle.dotColor)} />
                    <span>{statusLabel}</span>
                </Badge>
            </div>

            <div className="space-y-4 px-4 py-4">
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg',
                            colorClass
                        )}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-base font-semibold leading-tight text-on-surface">{user.name}</p>
                        <p className="mt-1 truncate text-sm text-on-surface-variant">@{user.login}</p>
                        <p className="mt-1 text-[11px] font-mono text-on-surface-variant/80">ID #{user.id}</p>
                    </div>
                </div>

                {whatsapp && (
                    <a
                        href={getWhatsAppLink(whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-surface-highest/70 px-3 py-3 text-sm text-on-surface transition-colors hover:border-primary/25 hover:text-primary"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <MessageCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">WhatsApp</p>
                                <p className="truncate">{formatWhatsApp(whatsapp)}</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-primary">Abrir</span>
                    </a>
                )}

                {leader && (
                    <div className="rounded-2xl border border-white/5 bg-surface-highest/45 px-3 py-3">
                        <div className="flex min-w-0 items-start gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-background/50">
                                <UserRound className="h-4 w-4 text-on-surface-variant" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Lider responsavel</p>
                                <p className="mt-1 truncate text-sm font-medium text-on-surface">{leader.name || leader.login}</p>
                                <p className="truncate text-xs text-on-surface-variant">@{leader.login}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-background/30 px-3 py-2.5 text-sm text-on-surface-variant">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="text-xs uppercase tracking-[0.18em]">Data</span>
                    <span className="font-medium text-on-surface tabular-nums">
                        {formatDate(reengagement.created_at)}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/customers/${user.id}`)}
                className="mx-4 mb-4 h-10 w-[calc(100%-2rem)] gap-1.5 bg-gradient-to-br from-primary to-primary-container text-xs font-semibold text-primary-foreground transition-shadow hover:shadow-glow-primary-sm"
            >
                <Eye className="h-3.5 w-3.5" />
                Ver detalhes
            </Button>
        </div>
    );
}
