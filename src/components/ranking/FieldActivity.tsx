import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from './types';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

function timeAgo(minutes: number) {
    if (minutes < 60) return `Ha ${minutes} min`;
    const h = Math.floor(minutes / 60);
    return `Ha ${h}h`;
}

interface Activity {
    dotColor: string;
    time: string;
    parts: { text: string; highlight?: boolean }[];
}

function buildActivities(sellers: LeaderboardEntry[]): Activity[] {
    const activities: Activity[] = [];
    let minuteOffset = 5;

    for (const seller of sellers.slice(0, 4)) {
        const firstName = seller.user.name.split(' ')[0];
        const revenue = Number(seller.revenue ?? 0);

        if (seller.sales > 0 && revenue > 0) {
            activities.push({
                dotColor: 'bg-primary',
                time: timeAgo(minuteOffset),
                parts: [
                    { text: `${firstName} fechou uma venda de ` },
                    { text: BRL.format(revenue), highlight: true },
                ],
            });
            minuteOffset += 10;
        } else if (seller.total_reengagements > 0) {
            activities.push({
                dotColor: 'bg-accent',
                time: timeAgo(minuteOffset),
                parts: [
                    { text: `${firstName} reengajou ` },
                    { text: `${seller.total_reengagements} clientes antigos`, highlight: true },
                ],
            });
            minuteOffset += 15;
        } else {
            activities.push({
                dotColor: 'bg-secondary',
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
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Atividade de Campo
            </p>

            <div className="space-y-0">
                {activities.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="flex shrink-0 flex-col items-center pt-1.5">
                            <div className={cn('h-2 w-2 rounded-full', activity.dotColor)} />
                            {index < activities.length - 1 && (
                                <div className="mt-1 min-h-[20px] w-px flex-1 bg-border/60" />
                            )}
                        </div>
                        <div className="pb-4">
                            <p className="text-[9px] text-muted-foreground">{activity.time}</p>
                            <p className="text-xs leading-snug text-foreground/85">
                                {activity.parts.map((part, partIndex) => (
                                    <span
                                        key={partIndex}
                                        className={part.highlight ? 'font-bold text-primary' : 'text-foreground/85'}
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
