import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { loginFunction } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login.trim() || !password.trim()) { setError('Preencha todos os campos'); return; }
        setIsLoading(true);
        try {
            await loginFunction({ login, password });
            navigate('/');
        } catch (err: unknown) {
            console.log(err)
            const e = err as { response?: { data?: { message?: string }; status?: number } };
            if (e.response?.status === 401) setError('E-mail ou senha incorretos');
            else if (e.response?.data?.message) setError(e.response.data.message);
            else setError('Erro ao conectar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">

            {/* ══════════════════════════════════════════════
          AURORA BACKGROUND
      ══════════════════════════════════════════════ */}
            <div className="fixed inset-0 -z-10">
                {/* Base */}
                <div className="absolute inset-0 bg-[hsl(238,22%,5%)]" />

                {/* Orb 1 — cyan large, top-right */}
                <div
                    className="absolute rounded-full bg-blue-500 opacity-[0.35]"
                    style={{
                        width: 560, height: 560,
                        top: -180, right: -120,
                        filter: 'blur(90px)',
                        animation: 'float 14s ease-in-out infinite',
                    }}
                />

                {/* Orb 2 — teal, bottom-left */}
                <div
                    className="absolute rounded-full bg-blue-500 opacity-[0.2]"
                    style={{
                        width: 420, height: 420,
                        bottom: -160, left: -100,
                        filter: 'blur(90px)',
                        animation: 'float 18s ease-in-out infinite reverse',
                    }}
                />

                {/* Orb 3 — sky, center */}
                <div
                    className="absolute rounded-full bg-sky-500 opacity-[0.13]"
                    style={{
                        width: 260, height: 260,
                        top: '38%', left: '38%',
                        filter: 'blur(80px)',
                        animation: 'float 22s ease-in-out infinite',
                    }}
                />

                {/* Orb 4 — cyan dim, top-left */}
                <div
                    className="absolute rounded-full bg-blue-600 opacity-[0.15]"
                    style={{
                        width: 320, height: 320,
                        top: -60, left: -80,
                        filter: 'blur(80px)',
                        animation: 'float 16s ease-in-out infinite 2s',
                    }}
                />

                {/* Dot grid */}
                <div className="absolute inset-0 dot-grid opacity-[0.35]" />

                {/* Vignette — fades edges so content pops */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, hsl(238,22%,5%) 100%)',
                    }}
                />

                {/* Top + bottom gradient edge fades */}
                <div className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to bottom,
              hsl(238,22%,5%) 0%,
              transparent 10%,
              transparent 90%,
              hsl(238,22%,5%) 100%
            )`,
                    }}
                />
            </div>

            {/* ══════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════ */}
            <div className="w-full max-w-md animate-scale-in relative z-10">

                {/* Live badge */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 text-xs text-blue-300 font-medium">
                        <div className="relative flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-ring" />
                        </div>
                        Sistema de Reativação Comercial
                    </div>
                </div>

                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="relative inline-flex items-center justify-center mb-5">
                        <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 blur-xl opacity-50 animate-pulse" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-2xl glow">
                            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight gradient-text mb-2">Reativa</h1>
                    <p className="text-muted-foreground text-sm">Faça login para continuar</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
                    {/* Top gradient border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

                    <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email-input" className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                                E-mail
                            </Label>
                            <Input
                                id="email-input"
                                type="text"
                                placeholder="seu@email.com"
                                value={login}
                                onChange={e => setLogin(e.target.value)}
                                autoFocus
                                className="bg-white/[0.04] border-white/[0.08] focus:border-blue-500/60 focus-visible:ring-blue-500/20 h-11 placeholder:text-muted-foreground/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password-input" className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                                Senha
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="bg-white/[0.04] border-white/[0.08] focus:border-blue-500/60 focus-visible:ring-blue-500/20 h-11 pr-11 placeholder:text-muted-foreground/40"
                                />
                                <button
                                    type="button"
                                    id="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'w-full h-12 mt-2 font-bold text-sm tracking-wide relative overflow-hidden',
                                'bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600',
                                'hover:from-blue-400 hover:via-blue-400 hover:to-blue-500',
                                'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
                                'transition-all duration-300 hover:-translate-y-0.5',
                                'disabled:opacity-60 disabled:translate-y-0'
                            )}
                        >
                            {!isLoading && (
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer" />
                            )}
                            <span className="relative flex items-center justify-center gap-2">
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
                                    : <>Entrar <LogIn className="w-4 h-4" /></>
                                }
                            </span>
                        </Button>
                    </form>
                </div>

                <p className="text-center text-[11px] text-muted-foreground/40 mt-6">
                    Reativa © 2025 — Sistema Comercial Interno
                </p>
            </div>
        </div>
    );
}
