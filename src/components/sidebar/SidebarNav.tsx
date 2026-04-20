import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { navItems } from '@/config/navItems';
import { filterNavItems } from '@/config/permissions';
import { useAuth } from '@/contexts/useAuth';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
    onNav?: () => void;
}

export default function SidebarNav({ onNav }: SidebarNavProps) {
    const { userType } = useAuth();



    const visibleItems = filterNavItems(navItems, userType);

    return (
        <nav className="flex-1 px-3 space-y-0.5">
            {visibleItems.map(({ to, label, icon: Icon, badge, exact }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    onClick={onNav}
                    className={({ isActive }) =>
                        cn(
                            'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                            isActive
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            {/* Active background */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-muted border border-border" />
                            )}
                            {/* Active left indicator */}
                            {isActive && (
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-primary dark:bg-primary"
                                />
                            )}
                            <Icon
                                className={cn(
                                    'w-4 h-4 shrink-0 transition-colors relative',
                                    isActive ? 'text-primary dark:text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                )}
                            />
                            <span className="flex-1 relative">{label}</span>
                            {badge !== undefined && (
                                <Badge className="bg-blue-50 dark:bg-lime-300 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 text-xs px-1.5 h-4 relative">
                                    {badge}
                                </Badge>
                            )}

                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
