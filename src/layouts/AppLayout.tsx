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
        <div className="flex min-h-svh bg-background supports-[height:100dvh]:min-h-dvh supports-[height:100dvh]:h-dvh">
            {/* â”€â”€ Desktop sidebar â”€â”€ */}
            <aside
                className="hidden lg:flex w-[220px] shrink-0 min-h-0 border-r border-border flex-col bg-card"
                style={{ position: 'relative', zIndex: 10 }}
            >
                <SidebarShell
                    name={name}
                    email={email}
                    initials={initials}
                    onLogout={handleLogout}
                    userRole={userRole}
                />
            </aside>

            {/* â”€â”€ Mobile overlay â”€â”€ */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0" style={{ zIndex: 50 }}>
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeSidebar}
                    />
                    <aside
                        className="absolute left-0 inset-y-0 w-64 min-h-0 bg-card border-r border-border flex flex-col shadow-2xl animate-fade-in-left"
                        style={{
                            zIndex: 51,
                            paddingTop: 'env(safe-area-inset-top)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                    >
                        <button
                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                            style={{
                                top: 'calc(env(safe-area-inset-top) + 1rem)',
                            }}
                            onClick={closeSidebar}
                        >
                            <X className="w-5 h-5" />
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
            )}

            {/* â”€â”€ Main content â”€â”€ */}
            <div
                className="flex-1 flex flex-col min-w-0 overflow-hidden"
                style={{ position: 'relative', zIndex: 5 }}
            >
                {/* Mobile top bar */}
                <header
                    className="lg:hidden flex items-center gap-3 px-4 border-b border-border bg-card justify-between"
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
                    className="flex-1 overflow-y-auto"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
