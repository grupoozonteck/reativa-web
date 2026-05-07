import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/utils/client-utils';
import type { ReengagementUser } from '@/services/customer.service';

interface AttendanceConfirmationModalProps {
    client: ReengagementUser | null;
    onConfirm: () => void;
    onClose: () => void;
}

export function AttendanceConfirmationModal({ client, onConfirm, onClose }: AttendanceConfirmationModalProps) {
    if (!client) return null;

    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <Dialog open={!!client} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-display font-bold">
                        Iniciar atendimento?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-on-surface-variant">
                        Confirme antes de iniciar o atendimento com este cliente.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 py-1">
                    {client.personal_data?.avatar ? (
                        <img
                            src={client.personal_data.avatar}
                            alt={client.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                    ) : (
                        <div className={cn(
                            'w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0',
                            colorClass
                        )}>
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{client.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{client.login}</p>
                        <p className="text-xs text-on-surface-variant font-mono mt-0.5">#{client.id}</p>
                    </div>
                </div>

                <DialogFooter className="gap-2 flex-col sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 font-semibold"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
