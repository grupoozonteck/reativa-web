import { formatCurrency, formatDateTime } from '@/utils/client-utils';

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
            login: string;
            name: string;
        };
        value: number | string;
        customer_reengagement?: {
            attendant?: {
                user?: {
                    login?: string;
                    name?: string;
                };
            };
        };
    };
}

interface CommissionCardProps {
    item: CommissionItem;
}

export function CommissionCard({ item }: CommissionCardProps) {
    return (
        <div className="solid-card p-3 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        #ID
                    </p>
                    <p className="text-sm font-mono text-on-surface-variant truncate">
                        {item.id ?? 'NA'}
                    </p>
                </div>
            </div>

            <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                    Cliente
                </p>
                <p className="text-sm font-medium text-on-surface truncate">
                    {item.personal_order?.user?.name ?? 'NA'}
                    <small className="text-on-surface-variant font-normal"> ({item.personal_order?.user?.login ?? 'NA'})</small>
                </p>
            </div>

            <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                    Atendente
                </p>
                <p className="text-sm font-medium text-on-surface truncate">
                    {item.personal_order?.customer_reengagement?.attendant?.user?.name ?? 'NA'}
                    <small className="text-on-surface-variant font-normal">
                        {' '}({item.personal_order?.customer_reengagement?.attendant?.user?.login ?? 'NA'})
                    </small>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                        Pedido
                    </p>
                    <p className="text-sm font-medium text-on-surface">
                        {item.order_id ?? 'NA'}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                        Data
                    </p>
                    <p className="text-sm text-on-surface-variant">
                        {item.created_at ? formatDateTime(item.created_at) : 'NA'}
                    </p>
                </div>
            </div>

            <div className="bg-surface-highest rounded-lg p-2.5 grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                        Valor Pedido
                    </p>
                    <p className="text-sm font-medium text-secondary tabular-nums">
                        {formatCurrency(item.personal_order?.value ?? 0)}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                        Comissao
                    </p>
                    <p className="text-sm font-semibold text-primary tabular-nums [text-shadow:0_0_8px_hsl(83_98%_64%_/_0.4)]">
                        {formatCurrency(item.value ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
