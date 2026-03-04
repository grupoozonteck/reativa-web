import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';
import AuroraBackground from '@/components/AuroraBackground';
import SidebarShell from '@/components/sidebar/SidebarShell';
import ThemeToggleButton from '@/components/ThemeToggleButton';

export default function AppLayout() {
    const { user, logoutFunction } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const name = user?.name ?? 'Usuário';
    const email = user?.email ?? '';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    const handleLogout = async () => { await logoutFunction(); navigate('/login'); };
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* Themed background (aurora or clean white) */}
            <AuroraBackground />

            {/* ── Desktop sidebar ── */}
            <aside
                className="hidden lg:flex w-[220px] shrink-0 border-r border-border flex-col bg-card"
                style={{ position: 'relative', zIndex: 10 }}
            >
                <SidebarShell
                    name={name}
                    email={email}
                    initials={initials}
                    onLogout={handleLogout}
                />
            </aside>

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0" style={{ zIndex: 50 }}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSidebar} />
                    <aside
                        className="absolute left-0 inset-y-0 w-64 bg-card border-r border-border flex flex-col shadow-2xl animate-fade-in-left"
                        style={{ zIndex: 51 }}
                    >
                        <button
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={closeSidebar}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarShell
                            name={name}
                            email={email}
                            initials={initials}
                            onLogout={handleLogout}
                            onNav={closeSidebar}
                        />
                    </aside>
                </div>
            )}

            {/* ── Main content ── */}
            <div
                className="flex-1 flex flex-col min-w-0 overflow-hidden"
                style={{ position: 'relative', zIndex: 5 }}
            >
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-border bg-card">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="text-muted-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2.5 flex-1">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-black text-sm gradient-text-blue">Reativa</span>
                    </div>
                    <ThemeToggleButton />
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
