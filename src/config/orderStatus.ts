import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const orderStatusStyleMap: Record<number, { color: string; icon: typeof CheckCircle2 }> = {
    1: { color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', icon: Clock },
    2: { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2 },
    3: { color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20', icon: XCircle },
    5: { color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20', icon: AlertCircle },
};

export const deliveryStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Aguardando', color: 'text-amber-600 dark:text-amber-400' },
    2: { label: 'Em preparação', color: 'text-blue-600 dark:text-blue-400' },
    3: { label: 'Enviado', color: 'text-violet-600 dark:text-violet-400' },
    4: { label: 'Entregue', color: 'text-emerald-600 dark:text-emerald-400' },
};
