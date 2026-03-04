import { useState } from 'react';
import { Bell, ShoppingCart, UserCheck, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { saleNotifications, type SaleNotification } from '@/data/mock';
import { cn } from '@/lib/utils';

const typeConfig = {
    venda: {
        label: 'Venda',
        icon: ShoppingCart,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-400',
        glow: 'shadow-blue-500/10',
    },
    reativacao: {
        label: 'Reativação',
        icon: UserCheck,
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-400',
        glow: 'shadow-emerald-500/10',
    },
    primeiro_pedido: {
        label: '1ª Compra',
        icon: Star,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-400',
        glow: 'shadow-blue-500/10',
    },
};

function NotifCard({ notif }: { notif: SaleNotification }) {
    const cfg = typeConfig[notif.type];
    return (
        <div className={cn('glass-card rounded-xl p-4 hover:border-white/[0.12] transition-all duration-200 animate-fade-in hover:-translate-y-0.5', `hover:shadow-lg ${cfg.glow}`)}>
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        {notif.sellerName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className={cn('absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card flex items-center justify-center', cfg.dot)}>
                        <cfg.icon className="w-2 h-2 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-semibold">{notif.sellerName}</span>
                        <Badge variant="outline" className={cn('text-[9px] px-1.5 h-4', cfg.color)}>
                            {cfg.label}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Cliente: <span className="text-foreground font-medium">{notif.clientName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Produto: <span className="text-foreground">{notif.product}</span>
                    </p>
                </div>

                {/* Value + time */}
                <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-emerald-400">R$ {notif.value}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{notif.time}</p>
                </div>
            </div>
        </div>
    );
}

export default function Notificacoes() {
    const [notifs] = useState(saleNotifications);

    const vendas = notifs.filter(n => n.type === 'venda');
    const reativacoes = notifs.filter(n => n.type === 'reativacao');
    const primeiros = notifs.filter(n => n.type === 'primeiro_pedido');

    const totalValue = notifs.reduce((sum, n) => sum + n.value, 0);

    return (
        <div className="p-6 space-y-5 max-w-4xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-1">
                    <Bell className="w-6 h-6 text-blue-400" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Notificações de Vendas</h1>
                </div>
                <p className="text-muted-foreground text-sm">Feed em tempo real das vendas da equipe</p>
            </div>

            {/* Stats rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Total de Vendas', value: notifs.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Reativações', value: reativacoes.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: '1ºs Pedidos', value: primeiros.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Receita Total', value: `R$ ${(totalValue / 1000).toFixed(1)}k`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((s, i) => (
                    <div key={s.label} className="glass-card rounded-xl p-3 text-center animate-fade-in" style={{ animationDelay: `${100 + i * 50}ms` }}>
                        <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Feed por tipo */}
            <Tabs defaultValue="todas">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="todas" className="text-xs">Todas ({notifs.length})</TabsTrigger>
                        <TabsTrigger value="reativacao" className="text-xs text-emerald-400">Reativações ({reativacoes.length})</TabsTrigger>
                        <TabsTrigger value="primeiro_pedido" className="text-xs text-blue-400">1ªs Compras ({primeiros.length})</TabsTrigger>
                        <TabsTrigger value="venda" className="text-xs text-blue-400">Vendas ({vendas.length})</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Ao vivo
                    </div>
                </div>

                {[
                    { value: 'todas', data: notifs },
                    { value: 'reativacao', data: reativacoes },
                    { value: 'primeiro_pedido', data: primeiros },
                    { value: 'venda', data: vendas },
                ].map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        <div className="space-y-3">
                            {tab.data.map(n => (
                                <NotifCard key={n.id} notif={n} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
