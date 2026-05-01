import { CalendarRange, RefreshCcw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface DateRangeFilterCardProps {
    title?: string;
    description?: string;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
    onRefresh?: () => void;
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
    description = 'Os campos sao enviados ao backend como start_date e end_date.',
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApply,
    onClear,
    onRefresh,
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
        <div className={cn('solid-card p-4 animate-fade-in', className)}>
            <div className="flex items-center gap-2 mb-3">
                <CalendarRange className="w-4 h-4 text-on-surface-variant" />
                <span className="font-display text-sm font-semibold text-on-surface">{title}</span>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onApply();
                }}
                className="space-y-3"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_180px_minmax(0,1fr)]">
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

                    <div className="hidden md:flex items-end text-xs text-on-surface-variant">
                        {description}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-xs text-on-surface-variant md:hidden">
                        {description}
                    </div>

                    <div className="text-xs text-on-surface-variant">
                        {hasActiveFilters ? 'Periodo aplicado na consulta atual.' : 'Usando o periodo padrao atual.'}
                        {hasDraftChanges && ' Existem alteracoes pendentes para aplicar.'}
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isFetching || !hasDraftChanges}
                            className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 h-9 text-xs font-semibold w-full md:w-auto"
                        >
                            <Search className="w-3.5 h-3.5" />
                            {applyLabel}
                        </Button>
                        {onRefresh && (
                            <Button
                                size="sm"
                                type="button"
                                onClick={onRefresh}
                                disabled={isFetching}
                                className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow gap-1.5 h-9 text-xs font-semibold w-full md:w-auto"
                            >
                                <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                                {isFetching ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                        )}
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={onClear}
                            disabled={disableClear}
                            className="h-9 text-xs w-full md:w-auto gap-1.5 text-on-surface-variant hover:text-primary disabled:opacity-40"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
