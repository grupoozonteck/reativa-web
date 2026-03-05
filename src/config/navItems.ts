import { LayoutDashboard, Trophy, Users, UsersRound, Headphones, Bell, type LucideIcon, DollarSign } from 'lucide-react';
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
    { to: '/equipe', label: 'Equipe', icon: Users },
    { to: '/comissoes', label: 'Comissões', icon: DollarSign },
    {
        to: '/notificacoes',
        label: 'Notificações',
        icon: Bell,
        badge: saleNotifications.filter(n => n.type === 'reativacao').length,
    },
];
