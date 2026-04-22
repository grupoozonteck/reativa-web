/**
 * Sistema de permissões baseado no campo `type` do objeto `attendants`.
 *
 * type 1 = Gerente    → acesso total
 * type 2 = Supervisor → acesso intermediário (vê equipe, métricas)
 * type 3 = Atendente  → acesso básico (seus clientes, seus atendimentos, métricas gerais)
 */

export const UserRole = {
    GERENTE: 1,
    SUPERVISOR: 2,
    ATENDENTE: 3,
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface RoleConfig {
    label: string;
    level: number; // quanto menor, mais acesso
}

export const roleConfigs: Record<number, RoleConfig> = {
    [UserRole.GERENTE]: { label: 'Gerente', level: 1 },
    [UserRole.SUPERVISOR]: { label: 'Supervisor', level: 2 },
    [UserRole.ATENDENTE]: { label: 'Atendente', level: 3 },
};

/**
 * Rotas que cada role pode acessar.
 * Se a rota não estiver listada aqui, todas as roles podem acessar.
 */
const restrictedRoutes: Record<string, number[]> = {
    '/equipe': [UserRole.GERENTE, UserRole.SUPERVISOR],
    '/team-attendances': [UserRole.GERENTE, UserRole.SUPERVISOR],
    '/supervisor/performance': [UserRole.SUPERVISOR],
    '/manager/performance': [UserRole.GERENTE],
    '/attendants': [UserRole.GERENTE, UserRole.SUPERVISOR],
};

/**
 * Verifica se o usuário com o dado type tem permissão para acessar a rota.
 */
export function canAccessRoute(userType: number | undefined, route: string): boolean {
    const allowed = restrictedRoutes[route];
    // Se a rota não tem restrição, qualquer um acessa
    if (!allowed) return true;
    // Se não tem type, nega acesso a rotas restritas
    if (userType === undefined) return false;
    return allowed.includes(userType);
}

/**
 * Verifica se o usuário tem nível igual ou superior ao mínimo exigido.
 * Gerente (1) >= Supervisor (2) >= Atendente (3)
 */
export function hasMinRole(userType: number | undefined, minRole: UserRoleType): boolean {
    if (userType === undefined) return false;
    // type menor = mais poder → userType <= minRole
    return userType <= minRole;
}

/**
 * Itens de navegação que cada role pode ver.
 */
const hiddenNavItems: Record<string, number[]> = {
    '/equipe': [UserRole.GERENTE, UserRole.SUPERVISOR],
    '/team-attendances': [UserRole.GERENTE, UserRole.SUPERVISOR],
    '/supervisor/performance': [UserRole.SUPERVISOR],
    '/manager/performance': [UserRole.GERENTE],
    '/attendants': [UserRole.GERENTE, UserRole.SUPERVISOR],
};

/**
 * Filtra os itens de navegação baseado no type do usuário.
 */
export function filterNavItems<T extends { to: string }>(items: T[], userType: number | undefined): T[] {
    return items.filter(item => {
        const allowed = hiddenNavItems[item.to];
        if (!allowed) return true;
        if (userType === undefined) return false;
        return allowed.includes(userType);
    });
}
