import { motion } from 'framer-motion';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const GOAL = 100_000;

interface GlobalGoalProps {
    totalRevenue: number;
}

export function GlobalGoal({ totalRevenue }: GlobalGoalProps) {
    const pct = Math.min(Math.round((totalRevenue / GOAL) * 100), 100);

    return (
        <motion.div
            className="solid-card relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.3 }}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <line key={`v${i}`} x1={i * 30} y1={0} x2={150} y2={80} stroke="hsl(var(--primary))" strokeWidth="0.5" />
                    ))}
                    {[0, 1, 2, 3, 4].map((i) => (
                        <line key={`h${i}`} x1={0} y1={i * 20} x2={300} y2={i * 20} stroke="hsl(var(--primary))" strokeWidth="0.3" opacity={0.5 - i * 0.08} />
                    ))}
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/80" />
            </div>

            <div className="relative z-10 p-5">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary">Meta Global</p>
                    <span className="text-xs font-bold text-foreground">{pct}%</span>
                </div>

                <p className="mb-3 text-xs text-muted-foreground">
                    {BRL.format(totalRevenue)} / {BRL.format(GOAL)}
                </p>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
