import { Zap, LogOut } from 'lucide-react';
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
                    <div className="relative w-9 h-9 shrink-0">
                        <div
                            className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center"
                        >
                            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <p className="font-black text-sm gradient-text-blue tracking-wide">Reativa</p>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Comercial</p>
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
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
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
                        className="w-7 h-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 shrink-0 transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
