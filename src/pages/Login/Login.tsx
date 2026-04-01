import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    Eye,
    EyeOff,
    Lock,
    Loader2,
    LogIn,
    Mail,
    Shield,
    Trophy,
    Zap
} from 'lucide-react';
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

        if (!login.trim() || !password.trim()) {
            setError('Preencha todos os campos');
            return;
        }

        setIsLoading(true);
        try {
            await loginFunction({ login, password });
            navigate('/');
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string }; status?: number } };
            if (e.response?.status === 401) setError('E-mail ou senha incorretos');
            else if (e.response?.data?.message) setError(e.response.data.message);
            else setError('Erro ao conectar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#040d22] px-4 py-8 text-slate-200">
            <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center rounded">
                <div className="w-full max-w-xl">
                    <header className="mb-10 text-center">

                        <h1 className="text-4xl font-black uppercase italic tracking-tight text-lime-300 sm:text-5xl">
                            REATIVA
                        </h1>
                        <p className="mt-2 text-xs uppercase tracking-[0.32em] text-sky-200/75">
                            Domine o jogo das vendas
                        </p>
                    </header>

                    <section className="rounded-2xl border border-slate-700/60 bg-[#0a173a]/85 p-6 shadow-[0_24px_60px_rgba(2,8,24,0.7)] sm:p-8">
                        <div className="mb-6 flex gap-5">
                            <span className="w-[3px] rounded-full bg-lime-300 shadow-[0_0_20px_rgba(164,255,66,0.65)]" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">Bem-vindo!</h2>
                                <p className="mt-2 text-sm text-slate-300/70">
                                    Insira suas credenciais para acessar o painel
                                </p>
                            </div>
                        </div>

                        <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email-input" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/80">
                                    E-mail
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email-input"
                                        type="text"
                                        placeholder="seu@email.com.br"
                                        value={login}
                                        onChange={e => setLogin(e.target.value)}
                                        autoFocus
                                        className="h-12 border-slate-700/90 bg-[#121f45] pl-10 text-slate-100 placeholder:text-slate-400/60 focus-visible:ring-lime-300/30"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password-input" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/80">
                                        Senha
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="h-12 border-slate-700/90 bg-[#121f45] pl-10 pr-11 text-slate-100 placeholder:text-slate-400/60 focus-visible:ring-lime-300/30"
                                    />
                                    <button
                                        type="button"
                                        id="toggle-password"
                                        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-100"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                id="login-submit"
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    'mt-2 h-12 w-full rounded-lg font-bold uppercase tracking-wide text-[#18210a]',
                                    'bg-gradient-to-r from-lime-300 to-lime-400 hover:from-lime-200 hover:to-lime-300',
                                    'shadow-[0_0_28px_rgba(164,255,66,0.35)] transition-all duration-200',
                                    'disabled:cursor-not-allowed disabled:opacity-60'
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {isLoading
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Entrando...</>
                                        : <>Entrar na Arena <LogIn className="h-4 w-4" /></>
                                    }
                                </span>
                            </Button>
                        </form>
                    </section>

                </div>
            </div>
        </div>
    );
}
