export const statusStyleMap: Record<number, { color: string; dotColor: string }> = {
    1: {
        color: 'border-secondary/20 bg-secondary/10 text-secondary',
        dotColor: 'bg-secondary',
    },
    2: {
        color: 'border-primary/20 bg-primary/10 text-primary',
        dotColor: 'bg-primary',
    },
    3: {
        color: 'border-accent/20 bg-accent/10 text-accent',
        dotColor: 'bg-accent',
    },
    4: {
        color: 'border-destructive/20 bg-destructive/10 text-destructive',
        dotColor: 'bg-destructive',
    },
};

export function getAttendantStatusMeta(status?: number | null) {
    const label = status === 1 ? 'Ativo' : status === 0 ? 'Inativo' : 'Sem status';
    const style =
        status === 1
            ? {
                color: 'border-secondary/20 bg-secondary/10 text-secondary',
                dotColor: 'bg-secondary',
            }
            : status === 0
                ? {
                    color: 'border-destructive/20 bg-destructive/10 text-destructive',
                    dotColor: 'bg-destructive',
                }
                : null;

    return {
        label,
        color: style?.color ?? 'text-muted-foreground bg-muted/40 border-border/60',
        dotColor: style?.dotColor ?? 'bg-muted-foreground/50',
    };
}


export const typeColors: Record<number, string> = {
    1: 'border-secondary/20 bg-secondary/10 text-secondary',
    2: 'border-primary/20 bg-primary/10 text-primary',
    3: 'border-accent/20 bg-accent/10 text-accent',
};


export const reengagementStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Em Atendimento', color: 'border-secondary/20 bg-secondary/10 text-secondary' },
    2: { label: 'Reativado', color: 'border-primary/20 bg-primary/10 text-primary' },
};
