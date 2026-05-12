import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import { type AttendantsFilters } from '@/services/team.service';

interface AttendantsFiltersProps {
    filters: AttendantsFilters;
    types?: Record<string, string>;
    statusOptions?: Record<string, string>;
    countries?: {
        acronym: string;
        code: string;
        name: string;
    }[];
    hasDraftChanges: boolean;
    isApplying?: boolean;
    onChange: (filters: AttendantsFilters) => void;
    onApply: () => void;
    onClear: () => void;
}

export function AttendantsFiltersBar({
    filters,
    types = {},
    statusOptions = {},
    countries = [],
    hasDraftChanges,
    isApplying = false,
    onChange,
    onApply,
    onClear,
}: AttendantsFiltersProps) {
    return (
        <div className="solid-card p-4 animate-fade-in">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onApply();
                }}
                className="flex flex-col gap-4 xl:flex-row xl:items-end"
            >
                <Field className="w-full gap-1.5 xl:min-w-0 xl:flex-1">
                    <FieldLabel>Busca</FieldLabel>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search ?? ''}
                            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
                            placeholder="Buscar por login, nome ou email..."
                            className="h-10 pl-9"
                        />
                    </div>
                </Field>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end xl:w-auto xl:flex-nowrap">
                    {Object.keys(types).length > 0 && (
                        <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                            <FieldLabel>Cargo</FieldLabel>
                            <Select
                                value={filters.type !== undefined ? String(filters.type) : 'all'}
                                onValueChange={(value) =>
                                    onChange({ ...filters, type: value === 'all' ? undefined : Number(value) })
                                }
                            >
                                <SelectTrigger className="h-10 w-full text-sm">
                                    <SelectValue placeholder="Todos os cargos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os cargos</SelectItem>
                                    {Object.entries(types).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    {Object.keys(statusOptions).length > 0 && (
                        <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                            <FieldLabel>Status</FieldLabel>
                            <Select
                                value={filters.status !== undefined ? String(filters.status) : '1'}
                                onValueChange={(value) => onChange({ ...filters, status: Number(value) })}
                            >
                                <SelectTrigger className="h-10 w-full text-sm">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusOptions).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    {countries.length > 0 && (
                        <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                            <FieldLabel>País</FieldLabel>
                            <Select
                                value={filters.country_code ?? 'all'}
                                onValueChange={(value) =>
                                    onChange({ ...filters, country_code: value === 'all' ? undefined : value })
                                }
                            >
                                <SelectTrigger className="h-10 w-full text-sm">
                                    <SelectValue placeholder="Todos os países" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os países</SelectItem>
                                    {countries.map((country) => (
                                        <SelectItem key={country.acronym} value={country.acronym}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row items-end">
                        <Button
                            type="submit"
                            disabled={isApplying || !hasDraftChanges}
                            className="h-10 w-full sm:w-[112px] xl:w-[112px]"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Filtrar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onClear}
                            disabled={isApplying}
                            className="h-10 w-full gap-1.5 sm:w-[152px] xl:w-[152px]"
                        >
                            <X className="h-3.5 w-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
