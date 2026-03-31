import { TableRow, TableCell } from '@/components/ui/table';

export function SkeletonRow() {
    return (
        <TableRow className="border-none">
            <TableCell className="py-3">
                <div className="h-3.5 w-10 rounded-md bg-surface-container animate-pulse" />
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 rounded-md bg-surface-container animate-pulse" />
                        <div className="h-3 w-40 rounded-md bg-surface-container animate-pulse" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <div className="h-3.5 w-32 rounded-md bg-surface-container animate-pulse" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-5 w-24 rounded-full bg-surface-container animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-3.5 w-20 rounded-md bg-surface-container animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-right">
                <div className="h-7 w-14 rounded-lg bg-surface-container animate-pulse ml-auto" />
            </TableCell>
        </TableRow>
    );
}
