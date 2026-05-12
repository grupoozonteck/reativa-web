import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field';
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
        <div className="solid-card animate-fade-in p-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onApply();
                }}
                className="flex flex-col gap-4"
            >
                <FieldGroup className="gap-4 xl:flex-row xl:items-end">
                    <Field className="w-full gap-1.5 xl:min-w-0 xl:flex-1">
                        <FieldLabel>Busca</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={filters.search ?? ''}
                                    onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
                                    placeholder="Buscar por login, nome ou email..."
                                    className="h-10 pl-9"
                                />
                            </div>
                        </FieldContent>
                    </Field>

                    <div className="flex w-full flex-col items-end gap-3 sm:flex-row sm:flex-wrap sm:items-end xl:w-auto xl:flex-nowrap">
                        {Object.keys(types).length > 0 && (
                            <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                                <FieldLabel>Cargo</FieldLabel>
                                <FieldContent>
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
                                </FieldContent>
                            </Field>
                        )}

                        {Object.keys(statusOptions).length > 0 && (
                            <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                                <FieldLabel>Status</FieldLabel>
                                <FieldContent>
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
                                </FieldContent>
                            </Field>
                        )}

                        {countries.length > 0 && (
                            <Field className="w-full gap-1.5 sm:w-[180px] xl:w-[180px] xl:flex-none">
                                <FieldLabel>Pais</FieldLabel>
                                <FieldContent>
                                    <Select
                                        value={filters.country_code ?? 'all'}
                                        onValueChange={(value) =>
                                            onChange({ ...filters, country_code: value === 'all' ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-full text-sm">
                                            <SelectValue placeholder="Todos os paises" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os paises</SelectItem>
                                            {countries.map((country) => (
                                                <SelectItem key={country.acronym} value={country.acronym}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FieldContent>
                            </Field>
                        )}

                        <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row">
                            <Button
                                type="submit"
                                disabled={isApplying || !hasDraftChanges}
                                className="h-10 w-full sm:w-[112px] xl:w-[112px]"
                            >
                                <Filter data-icon="inline-start" />
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClear}
                                disabled={isApplying}
                                className="h-10 w-full sm:w-[152px] xl:w-[152px]"
                            >
                                <X data-icon="inline-start" />
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                </FieldGroup>
            </form>
        </div>
    );
}
