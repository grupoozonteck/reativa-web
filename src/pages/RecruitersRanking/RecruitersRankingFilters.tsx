import { Search, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface RecruitersRankingFiltersProps {
    participants: number;
    isFetching: boolean;
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    rankingType: '0' | '1';
    onRankingTypeChange: (value: '0' | '1') => void;
    minValueDisplay: string;
    onMinValueChange: (value: string) => void;
    onRefresh: () => void;
    onApply: () => void;
    onClear: () => void;
    hasActiveFilters: boolean;
    hasDraftChanges: boolean;
    startDateId?: string;
    endDateId?: string;
}

export function RecruitersRankingFilters({
    participants,
    isFetching,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    rankingType,
    onRankingTypeChange,
    minValueDisplay,
    onMinValueChange,
    onRefresh,
    onApply,
    onClear,
    hasActiveFilters,
    hasDraftChanges,
    startDateId = 'recruiters-start-date',
    endDateId = 'recruiters-end-date',
}: RecruitersRankingFiltersProps) {
    const disableClear = !hasActiveFilters && !hasDraftChanges;

    return (
        <div className="solid-card p-4">
            {/* HEADER */}
            <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                        <Trophy className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black leading-none tracking-tight">
                            Ranking de Recrutadores
                        </h1>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0"
                    disabled={isFetching}
                    onClick={onRefresh}
                >
                    {isFetching && <Spinner />}

                    {isFetching ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </div>

            {/* FILTROS */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onApply();
                }}
            >
                <div className="flex flex-wrap items-end gap-4">
                    <Field className="w-[160px]">
                        <FieldLabel htmlFor={startDateId}>
                            Data inicial
                        </FieldLabel>
                        <Input
                            id={startDateId}
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="date-input-trigger h-9 w-full border-none bg-surface-highest focus-visible:ring-0"
                        />
                    </Field>

                    <Field className="w-[160px]">
                        <FieldLabel htmlFor={endDateId}>
                            Data final
                        </FieldLabel>
                        <Input
                            id={endDateId}
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="date-input-trigger h-9 w-full border-none bg-surface-highest focus-visible:ring-0"
                        />
                    </Field>

                    <Field className="w-[180px]">
                        <FieldLabel htmlFor="recruiters-ranking-type">
                            Ordenar por
                        </FieldLabel>
                        <Select
                            value={rankingType}
                            onValueChange={(v) =>
                                onRankingTypeChange(v as '0' | '1')
                            }
                        >
                            <SelectTrigger
                                id="recruiters-ranking-type"
                                className="h-9 w-full border-none bg-surface-highest px-3 text-left focus:ring-0 md:text-sm [&>span]:line-clamp-1 [&>span]:text-left"
                            >
                                <SelectValue placeholder="Selecione a ordenação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">
                                    Qtd. recrutamentos
                                </SelectItem>
                                <SelectItem value="1">
                                    Valor de venda
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field className="w-[180px]">
                        <FieldLabel htmlFor="recruiters-ranking-min-value">
                            Valor mínimo
                        </FieldLabel>
                        <Input
                            id="recruiters-ranking-min-value"
                            type="text"
                            inputMode="numeric"
                            value={minValueDisplay}
                            onChange={(e) => onMinValueChange(e.target.value)}
                            placeholder="R$ 0,00"
                            className="h-9 border-none bg-surface-highest font-medium tabular-nums"
                        />
                    </Field>

                    <div className="ml-auto flex gap-2 w-full sm:w-auto">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isFetching || !hasDraftChanges}
                            className="h-9 flex-1 gap-1.5 text-xs font-semibold sm:flex-initial"
                        >
                            <Search className="h-3.5 w-3.5" />
                            Filtrar
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={onClear}
                            disabled={disableClear}
                            className="h-9 flex-1 gap-1.5 text-xs sm:flex-initial"
                        >
                            <X className="h-3.5 w-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>

                {hasDraftChanges && (
                    <p className="mt-3 text-xs text-primary">
                        Alterações pendentes.
                    </p>
                )}
            </form>
        </div>
    );
}
