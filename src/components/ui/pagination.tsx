import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
    page: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    isFetching?: boolean;
    className?: string;
}

export function Pagination({
    page,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    isFetching,
    className = '',
}: PaginationProps) {
    return (
        <div
            className={`flex items-center justify-between px-5 py-3 border-t border-border ${className}`}
        >
            <span className="text-xs text-muted-foreground">Página {page}</span>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onPrev}
                    disabled={!hasPrev || isFetching}
                    className="h-8 w-8 p-0 disabled:opacity-30"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onNext}
                    disabled={!hasNext || isFetching}
                    className="h-8 w-8 p-0 disabled:opacity-30"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
