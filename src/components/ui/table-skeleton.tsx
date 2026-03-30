import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type TableSkeletonColumnType = 'text' | 'avatar' | 'badge' | 'button';
export type TableSkeletonAlign = 'left' | 'right' | 'center';

export interface TableSkeletonColumn {
    /** Largura do skeleton (classe tailwind, ex: "w-24") */
    width?: string;
    /** Tipo visual do skeleton */
    type?: TableSkeletonColumnType;
    /** Alinhamento da célula */
    align?: TableSkeletonAlign;
}

interface TableSkeletonProps {
    /** Número de linhas skeleton */
    rows?: number;
    /** Configuração de cada coluna */
    columns: TableSkeletonColumn[];
}

const alignClass: Record<TableSkeletonAlign, string> = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
};

function SkeletonCell({ col }: { col: TableSkeletonColumn }) {
    const { type = 'text', width = 'w-24', align = 'left' } = col;

    if (type === 'avatar') {
        return (
            <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-1.5">
                    <Skeleton className={cn('h-3.5', width)} />
                    <Skeleton className="h-2.5 w-20" />
                </div>
            </div>
        );
    }

    if (type === 'badge') {
        const ml = align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : '';
        return <Skeleton className={cn('h-5 rounded-full', width, ml)} />;
    }

    if (type === 'button') {
        const ml = align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : '';
        return <Skeleton className={cn('h-8 rounded-lg', width, ml)} />;
    }

    // default: text
    const ml = align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : '';
    return <Skeleton className={cn('h-3.5', width, ml)} />;
}

export function TableSkeleton({ rows = 6, columns }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/40">
                    {columns.map((col, colIndex) => (
                        <TableCell
                            key={colIndex}
                            className={cn(alignClass[col.align ?? 'left'])}
                        >
                            <SkeletonCell col={col} />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
