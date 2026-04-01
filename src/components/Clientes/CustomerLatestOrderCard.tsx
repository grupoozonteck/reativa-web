import { useState } from 'react';
import { Package, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateTime } from '@/utils/client-utils';
import { orderStatusStyleMap, deliveryStatusMap } from '@/config/orderStatus';
import type { PersonalOrder } from '@/services/customer.service';

interface CustomerLatestOrderCardProps {
    order: PersonalOrder;
    orderStatusCollection: Record<string, string>;
}

export function CustomerLatestOrderCard({ order, orderStatusCollection }: CustomerLatestOrderCardProps) {
    const [expanded, setExpanded] = useState(false);
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
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-on-surface truncate">Pedido #{order.code}</h3>
                </div>
                <Badge className={cn('text-xs border gap-1.5 w-fit', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 md:grid-cols-4">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Valor</p>
                    <p className="font-display text-lg font-black text-secondary">{formatCurrency(order.value)}</p>
                </div>
                <div>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Data / Pagamento</p>
                    <p className="text-sm font-medium text-on-surface">{formatDateTime(order.created_at)}</p>
                    <p className="text-sm font-medium text-on-surface-variant">{order.payment_date ? formatDateTime(order.payment_date) : 'Não pago'}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Entrega</p>
                    <p className={cn('text-sm font-medium', deliveryStatus?.color || 'text-on-surface-variant')}>
                        {deliveryStatus?.label || '--'}
                    </p>
                </div>
            </div>

            {order.personal_order_items && order.personal_order_items.length > 0 && (
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(v => !v)}
                        className="w-full justify-between px-3 h-9 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hover:text-on-surface hover:bg-surface-highest"
                    >
                        <span>Itens do pedido ({order.personal_order_items.length})</span>
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>
                    {expanded && (
                        <div className="space-y-2 mt-2">
                            {order.personal_order_items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-highest"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                        <Tag className="w-3.5 h-3.5 text-secondary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-on-surface truncate">
                                            {item.internationalization?.product_name || `Produto #${item.product_id}`}
                                        </p>
                                        <p className="text-[11px] text-on-surface-variant font-mono">Item #{item.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
