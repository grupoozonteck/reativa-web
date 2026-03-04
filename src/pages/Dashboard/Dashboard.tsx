import { UserX, DollarSign, TrendingUp, Users, Award } from 'lucide-react';
import { dashboardStats } from '@/data/mock';
import { useAuth } from '@/contexts/useAuth';
import StatCard from '@/components/dashboard/StatCard';
import TopSellersCard from '@/components/dashboard/TopSellersCard';
import InativosCard from '@/components/dashboard/InativosCard';
import RecentSalesCard from '@/components/dashboard/RecentSalesCard';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function Dashboard() {
    const { user } = useAuth();
    const name = user?.name ?? 'Usuário';

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="animate-fade-in" style={{ animationDelay: '0ms', opacity: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                        {getGreeting()},{' '}
                        <span className="gradient-text-blue">{name.split(' ')[0]}</span>
                        <Award className="w-5 h-5 text-violet-500" />
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm ml-3">Visão geral do sistema de reativação</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    label="Clientes Inativos"
                    rawValue={dashboardStats.totalInactive}
                    displayFn={v => String(v)}
                    icon={UserX}
                    colorClass="text-rose-500"
                    bgClass="bg-rose-500/10"
                    delay={80}
                />
                <StatCard
                    label="Receita Mensal"
                    rawValue={dashboardStats.totalSalesMonth}
                    displayFn={v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v)}
                    icon={DollarSign}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-500/10"
                    trend="+18%"
                    delay={160}
                />
                <StatCard
                    label="Atendentes Ativos"
                    rawValue={dashboardStats.totalAttendants}
                    displayFn={v => String(v)}
                    icon={Users}
                    colorClass="text-violet-500"
                    bgClass="bg-violet-500/10"
                    delay={240}
                />
                <StatCard
                    label="Taxa de Conversão"
                    rawValue={dashboardStats.conversionRate}
                    displayFn={v => `${v}%`}
                    icon={TrendingUp}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-500/10"
                    trend="+5%"
                    delay={320}
                />
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <TopSellersCard />
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <InativosCard />
                    <RecentSalesCard />
                </div>
            </div>
        </div>
    );
}
