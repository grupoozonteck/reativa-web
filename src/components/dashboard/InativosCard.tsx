import { UserX } from 'lucide-react';
import { dashboardStats, inactiveClients } from '@/data/mock';
import { cn } from '@/lib/utils';

const assigned = inactiveClients.filter(c => c.assignedTo !== null).length;

const rows = [
    {
        label: 'Nunca compraram',
        val: dashboardStats.neverBought,
        total: dashboardStats.totalInactive,
        color: 'from-rose-500 to-pink-600',
    },
    {
        label: '+90 dias sem compra',
        val: dashboardStats.inactive90,
        total: dashboardStats.totalInactive,
        color: 'from-amber-500 to-orange-500',
    },
    {
        label: 'Já atribuídos',
        val: assigned,
        total: dashboardStats.totalInactive,
        color: 'from-emerald-500 to-blue-500',
    },
];

export default function InativosCard() {
    return (
        <div
            className="solid-card rounded-2xl p-5 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: '450ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />

            <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-500" />
                Clientes Inativos
            </h2>

            <div className="space-y-3.5">
                {rows.map(item => (
                    <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-bold">{item.val}</span>
                        </div>
                        <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={cn('h-full rounded-full bg-gradient-to-r', item.color)}
                                style={{
                                    width: `${(item.val / item.total) * 100}%`,
                                    transition: 'width 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
