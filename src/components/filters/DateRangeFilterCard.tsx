import { CalendarRange, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface DateRangeFilterCardProps {
    title?: string;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
    isFetching?: boolean;
    hasActiveFilters?: boolean;
    hasDraftChanges?: boolean;
    applyLabel?: string;
    className?: string;
    startId?: string;
    endId?: string;
}

export function DateRangeFilterCard({
    title = 'Periodo',
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApply,
    onClear,
    isFetching = false,
    hasActiveFilters = false,
    hasDraftChanges = false,
    applyLabel = 'Aplicar periodo',
    className,
    startId = 'start-date',
    endId = 'end-date',
}: DateRangeFilterCardProps) {
    const disableClear = !hasActiveFilters && !hasDraftChanges;

    return (
        <div className={cn('solid-card animate-fade-in p-4', className)}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onApply();
                }}
                className="space-y-3"
            >
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[180px_180px_180px_minmax(0,1fr)] lg:items-end">
                    <div className="flex items-center gap-2 self-start lg:self-center">
                        <CalendarRange className="h-4 w-4 text-on-surface-variant" />
                        <div>
                            <span className="font-display text-sm font-semibold text-on-surface">{title}</span>
                            <p className="mt-0.5 text-xs text-on-surface-variant">
                                {hasActiveFilters ? 'Periodo aplicado' : 'Mes atual'}
                            </p>
                        </div>
                    </div>

                    <Field>
                        <FieldLabel htmlFor={startId}>Data inicial</FieldLabel>
                        <Input
                            id={startId}
                            type="date"
                            value={startDate}
                            onChange={(event) => onStartDateChange(event.target.value)}
                            className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor={endId}>Data final</FieldLabel>
                        <Input
                            id={endId}
                            type="date"
                            value={endDate}
                            onChange={(event) => onEndDateChange(event.target.value)}
                            className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                        />
                    </Field>

                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isFetching || !hasDraftChanges}
                            className="h-9 w-full gap-1.5 text-xs font-semibold sm:w-auto"
                        >
                            <Search className="w-3.5 h-3.5" />
                            {applyLabel}
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={onClear}
                            disabled={disableClear}
                            className="h-9 w-full gap-1.5 text-xs sm:w-auto"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>
                {hasDraftChanges && (
                    <p className="text-xs text-primary">Alteracoes pendentes.</p>
                )}
            </form>
        </div>
    );
}
