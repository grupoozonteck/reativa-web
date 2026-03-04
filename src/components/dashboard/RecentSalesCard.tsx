import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { saleNotifications } from '@/data/mock';
import { cn } from '@/lib/utils';

const recentNotifs = saleNotifications.slice(0, 6);

const notifTypeConfig = {
    reativacao: { label: 'Reativação', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    primeiro_pedido: { label: '1ª Compra', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    venda: { label: 'Venda', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
} as const;

type NotifType = keyof typeof notifTypeConfig;

export default function RecentSalesCard() {
    return (
        <div
            className="solid-card rounded-2xl p-5 flex-1 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: '520ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Últimas Vendas
            </h2>

            <div className="space-y-3">
                {recentNotifs.map((n, i) => {
                    const cfg = notifTypeConfig[n.type as NotifType];
                    return (
                        <div
                            key={n.id}
                            className="flex items-start gap-2.5 animate-fade-in"
                            style={{ animationDelay: `${600 + i * 60}ms`, opacity: 0 }}
                        >
                            {/* Avatar initials */}
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                                {n.sellerName.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold">{n.sellerName}</span>
                                    <Badge variant="outline" className={cn('text-[8px] px-1 h-3.5', cfg.color)}>
                                        {cfg.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-muted-foreground truncate">{n.clientName}</p>
                                    <span className="text-[11px] font-bold text-emerald-500 ml-1 shrink-0">
                                        +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(n.value)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
