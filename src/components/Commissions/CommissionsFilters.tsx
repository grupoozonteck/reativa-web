import { CalendarRange, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';

interface CommissionsFiltersProps {
    search: string;
    startDate: string;
    endDate: string;
    onSearchChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    hasDraftChanges: boolean;
    isFetching?: boolean;
}

export function CommissionsFilters({
    search,
    startDate,
    endDate,
    onSearchChange,
    onStartDateChange,
    onEndDateChange,
    onApplyFilters,
    onClearFilters,
    hasActiveFilters,
    hasDraftChanges,
    isFetching = false,
}: CommissionsFiltersProps) {
    return (
        <div className="solid-card p-3 sm:p-4 animate-fade-in">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onApplyFilters();
                }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <CalendarRange className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-display text-sm font-semibold text-on-surface">Filtros</span>
                    {hasActiveFilters && (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                            ativo
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.4fr)_180px_180px_minmax(0,1fr)] xl:items-end">
                    <Field>
                        <FieldLabel htmlFor="commissions-search">Login</FieldLabel>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <Input
                                id="commissions-search"
                                placeholder="Digite o login do cliente"
                                value={search}
                                onChange={e => onSearchChange(e.target.value)}
                                className="pl-9 h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                            />
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="commissions-start-date">Data inicial</FieldLabel>
                        <Input
                            id="commissions-start-date"
                            type="date"
                            value={startDate}
                            onChange={e => onStartDateChange(e.target.value)}
                            className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="commissions-end-date">Data final</FieldLabel>
                        <Input
                            id="commissions-end-date"
                            type="date"
                            value={endDate}
                            onChange={e => onEndDateChange(e.target.value)}
                            className="h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                        />
                    </Field>

                    <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isFetching || !hasDraftChanges}
                            className="h-9 w-full gap-1.5 text-xs font-semibold sm:w-auto"
                        >
                            <Search className="w-3.5 h-3.5" />
                            Filtrar
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={onClearFilters}
                            disabled={!hasActiveFilters && !hasDraftChanges}
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
