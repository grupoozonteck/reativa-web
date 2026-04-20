import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerDetailInfoItemProps {
    icon: LucideIcon;
    iconBg: string;
    label: ReactNode;
}

export function CustomerDetailInfoItem({ icon: Icon, iconBg, label }: CustomerDetailInfoItemProps) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-on-surface-variant">{label}</div>
        </div>
    );
}
