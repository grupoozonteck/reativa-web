import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCog, RefreshCcw, Plus } from 'lucide-react';
import { teamService, type AttendantsFilters } from '@/services/team.service';
import { AttendantsList } from '@/components/Attendants/AttendantsList';
import { AttendantsFiltersBar } from '@/components/Attendants/AttendantsFiltersBar';
import { CreateAttendantModal } from '@/components/Attendants/CreateAttendantModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export default function Atendentes() {
    const [filters, setFilters] = useState<AttendantsFilters>({});
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const debouncedSearch = useDebounce(filters.search ?? '', 400);

    const attendantsQuery = useQuery({
        queryKey: ['attendants', debouncedSearch, filters.type, filters.country_code],
        queryFn: () =>
            teamService.getAttendants({
                search: debouncedSearch || undefined,
                type: filters.type,
                country_code: filters.country_code,
            }),
        refetchInterval: 5 * 60 * 1000,
    });

    const supportQuery = useQuery({
        queryKey: ['attendants-form-support'],
        queryFn: () => teamService.getAttendantFormSupport(),
        refetchInterval: 5 * 60 * 1000,
    });

    const data = attendantsQuery.data;
    const attendants = data?.attendants?.data ?? [];
    const total = data?.attendants?.meta?.total;
    const isLoading = attendantsQuery.isLoading;
    const isFetching = attendantsQuery.isFetching || supportQuery.isFetching;
    const refetch = async () => {
        await Promise.all([attendantsQuery.refetch(), supportQuery.refetch()]);
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
                            <Button
                                onClick={() => refetch()}
                                variant="secondary"
                                disabled={isFetching}
                                className="gap-2"
                            >
                                <RefreshCcw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
                                {isFetching ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <AttendantsFiltersBar
                    filters={filters}
                    meta={data}
                    onChange={setFilters}
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
                    types={data?.types ?? {}}
                    graduates={data?.graduates ?? {}}
                    onCreated={() => refetch()}
                />
            </div>
        </div>
    );
}
