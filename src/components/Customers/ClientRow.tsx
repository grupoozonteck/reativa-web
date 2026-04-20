import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/utils/client-utils';
import type { ReengagementUser } from '@/services/customer.service';
import { AttendanceConfirmationModal } from './AttendanceConfirmationModal';

export function ClientRow({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);
    const [confirming, setConfirming] = useState(false);

    return (
        <>
            <TableRow className="border-none even:bg-surface-container/30 hover:bg-surface-high/50 transition-colors">
                <TableCell className="py-3 w-[15%] px-4">
                    <span className="text-xs text-on-surface-variant font-mono">#{client.id}</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                        {client.personal_data?.avatar ? (
                            <img
                                src={client.personal_data.avatar}
                                alt={client.name}
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
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">{client.name}</p>
                            <p className="text-xs text-on-surface-variant truncate">{client.login}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="py-3 text-center w-[12%] px-4">
                    <span className="text-sm font-medium text-on-surface tabular-nums">{client.total_orders}</span>
                </TableCell>
                <TableCell className="py-3 text-center w-[12%] px-4">
                    <span className={cn(
                        'text-sm font-semibold tabular-nums',
                        client.paid_orders > 0 ? 'text-primary [text-shadow:0_0_6px_hsl(83_98%_64%_/_0.35)]' : 'text-on-surface-variant'
                    )}>
                        {client.paid_orders}
                    </span>
                </TableCell>
                <TableCell className="py-3 text-right w-[20%] px-4">
                    <Button
                        size="sm"
                        onClick={() => setConfirming(true)}
                        className="h-7 text-xs gap-1.5 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold"
                    >
                        <MessageCircle className="w-3 h-3" />
                        Iniciar atendimento
                    </Button>
                </TableCell>
            </TableRow>

            <AttendanceConfirmationModal
                client={confirming ? client : null}
                onConfirm={() => navigate(`/customers/${client.id}`)}
                onClose={() => setConfirming(false)}
            />
        </>
    );
}
