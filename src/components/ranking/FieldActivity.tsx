import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

function timeAgo(minutes: number) {
    if (minutes < 60) return `Há ${minutes} min`;
    const h = Math.floor(minutes / 60);
    return `Há ${h}h`;
}

interface Activity {
    dotColor: string;
    time: string;
    parts: { text: string; highlight?: boolean }[];
}

function buildActivities(sellers: LeaderboardEntry[]): Activity[] {
    const activities: Activity[] = [];
    let minuteOffset = 5;

    for (const s of sellers.slice(0, 4)) {
        const firstName = s.user.name.split(' ')[0];
        const revenue = Number(s.revenue ?? 0);

        if (s.sales > 0 && revenue > 0) {
            activities.push({
                dotColor: 'bg-lime-400',
                time: timeAgo(minuteOffset),
                parts: [
                    { text: `${firstName} fechou uma venda de ` },
                    { text: BRL.format(revenue), highlight: true },
                ],
            });
            minuteOffset += 10;
        } else if (s.total_reengagements > 0) {
            activities.push({
                dotColor: 'bg-pink-500',
                time: timeAgo(minuteOffset),
                parts: [
                    { text: `${firstName} reengajou ` },
                    { text: `${s.total_reengagements} clientes antigos`, highlight: true },
                ],
            });
            minuteOffset += 15;
        } else {
            activities.push({
                dotColor: 'bg-blue-400',
                time: timeAgo(minuteOffset),
                parts: [{ text: `${firstName} iniciou um novo checkout` }],
            });
            minuteOffset += 20;
        }
    }

    return activities;
}

interface FieldActivityProps {
    sellers: LeaderboardEntry[];
}

export function FieldActivity({ sellers }: FieldActivityProps) {
    const activities = buildActivities(sellers);

    if (activities.length === 0) return null;

    return (
        <motion.div
            className="solid-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.2 }}
        >
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.18em] mb-4">
                Atividade de Campo
            </p>

            <div className="space-y-0">
                {activities.map((a, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center pt-1.5 shrink-0">
                            <div className={cn('w-2 h-2 rounded-full shrink-0', a.dotColor)} />
                            {i < activities.length - 1 && (
                                <div className="w-px flex-1 min-h-[20px] bg-white/5 mt-1" />
                            )}
                        </div>
                        <div className="pb-4">
                            <p className="text-[9px] text-muted-foreground">{a.time}</p>
                            <p className="text-xs leading-snug">
                                {a.parts.map((part, pi) => (
                                    <span
                                        key={pi}
                                        className={part.highlight ? 'text-lime-400 font-bold' : 'text-white/80'}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
