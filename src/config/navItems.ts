import { LayoutDashboard, Trophy, UsersRound, Headphones, type LucideIcon, HandCoins, Handshake, UserCog, UserStar, ScanSearch } from 'lucide-react';

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
    { to: '/supervisor/ranking', label: 'Rank Supervisores', icon: Trophy },
    { to: '/customers', label: 'Clientes', icon: UsersRound },
    { to: '/reengagements/generate', label: 'Gerar Recrut.', icon: UserStar },
    { to: '/reengagements/situation', label: 'Consulta de Situação', icon: ScanSearch },
    { to: '/my-attendances', label: 'Meus Atendimentos', icon: Headphones },
    { to: '/team-attendances', label: 'Atend. Equipe', icon: Headphones },
    { to: '/supervisor/performance', label: 'Minha Equipe', icon: Handshake },
    { to: '/manager/performance', label: 'Minha Operacao', icon: Handshake },
    { to: '/attendants', label: 'Atendentes', icon: UserCog },
    { to: '/commissions', label: 'Comissoes', icon: HandCoins },

];
