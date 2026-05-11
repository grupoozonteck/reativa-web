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

interface DetailRowProps {
    label: string;
    value: string;
    valueClassName?: string;
    labelClassName?: string;
    className?: string;
}

function DetailRow({ label, value, valueClassName, labelClassName, className }: DetailRowProps) {
    return (
        <div className={className ?? 'space-y-1'}>
            <p className={`text-xs md:text-sm font-semibold text-gray-400 ${labelClassName}`}>
                {label}
            </p>
            <p className={`text-xs md:text-base ${valueClassName}`}>{value}</p>
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
    const reengagementDate = item.personal_order?.customer_reengagement?.created_at
        ? formatDateTime(item.personal_order.customer_reengagement.created_at)
        : 'NA';
    const description = item.description_extra?.trim() || 'Sem descricao informada.';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="default" className={triggerClassName}>
                    <Eye className="h-3.5 w-3.5" />
                    Ver detalhes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border border-white/10 bg-surface p-0 text-on-surface">
                <DialogHeader className="border-b border-white/5 px-5 py-4">
                    <DialogTitle className="text-base">Transação #{item.id ?? 'NA'}</DialogTitle>
                    <DialogDescription className="text-xs text-on-surface-variant">
                        Pedido {item.order_id ?? 'NA'} em {item.personal_order?.payment_date ? formatDateTime(item.personal_order.payment_date) : 'NA'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 px-5 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DetailRow label="Cliente" value={`${customerName} (${customerLogin})`} />
                        <DetailRow valueClassName="font-normal" label="Atendente" value={`${attendantName} (${attendantLogin})`} />
                        <DetailRow label="Valor do pedido" value={formatCurrency(item.personal_order?.value ?? 0)} />
                        <DetailRow label="Comissão" value={formatCurrency(item.value ?? 0)} />
                        <DetailRow className="col-span-2 space-y-1" label="Data do atendimento" value={reengagementDate} />
                    </div>

                    <div className="rounded-lg border border-white/5 bg-surface-highest/60 p-4">
                        <DetailRow label="Descrição" value={description}  />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
