import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type AttendantsFilters } from '@/services/team.service';

interface AttendantsFiltersProps {
    filters: AttendantsFilters;
    types?: Record<string, string>;
    countries?: {
        acronym: string;
        code: string;
        name: string;
    }[];
    onChange: (filters: AttendantsFilters) => void;
}

export function AttendantsFiltersBar({ filters, types = {}, countries = [], onChange }: AttendantsFiltersProps) {
    const hasActiveFilters = filters.search || filters.type || filters.country_code;

    function clearFilters() {
        onChange({ search: undefined, type: undefined, country_code: undefined });
    }

    return (
        <div className="solid-card p-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-">
                {/* Busca */}
                <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={filters.search ?? ''}
                        onChange={e => onChange({ ...filters, search: e.target.value || undefined })}
                        placeholder="Buscar por nome, login ou email..."
                        className="pl-9 h-9"
                    />
                </div>

                <div className='w-full lg:w-auto flex flex-col lg:flex-row gap-3'>

                    {Object.keys(types).length > 0 && (
                        <Select
                            value={filters.type !== undefined ? String(filters.type) : 'all'}
                            onValueChange={value =>
                                onChange({ ...filters, type: value === 'all' ? undefined : Number(value) })
                            }
                        >
                            <SelectTrigger className="h-9 w-full lg:w-44 text-sm">
                                <SelectValue placeholder="Todos os cargos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os cargos</SelectItem>
                                {Object.entries(types).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Filtro por país */}
                    {countries.length > 0 && (
                        <Select
                            value={filters.country_code ?? 'all'}
                            onValueChange={value => onChange({ ...filters, country_code: value === 'all' ? undefined : value })}
                        >
                            <SelectTrigger className="h-9 w-full lg:w-48 text-sm">
                                <SelectValue placeholder="Todos os países" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os países</SelectItem>
                                {countries.map(c => (
                                    <SelectItem key={c.acronym} value={c.acronym}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {hasActiveFilters && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={clearFilters}
                            className="gap-1.5  hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar
                        </Button>
                    )}
                </div>

            </div>
        </div>
    );
}
