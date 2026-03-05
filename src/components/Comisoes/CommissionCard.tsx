import { formatCurrency, formatDate } from '@/lib/client-utils';
import { Badge } from '@/components/ui/badge';

interface CommissionItem {
    id?: number;
    order_id?: number;
    attendant_name?: string;
    customer_name?: string;
    order_value?: number | string;
    value?: number | string;
    status?: string;
    created_at?: string;
    personal_order: {
        user: {
            name: string;
        };
        value: number | string;
    };
}

interface CommissionCardProps {
    item: CommissionItem;
}

export function CommissionCard({ item }: CommissionCardProps) {
    return (
        <div className="solid-card p-3 space-y-3">
            {/* Header com Atendente */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Atendente
                    </p>
                    <p className="text-sm font-medium truncate">
                        {item.attendant_name ?? 'NA'}
                    </p>
                </div>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    {item.status ?? 'NA'}
                </Badge>
            </div>

            {/* Cliente */}
            <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                    Cliente
                </p>
                <p className="text-sm truncate">
                    {item.personal_order?.user?.name ?? 'NA'}
                </p>
            </div>

            {/* Pedido */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Pedido
                    </p>
                    <p className="text-sm font-medium">
                        {item.order_id ?? 'NA'}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Data
                    </p>
                    <p className="text-sm">
                        {item.created_at ? formatDate(item.created_at) : 'NA'}
                    </p>
                </div>
            </div>

            {/* Valores */}
            <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Valor Pedido
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(item.personal_order?.value ?? 0)}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        Comissão
                    </p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.value ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
