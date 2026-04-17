import { motion } from 'framer-motion';
import { Target, TrendingUp, Flame, Zap } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

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
            {/* Background glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />
                {/* Animated pulse blob */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-primary/8 blur-2xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        >
                            <Target className="w-4 h-4 text-primary" />
                        </motion.div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Meta Global</p>
                    </div>
                    {isComplete ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3" /> Concluída!
                        </span>
                    ) : (
                        <motion.span
                            className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full"
                            key={pctRounded}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            {pctRounded}%
                        </motion.span>
                    )}
                </div>

                {/* Current revenue — animated */}
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Receita atual</p>
                    <AnimatedNumber
                        value={totalRevenue}
                        currency
                        duration={1.6}
                        className="text-2xl font-black text-foreground leading-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        de <span className="font-semibold text-foreground">R$ 100.000</span>
                    </p>
                </div>

                {/* Progress bar with shimmer + milestone */}
                <div className="space-y-2">
                    <div className="relative h-3.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-primary to-secondary relative overflow-hidden"
                            style={{ borderRadius: '0 9999px 9999px 0', minWidth: pct > 0 ? '12px' : '0' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                        >
                            {/* Shimmer sweep inside bar */}
                            <div className="absolute inset-0 w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-sweep" />
                        </motion.div>

                        {/* 50% milestone marker */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/15" />

                        {/* Glowing tip dot */}
                        {pct > 2 && (
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(83_98%_64%/0.8)]"
                                initial={{ left: 0 }}
                                animate={{ left: `calc(${pct}% - 6px)` }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            />
                        )}
                    </div>

                    <div className="flex justify-between text-[10px] text-muted-foreground/60 px-0.5">
                        <span>R$ 0</span>
                        <span className="flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" />50%</span>
                        <span>R$ 100k</span>
                    </div>
                </div>

                {/* Remaining */}
                {!isComplete && (
                    <motion.div
                        className="flex items-center gap-2 rounded-xl bg-primary/8 border border-primary/15 px-3 py-2.5"
                        whileHover={{ scale: 1.02, borderColor: 'hsl(var(--primary) / 0.3)' }}
                        transition={{ type: 'spring', damping: 22 }}
                    >
                        <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Falta para a meta</p>
                            <AnimatedNumber
                                value={remaining}
                                currency
                                duration={1.4}
                                className="text-sm font-bold text-primary"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
