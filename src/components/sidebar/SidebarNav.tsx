import { NavLink } from 'react-router-dom';
import { navItems } from '@/config/navItems';
import { filterNavItems } from '@/config/permissions';
import { useAuth } from '@/contexts/useAuth';

interface SidebarNavProps {
    onNav?: () => void;
}

export default function SidebarNav({ onNav }: SidebarNavProps) {
    const { userType } = useAuth();
    const items = filterNavItems(navItems, userType);

    return (
        <nav className="flex-1 px-3 pb-4">
            <div className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            onClick={onNav}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                ].join(' ')
                            }
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
