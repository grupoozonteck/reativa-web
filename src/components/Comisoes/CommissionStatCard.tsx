import type { LucideIcon } from "lucide-react";

interface CommissionStatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    iconColor: string;
    valueColor: string;
}

export function CommissionStatCard({
    label,
    value,
    icon: Icon,
    iconColor,
    valueColor,
}: CommissionStatCardProps) {
    return (
        <div className="arena-card p-4 sm:p-5 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2 truncate">
                        {label}
                    </p>
                    <p className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${valueColor} break-words`}>
                        {value}
                    </p>
                </div>
                <div className="bg-surface-highest rounded-xl p-2 flex-shrink-0">
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
