import { Package, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateTime } from '@/lib/client-utils';
import { orderStatusStyleMap, deliveryStatusMap } from '@/config/orderStatus';
import type { PersonalOrder } from '@/services/customer.service';

interface CustomerLatestOrderCardProps {
    order: PersonalOrder;
    orderStatusCollection: Record<string, string>;
}

export function CustomerLatestOrderCard({ order, orderStatusCollection }: CustomerLatestOrderCardProps) {
    const status = orderStatusStyleMap[order.status] || orderStatusStyleMap[1];
    const statusLabel = orderStatusCollection[String(order.status)] || 'Desconhecido';
    const deliveryStatus = typeof order.delivery_status === 'number'
        ? deliveryStatusMap[order.delivery_status]
        : undefined;
    const StatusIcon = status.icon;

    return (
        <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '240ms', opacity: 0 }}>
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold truncate">Pedido #{order.code}</h3>
                </div>
                <Badge className={cn('text-xs border gap-1.5 w-fit', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 md:grid-cols-4">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Valor</p>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">{formatCurrency(order.value)}</p>
                </div>
                <div>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Data/Data pagamento</p>
                    <p className="text-sm font-medium">{formatDateTime(order.created_at)}</p>
                    <p className="text-sm font-medium">{order.payment_date ? `${formatDateTime(order.payment_date)}` : 'Não pago'}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Entrega</p>
                    <p className={cn('text-sm font-medium', deliveryStatus?.color || 'text-muted-foreground')}>
                        {deliveryStatus?.label || '--'}
                    </p>
                </div>
            </div>

            {order.personal_order_items && order.personal_order_items.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Itens do pedido
                    </p>
                    <div className="space-y-2">
                        {order.personal_order_items.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                    <Tag className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {item.internationalization?.product_name || `Produto #${item.product_id}`}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">Item #{item.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
