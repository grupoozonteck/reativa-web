import { type LucideIcon } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableEmptyStateProps {
    /** Número de colunas que o cell deve ocupar */
    colSpan: number;
    /** Ícone lucide a exibir */
    icon: LucideIcon;
    /** Mensagem principal */
    message: string;
    /** Descrição secundária (opcional) */
    description?: string;
    /** Classe extra para a linha */
    className?: string;
}

export function TableEmptyState({
    colSpan,
    icon: Icon,
    message,
    description,
    className,
}: TableEmptyStateProps) {
    return (
        <TableRow className={cn('hover:bg-transparent', className)}>
            <TableCell colSpan={colSpan} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-muted/50">
                        <Icon className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{message}</p>
                    {description && (
                        <p className="text-muted-foreground/60 text-xs">{description}</p>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
