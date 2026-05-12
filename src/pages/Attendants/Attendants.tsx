import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCog, Plus } from 'lucide-react';
import { teamService, type AttendantsFilters } from '@/services/team.service';
import { utilsService } from '@/services/utils.service';
import { AttendantsList } from '@/components/Attendants/AttendantsList';
import { AttendantsFiltersBar } from '@/components/Attendants/AttendantsFiltersBar';
import { CreateAttendantModal } from '@/components/Attendants/CreateAttendantModal';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

const DEFAULT_FILTERS: AttendantsFilters = { status: 1 };

export default function Atendentes() {
    const [filters, setFilters] = useState<AttendantsFilters>({ ...DEFAULT_FILTERS });
    const [appliedFilters, setAppliedFilters] = useState<AttendantsFilters>({ ...DEFAULT_FILTERS });
    const [countriesOptions, setCountriesOptions] = useState<
        {
            acronym: string;
            code: string;
            name: string;
        }[]
    >([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const debouncedSearch = useDebounce(appliedFilters.search ?? '', 400);

    const attendantsQuery = useQuery({
        queryKey: ['attendants', debouncedSearch, appliedFilters.type, appliedFilters.status, appliedFilters.country_code],
        queryFn: () =>
            teamService.getAttendants({
                search: debouncedSearch || undefined,
                type: appliedFilters.type,
                status: appliedFilters.status,
                country_code: appliedFilters.country_code,
            }),
        refetchInterval: 5 * 60 * 1000,
    });

    const supportQuery = useQuery({
        queryKey: ['attendants-form-support'],
        queryFn: () => teamService.getAttendantFormSupport(),
        refetchInterval: 5 * 60 * 1000,
    });

    const utilsQuery = useQuery({
        queryKey: ['attendant-utils'],
        queryFn: async () => {
            const [types, graduates, status] = await Promise.all([
                utilsService.getAttendantTypesMap(),
                utilsService.getAttendantGraduatesMap(),
                utilsService.getAttendantStatusMap(),
            ]);

            return { types, graduates, status };
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    });

    const data = attendantsQuery.data;
    const attendants = data?.attendants?.data ?? [];
    const total = data?.attendants?.meta?.total;
    const resolvedTypes = utilsQuery.data?.types ?? data?.types ?? {};
    const resolvedGraduates = utilsQuery.data?.graduates ?? data?.graduates ?? {};
    const resolvedStatus = utilsQuery.data?.status ?? { '0': 'Inativo', '1': 'Ativo' };
    const isLoading = attendantsQuery.isLoading;
    const isFetching = attendantsQuery.isFetching || supportQuery.isFetching || utilsQuery.isFetching;
    const hasDraftChanges =
        (filters.search ?? '') !== (appliedFilters.search ?? '') ||
        filters.type !== appliedFilters.type ||
        filters.status !== appliedFilters.status ||
        filters.country_code !== appliedFilters.country_code;
    const refetch = async () => {
        await Promise.all([attendantsQuery.refetch(), supportQuery.refetch(), utilsQuery.refetch()]);
    };

    useEffect(() => {
        if (data?.countries?.length) {
            setCountriesOptions(data.countries);
        }
    }, [data?.countries]);

    const handleApplyFilters = () => {
        setAppliedFilters({
            search: filters.search?.trim() || undefined,
            type: filters.type,
            status: filters.status ?? 1,
            country_code: filters.country_code,
        });
    };

    const handleClearFilters = () => {
        setFilters({ ...DEFAULT_FILTERS });
        setAppliedFilters({ ...DEFAULT_FILTERS });
    };

    return (
        <div className="min-h-screen  p-4 py-12 sm:p-12 max-w-screen-2xl mx-auto">
            <div className="space-y-5">
                {/* Header */}
                <div className="animate-fade-in">
                    <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                                    <UserCog className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Atendentes</h1>
                            </div>
                            <p className="text-muted-foreground text-base">
                                Gerencie e visualize todos os atendentes da plataforma
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Novo Atendente
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <AttendantsFiltersBar
                    filters={filters}
                    types={resolvedTypes}
                    statusOptions={resolvedStatus}
                    countries={countriesOptions}
                    hasDraftChanges={hasDraftChanges}
                    isApplying={isFetching}
                    onChange={setFilters}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                />

                {/* Lista */}
                <AttendantsList
                    attendants={attendants}
                    total={total}
                    isLoading={isLoading}
                    isFetching={isFetching}
                />

                {/* Modal Criar Atendente */}
                <CreateAttendantModal
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    supervisors={supportQuery.data?.supervisors ?? []}
                    gestor={supportQuery.data?.gestor ?? null}
                    types={resolvedTypes}
                    graduates={resolvedGraduates}
                    statusOptions={resolvedStatus}
                    onCreated={() => refetch()}
                />
            </div>
        </div>
    );
}
