import { CheckCircle2, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RevenueMilestoneModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDisable: () => void;
    onViewReport: () => void;
    revenue: number;
    goal: number;
}

const confettiColors = [
    '#A3FF12',
    '#22C55E',
    '#38BDF8',
    '#F59E0B',
    '#F472B6',
    '#A855F7',
];

export function RevenueMilestoneModal({
    open,
    onOpenChange,
    onDisable,
    onViewReport,
    revenue,
    goal,
}: RevenueMilestoneModalProps) {
    const progress = Math.min((revenue / goal) * 100, 100);

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[88vh] w-[calc(100vw-1.5rem)] overflow-y-auto overflow-x-hidden border border-primary/15 bg-[#0b1324] p-0 text-white shadow-2xl shadow-primary/10 sm:max-h-[90vh] sm:max-w-[760px]">
                <div className="relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(163,255,18,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_36%)]" />

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {Array.from({ length: 16 }).map((_, index) => (
                            <span
                                key={index}
                                className="absolute h-2 w-2 rounded-sm opacity-80"
                                style={{
                                    left: `${5 + ((index * 5.7) % 88)}%`,
                                    top: '-12px',
                                    backgroundColor:
                                        confettiColors[
                                            index % confettiColors.length
                                        ],
                                    animation: `confetti-fall ${1.5 + (index % 4) * 0.2}s ease-out ${(index % 5) * 0.12}s forwards`,
                                    transform: `rotate(${index * 22}deg)`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative p-4 sm:p-6">
                        <div className="space-y-6">
                            <div className="space-y-4 pr-8">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_28px_rgba(163,255,18,0.15)]">
                                    <CheckCircle2 className="h-7 w-7" />
                                </div>

                                <DialogHeader className="space-y-3 text-left">
                                    <DialogTitle className="max-w-[12ch] text-3xl font-black leading-[1.02] tracking-tight text-white sm:max-w-[14ch] sm:text-[3.25rem]">
                                        Parabens, meta alcancada
                                    </DialogTitle>
                                    <DialogDescription className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                                        {`A equipe fechou ${currencyFormatter.format(revenue)} no periodo e ultrapassou a meta mensal de ${currencyFormatter.format(goal)}.`}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Receita atual
                                    </p>
                                    <p className="mt-2 text-xl font-black tabular-nums text-primary sm:text-2xl">
                                        {currencyFormatter.format(revenue)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Meta
                                    </p>
                                    <p className="mt-2 text-xl font-black tabular-nums text-white sm:text-2xl">
                                        {currencyFormatter.format(goal)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 sm:col-span-2 xl:col-span-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/75">
                                            Meta
                                        </p>
                                        <span className="shrink-0 rounded-full bg-emerald-400/12 px-2 py-1 text-[10px] font-semibold leading-none text-emerald-300">
                                            Meta batida
                                        </span>
                                    </div>
                                    <p className="mt-4 text-[2.1rem] font-black leading-none tabular-nums text-emerald-300">
                                        {`${progress.toFixed(1)}%`}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                        <Target className="h-4 w-4 text-primary" />
                                        Corrida da meta
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                                        <TrendingUp className="h-4 w-4" />
                                        Objetivo concluido
                                    </div>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary via-lime-300 to-emerald-400 shadow-[0_0_18px_rgba(163,255,18,0.35)] transition-all duration-700"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 border-t border-white/8 pt-3">
                                <div className="flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-300">
                                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                    <span>
                                        Abra o resumo para ver os numeros do
                                        periodo, quem mais vendeu e a sequencia
                                        das ultimas vendas.
                                    </span>
                                </div>

                                <div className="grid w-full gap-2 md:grid-cols-3">
                                    <Button
                                        type="button"
                                        onClick={onViewReport}
                                        className="h-11 w-full bg-primary text-slate-950 hover:bg-primary/90"
                                    >
                                        Ver resumo
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onDisable}
                                        className="h-11 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                                    >
                                        Nao mostrar novamente
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => onOpenChange(false)}
                                        className="h-11 w-full bg-white/10 text-white hover:bg-white/15"
                                    >
                                        Fechar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
