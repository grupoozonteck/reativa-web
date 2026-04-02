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
            className="glass-card rounded-2xl overflow-hidden relative"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.3 }}
        >
            {/* Background grid/cityscape decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Perspective grid lines */}
                <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                        <line key={`v${i}`} x1={i * 30} y1={0} x2={150} y2={80} stroke="#4ade80" strokeWidth="0.5" />
                    ))}
                    {[0, 1, 2, 3, 4].map(i => (
                        <line key={`h${i}`} x1={0} y1={i * 20} x2={300} y2={i * 20} stroke="#4ade80" strokeWidth="0.3" opacity={0.5 - i * 0.08} />
                    ))}
                </svg>
                {/* Cityscape silhouette */}
                <svg className="absolute bottom-0 left-0 right-0 w-full opacity-15" height="50" viewBox="0 0 300 50" preserveAspectRatio="none">
                    <path d="M0 50 L0 30 L20 30 L20 20 L30 20 L30 30 L50 30 L50 15 L60 15 L60 10 L70 10 L70 15 L80 15 L80 30 L100 30 L100 22 L110 22 L110 12 L120 12 L120 22 L130 22 L130 30 L150 30 L150 18 L160 18 L160 8 L170 8 L170 18 L180 18 L180 30 L200 30 L200 25 L210 25 L210 15 L220 15 L220 25 L230 25 L230 30 L250 30 L250 20 L260 20 L260 14 L270 14 L270 20 L280 20 L280 30 L300 30 L300 50 Z"
                          fill="#4ade80" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#0d1117]/80" />
            </div>

            <div className="relative z-10 p-5">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.18em]">
                        Meta Global
                    </p>
                    <span className="text-xs font-bold text-white">{pct}%</span>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                    {BRL.format(totalRevenue)} / {BRL.format(GOAL)}
                </p>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-lime-600 to-lime-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
