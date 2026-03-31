import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SidebarNav from './SidebarNav';
import ThemeToggleButton from '@/components/ThemeToggleButton';

interface SidebarShellProps {
    name: string;
    email: string;
    initials: string;
    onLogout: () => void;
    onNav?: () => void;
}

export default function SidebarShell({ name, email, initials, onLogout, onNav }: SidebarShellProps) {
    return (
        <div className="flex flex-col h-full">

            {/* ── Brand ── */}
            <div className="px-5 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="relative bg-lime-900 p-2 rounded-xl">
                        <img src="/images/logos/logo-closer.png" alt="Reativa Logo" className="object-cover rounded-xl" />
                    </div>
                </div>
            </div>

            {/* ── Section label ── */}
            <div className="px-5 pt-5 pb-2">
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em]">Navegação</p>
            </div>

            {/* ── Nav ── */}
            <SidebarNav onNav={onNav} />

            {/* ── User footer ── */}
            <div className="px-3 py-4 border-t border-border">
                <div className="flex items-center gap-2 px-2.5 py-2.5 rounded-xl bg-muted">
                    <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{name}</p>
                        <p className="text-[10px] text-muted-foreground truncate leading-tight">{email}</p>
                    </div>
                    <ThemeToggleButton />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        className="w-7 h-7 text-white hover:text-white  shrink-0 transition-color bg-red-500  dark:hover:bg-red-500/20"
                        title="Sair"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
