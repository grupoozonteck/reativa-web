export const statusStyleMap: Record<number, { color: string; dotColor: string }> = {
    1: {
        color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
        dotColor: 'bg-blue-500',
    },
    2: {
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
        dotColor: 'bg-emerald-500',
    },
    3: {
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
        dotColor: 'bg-amber-500',
    },
    4: {
        color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
        dotColor: 'bg-rose-500',
    },
};

export function getAttendantStatusMeta(status?: number | null) {
    const label = status === 1 ? 'Ativo' : status === 0 ? 'Inativo' : 'Sem status';
    const style =
        status === 1
            ? {
                color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
                dotColor: 'bg-emerald-500',
            }
            : status === 0
                ? {
                    color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
                    dotColor: 'bg-rose-500',
                }
                : null;

    return {
        label,
        color: style?.color ?? 'text-muted-foreground bg-muted/40 border-border/60',
        dotColor: style?.dotColor ?? 'bg-muted-foreground/50',
    };
}


 export const typeColors: Record<number, string> = {
    1: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    2: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    3: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
};


export const reengagementStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Em Atendimento', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
    2: { label: 'Reativado', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
};
