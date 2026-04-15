import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CommissionsFiltersProps {
    search: string;
    startDate: string;
    endDate: string;
    onSearchChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export function CommissionsFilters({
    search,
    startDate,
    endDate,
    onSearchChange,
    onStartDateChange,
    onEndDateChange,
    onClearFilters,
    hasActiveFilters,
}: CommissionsFiltersProps) {
    return (
        <div className="solid-card p-3 sm:p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-on-surface-variant" />
                <span className="font-display text-sm font-semibold text-on-surface">Filtros</span>
                {hasActiveFilters && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        ativo
                    </Badge>
                )}
            </div>

            <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3">
                {/* Search Input */}
                <div className="relative w-full md:flex-1 md:min-w-[220px] md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <Input
                        placeholder="digite o login do cliente"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        className="pl-9 h-9 text-sm w-full bg-surface-highest border-none focus-visible:ring-0"
                    />
                </div>

                {/* Date Inputs */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={e => onStartDateChange(e.target.value)}
                        className="h-9 text-xs flex-1 md:flex-none md:w-[150px] bg-surface-highest border-none focus-visible:ring-0"
                        aria-label="Data inicial"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={e => onEndDateChange(e.target.value)}
                        className="h-9 text-xs flex-1 md:flex-none md:w-[150px] bg-surface-highest border-none focus-visible:ring-0"
                        aria-label="Data final"
                    />
                </div>

                <div className="hidden md:block md:flex-1" />

                {/* Clear Button */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    className="h-9 text-xs w-full md:w-auto gap-1.5 text-on-surface-variant hover:text-primary disabled:opacity-40"
                >
                    <X className="w-3.5 h-3.5" />
                    Limpar filtros
                </Button>
            </div>
        </div>
    );
}
