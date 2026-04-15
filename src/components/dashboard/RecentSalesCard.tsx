import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RecentSale } from '@/services/dashboard.service';

interface RecentSalesCardProps {
    sales: RecentSale[];
    isLoading?: boolean;
}

function getTypeConfig(type: string) {
    const normalized = type.toLowerCase();
    if (normalized.includes('reat')) {
        return { label: type, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    }
    return { label: type, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
}

function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function RecentSalesCard({ sales, isLoading = false }: RecentSalesCardProps) {
    const recentNotifs = sales.slice(0, 6);

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
                {!isLoading && recentNotifs.length === 0 && (
                    <p className="text-xs text-muted-foreground">Sem vendas recentes para exibir.</p>
                )}

                {recentNotifs.map((n, i) => {
                    const cfg = getTypeConfig(n.type);
                    return (
                        <div
                            key={`${n.attendant_name}-${n.customer_name}-${i}`}
                            className="flex items-start gap-2.5 animate-fade-in"
                            style={{ animationDelay: `${600 + i * 60}ms`, opacity: 0 }}
                        >
                            {/* Avatar initials */}
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {getInitials(n.attendant_name)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold">{n.attendant_name}</span>
                                    <Badge variant="outline" className={cn('text-xs px-1 h-3.5', cfg.color)}>
                                        {cfg.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground truncate">{n.customer_name}</p>
                                    <span className="text-xs font-bold text-emerald-500 ml-1 shrink-0">
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
