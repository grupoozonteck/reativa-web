import { LayoutDashboard, Trophy, UsersRound, Headphones, Bell, type LucideIcon, HandCoins, Handshake } from 'lucide-react';
import { saleNotifications } from '@/data/mock';

export interface NavItem {
    to: string;
    label: string;
    icon: LucideIcon;
    exact?: boolean;
    badge?: number;
}

export const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/ranking', label: 'Ranking', icon: Trophy },
    { to: '/clientes', label: 'Clientes', icon: UsersRound },
    { to: '/meus-atendimentos', label: 'Meus Atendimentos', icon: Headphones },
    { to: '/supervisor/performance', label: 'Minha Equipe', icon: Handshake },
    { to: '/manager/performance', label: 'Minha Operação', icon: Handshake },
    { to: '/comissoes', label: 'Comissões', icon: HandCoins },
    {
        to: '/notificacoes',
        label: 'Notificações',
        icon: Bell,
        badge: saleNotifications.filter(n => n.type === 'reativacao').length,
    },
];
