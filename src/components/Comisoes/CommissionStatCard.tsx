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
        <div className="solid-card p-3 sm:p-4 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 truncate">
                        {label}
                    </p>
                    <p className={`text-lg sm:text-2xl font-black tracking-tight ${valueColor} break-words`}>
                        {value}
                    </p>
                </div>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${iconColor}`} />
            </div>
        </div>
    );
}
