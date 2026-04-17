import { UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InactiveClientsSummary } from '@/services/dashboard.service';

interface InativosCardProps {
    summary?: InactiveClientsSummary;
    totalInactive: number;
    isLoading?: boolean;
}

export default function InativosCard({ summary, totalInactive, isLoading = false }: InativosCardProps) {
    const rows = [
        {
            label: 'Nunca compraram',
            val: summary?.never_bought ?? 0,
            total: totalInactive || 1,
            color: 'from-rose-500 to-pink-600',
            glowColor: 'rgba(244, 63, 94, 0.5)',
        },
        {
            label: '+90 dias sem compra',
            val: summary?.plus_90_days ?? 0,
            total: totalInactive || 1,
            color: 'from-amber-500 to-orange-500',
            glowColor: 'rgba(245, 158, 11, 0.5)',
        },
        {
            label: 'Já atribuídos',
            val: summary?.already_assigned ?? 0,
            total: totalInactive || 1,
            color: 'from-secondary to-primary',
            glowColor: 'hsl(83 98% 64% / 0.4)',
        },
    ];

    return (
        <div
            className="solid-card rounded-2xl p-5 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: '450ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-500" />
                Clientes Inativos
            </h2>

            <div className="space-y-3.5">
                {!isLoading && totalInactive === 0 && (
                    <p className="text-xs text-muted-foreground">Sem clientes inativos no período.</p>
                )}

                {rows.map(item => (
                    <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-bold">{item.val}</span>
                        </div>
                        <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={cn('h-full rounded-full bg-gradient-to-r', item.color)}
                                style={{
                                    width: `${(item.val / item.total) * 100}%`,
                                    transition: 'width 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                    boxShadow: `0 0 8px ${item.glowColor}`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
