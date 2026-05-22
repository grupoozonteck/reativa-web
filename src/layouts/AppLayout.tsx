import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';
import SidebarShell from '@/components/sidebar/SidebarShell';
import ThemeToggleButton from '@/components/ThemeToggleButton';

export default function AppLayout() {
    const { user, logoutFunction } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const name = user?.name ?? 'Usuário';
    const email = user?.email ?? '';
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    const userRole = user?.attendant?.type_label ?? 'user';

    const handleLogout = async () => {
        await logoutFunction();
        navigate('/login');
    };
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen min-h-screen overflow-x-clip bg-background supports-[height:100dvh]:h-dvh">
            {/* â”€â”€ Desktop sidebar â”€â”€ */}
            <aside className="hidden w-[220px] shrink-0 min-h-0 flex-col border-r border-border bg-card lg:flex">
                <SidebarShell
                    name={name}
                    email={email}
                    initials={initials}
                    onLogout={handleLogout}
                    userRole={userRole}
                />
            </aside>

            {/* â”€â”€ Mobile overlay â”€â”€ */}
            <div
                className={`fixed inset-0 lg:hidden transition-opacity duration-200 ${
                    sidebarOpen
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
                style={{ zIndex: 50 }}
                aria-hidden={!sidebarOpen}
            >
                <div
                    className="absolute inset-0 bg-black/55"
                    onClick={closeSidebar}
                />
                <aside
                    className={`absolute inset-y-0 left-0 flex w-64 min-h-0 flex-col border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    style={{
                        zIndex: 51,
                        paddingTop: 'env(safe-area-inset-top)',
                        paddingBottom: 'env(safe-area-inset-bottom)',
                        transform: sidebarOpen
                            ? 'translate3d(0, 0, 0)'
                            : 'translate3d(-100%, 0, 0)',
                        willChange: 'transform, opacity',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >
                    <button
                        className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        style={{
                            top: 'calc(env(safe-area-inset-top) + 0.75rem)',
                        }}
                        onClick={closeSidebar}
                        aria-label="Fechar menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <SidebarShell
                        name={name}
                        email={email}
                        initials={initials}
                        userRole={userRole}
                        onLogout={handleLogout}
                        onNav={closeSidebar}
                    />
                </aside>
            </div>

            {/* â”€â”€ Main content â”€â”€ */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                {/* Mobile top bar */}
                <header
                    className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 lg:hidden"
                    style={{
                        minHeight: '3.5rem',
                        paddingTop: 'env(safe-area-inset-top)',
                    }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="text-muted-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h2 className="text-lg font-bold">Reativa</h2>
                    <ThemeToggleButton />
                </header>

                <main
                    className="relative flex-1 overflow-y-auto overscroll-y-contain bg-background"
                    style={{
                        paddingBottom:
                            'calc(env(safe-area-inset-bottom) + 5rem)',
                        scrollPaddingBottom:
                            'calc(env(safe-area-inset-bottom) + 5rem)',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
                        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-emerald-500/4 blur-3xl" />
                        <div className="absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-secondary/4 blur-3xl" />
                        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-accent/3 blur-3xl" />
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
