import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency, formatDateTime } from '@/utils/client-utils';
import type { CommissionItem } from './types';

interface CommissionDetailsDialogProps {
    item: CommissionItem;
    triggerClassName?: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {label}
            </p>
            <p className="text-sm text-on-surface break-words">{value}</p>
        </div>
    );
}

export function CommissionDetailsDialog({
    item,
    triggerClassName,
}: CommissionDetailsDialogProps) {
    const customerName = item.personal_order?.user?.name ?? 'NA';
    const customerLogin = item.personal_order?.user?.login ?? 'NA';
    const attendantName = item.personal_order?.customer_reengagement?.attendant?.user?.name ?? 'NA';
    const attendantLogin = item.personal_order?.customer_reengagement?.attendant?.user?.login ?? 'NA';
    const description = item.description_extra?.trim() || 'Sem descricao informada.';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className={triggerClassName}>
                    <Eye className="h-3.5 w-3.5" />
                    Ver detalhes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border border-white/10 bg-surface p-0 text-on-surface">
                <DialogHeader className="border-b border-white/5 px-5 py-4">
                    <DialogTitle className="text-base">Transacao #{item.id ?? 'NA'}</DialogTitle>
                    <DialogDescription className="text-xs text-on-surface-variant">
                        Pedido {item.order_id ?? 'NA'} em {item.created_at ? formatDateTime(item.created_at) : 'NA'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 px-5 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DetailRow label="Cliente" value={`${customerName} (${customerLogin})`} />
                        <DetailRow label="Atendente" value={`${attendantName} (${attendantLogin})`} />
                        <DetailRow label="Valor do pedido" value={formatCurrency(item.personal_order?.value ?? 0)} />
                        <DetailRow label="Comissao" value={formatCurrency(item.value ?? 0)} />
                    </div>

                    <div className="rounded-lg border border-white/5 bg-surface-highest/60 p-4">
                        <DetailRow label="Descricao" value={description} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
