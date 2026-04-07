import { cn } from '@/lib/utils';
import { getAttendantStatusMeta } from '@/utils/color-ultis';

interface StatusBadgeProps {
    status?: number | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const { color, dotColor, label } = getAttendantStatusMeta(status);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2',
                color,
            )}
        >
            <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
            {label}
        </span>
    );
}
