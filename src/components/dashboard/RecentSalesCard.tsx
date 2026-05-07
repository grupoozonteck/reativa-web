import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RecentSale } from '@/services/dashboard.service';

interface RecentSalesCardProps {
    sales: RecentSale[];
    isLoading?: boolean;
}

function getTypeConfig(_type: string) {
    return { label: 'Reativação', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
}

function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

const AVATAR_GRADIENTS = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
];

function getAvatarGradient(name: string) {
    const idx = (name.charCodeAt(0) + (name.charCodeAt(1) ?? 0)) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[idx];
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
                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarGradient(n.attendant_name)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                                {getInitials(n.attendant_name)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-xs font-semibold truncate">{n.attendant_name}</span>
                                        <Badge variant="outline" className={cn('text-xs px-1 h-3.5 shrink-0', cfg.color)}>
                                            {cfg.label}
                                        </Badge>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-500 shrink-0">
                                        +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(n.value)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="text-xs text-muted-foreground truncate">{n.customer_name}</p>
                                    {n.created_at && (
                                        <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-1">{n.created_at}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
