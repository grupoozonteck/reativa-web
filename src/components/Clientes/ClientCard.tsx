import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/lib/client-utils';
import type { ReengagementUser } from '@/services/customer.service';

export function ClientCard({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <div className="solid-card p-4 space-y-3">
            <div className="flex items-center gap-3">
                {client.personal_data?.avatar ? (
                    <img
                        src={client.personal_data.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                ) : (
                    <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0',
                        colorClass
                    )}>
                        {initials}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface truncate">{client.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{client.login}</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">#{client.id}</p>
                </div>
            </div>

            {/* Background shift instead of border-t */}
            <div className="bg-surface-highest rounded-lg p-2.5 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Pedidos</span>
                    <span className="font-display text-lg font-semibold text-on-surface">{client.total_orders}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Pagos</span>
                    <span className={cn(
                        'font-display text-lg font-semibold',
                        client.paid_orders > 0 ? 'text-primary [text-shadow:0_0_8px_hsl(83_98%_64%_/_0.35)]' : 'text-on-surface-variant'
                    )}>
                        {client.paid_orders}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/clientes/${client.id}`)}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 font-semibold"
            >
                <MessageCircle className="w-3.5 h-3.5" />
                Iniciar atendimento
            </Button>
        </div>
    );
}
