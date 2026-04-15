import { motion } from 'framer-motion';
import { Target, TrendingUp, Flame } from 'lucide-react';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const GOAL = 100_000;

interface GlobalGoalProps {
    totalRevenue: number;
}

export function GlobalGoal({ totalRevenue }: GlobalGoalProps) {
    const pct = Math.min((totalRevenue / GOAL) * 100, 100);
    const pctRounded = Math.round(pct);
    const remaining = Math.max(GOAL - totalRevenue, 0);
    const isComplete = totalRevenue >= GOAL;

    return (
        <motion.div
            className="solid-card relative overflow-hidden rounded-2xl border border-primary/20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.3 }}
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />
            </div>

            <div className="relative z-10 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                            <Target className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Meta Global</p>
                    </div>
                    {isComplete ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3" /> Concluída!
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">
                            {pctRounded}%
                        </span>
                    )}
                </div>

                {/* Current revenue */}
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Receita atual</p>
                    <p className="text-2xl font-black text-foreground leading-none">
                        {BRL.format(totalRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        de <span className="font-semibold text-foreground">{BRL.format(GOAL)}</span>
                    </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-primary to-secondary relative"
                            style={{ borderRadius: '0 9999px 9999px 0', minWidth: pct > 0 ? '12px' : '0' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                        />
                    </div>
                </div>

                {/* Remaining */}
                {!isComplete && (
                    <div className="flex items-center gap-2 rounded-xl bg-primary/8 border border-primary/15 px-3 py-2.5">
                        <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Falta para a meta</p>
                            <p className="text-sm font-bold text-primary">{BRL.format(remaining)}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
