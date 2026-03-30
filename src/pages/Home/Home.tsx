import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Layers, LogOut, Users, DollarSign, ShoppingCart,
    Star, TrendingUp, TrendingDown, UserPlus, FileText,
    Settings, MessageSquare, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
    {
        label: 'Usuários ativos',
        value: '1.248',
        change: '+12%',
        up: true,
        icon: Users,
        color: 'text-secondary',
        bg: 'bg-secondary/10',
        glow: 'shadow-glow-secondary',
    },
    {
        label: 'Receita mensal',
        value: 'R$ 42.5k',
        change: '+8%',
        up: true,
        icon: DollarSign,
        color: 'text-primary',
        bg: 'bg-primary/10',
        glow: 'shadow-glow-primary-sm',
    },
    {
        label: 'Pedidos hoje',
        value: '356',
        change: '-3%',
        up: false,
        icon: ShoppingCart,
        color: 'text-accent',
        bg: 'bg-accent/10',
        glow: '',
    },
    {
        label: 'Avaliação média',
        value: '4.8',
        change: '+24%',
        up: true,
        icon: Star,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        glow: '',
    },
];

const actions = [
    {
        label: 'Gerenciar Usuários',
        description: 'Adicionar e editar usuários',
        icon: UserPlus,
    },
    {
        label: 'Relatórios',
        description: 'Visualizar dados e métricas',
        icon: FileText,
    },
    {
        label: 'Configurações',
        description: 'Preferências do sistema',
        icon: Settings,
    },
    {
        label: 'Mensagens',
        description: 'Central de comunicação',
        icon: MessageSquare,
    },
];

export default function Home() {
    const { user, logoutFunction } = useAuth();

    const name = user?.name ?? 'Usuário';
    const email = user?.email ?? '';

    const getInitials = (n: string) =>
        n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Bom dia';
        if (h < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header — tonal transition from surface to surface-container-low */}
            <header className="sticky top-0 z-50 bg-surface-low/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg btn-primary-arena flex items-center justify-center animate-pulse-glow">
                            <Layers className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-base gradient-text">Reativa</span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full glass">
                            <Avatar className="w-7 h-7">
                                <AvatarFallback className="btn-primary-arena text-primary-foreground text-xs font-bold">
                                    {getInitials(name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-foreground">{name}</span>
                                <span className="text-xs text-muted-foreground">{email}</span>
                            </div>
                        </div>

                        <Button
                            id="logout-btn"
                            variant="ghost"
                            size="icon"
                            onClick={logoutFunction}
                            title="Sair"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                {/* Welcome — editorial typography */}
                <section className="mb-8 animate-fade-in">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        {getGreeting()}
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                        {name.split(' ')[0]},{' '}
                        <span className="gradient-text">pronto para fechar?</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Aqui está um resumo rápido do seu painel
                    </p>
                </section>

                {/* Stats grid — arena cards, no borders, tonal depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="arena-card p-5 animate-fade-in"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg, stat.glow)}>
                                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        'text-xs font-semibold gap-1 px-2 border-0',
                                        stat.up
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-destructive/10 text-destructive'
                                    )}
                                >
                                    {stat.up
                                        ? <TrendingUp className="w-3 h-3" />
                                        : <TrendingDown className="w-3 h-3" />
                                    }
                                    {stat.change}
                                </Badge>
                            </div>
                            {/* Editorial scaling: massive number + tiny label */}
                            <p className="font-display text-3xl font-bold tracking-tight mb-0.5">
                                {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick actions — spacing separates sections, no divider lines */}
                <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                        Ações rápidas
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {actions.map((action, i) => (
                            <button
                                key={action.label}
                                className="glass-card p-4 text-left flex items-center gap-3 hover:shadow-ambient hover:-translate-y-0.5 transition-all duration-200 animate-fade-in group"
                                style={{ animationDelay: `${400 + i * 80}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl btn-primary-arena flex items-center justify-center shrink-0">
                                    <action.icon className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{action.label}</p>
                                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
