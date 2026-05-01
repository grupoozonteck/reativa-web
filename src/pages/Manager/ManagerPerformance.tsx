import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { teamService } from '@/services/team.service';
import { ManagerHeader } from '@/components/Manager/ManagerHeader';
import { ManagerStats } from '@/components/Manager/ManagerStats';
import { SupervisorTeamList } from '@/components/Manager/SupervisorTeamList';
import { useAuth } from '@/contexts/useAuth';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import { getCurrentMonthDateRange } from '@/utils/date-range';

export default function ManagerPerformance() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate = searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['manager-performance', user?.id, appliedStartDate, appliedEndDate],
        queryFn: () => teamService.getManagerPerformance({
            start_date: appliedStartDate || undefined,
            end_date: appliedEndDate || undefined,
        }),
        enabled: !!user?.id,
        refetchInterval: 5 * 60 * 1000,
    });

    const hasActiveFilters = appliedStartDate !== defaultRange.startDate || appliedEndDate !== defaultRange.endDate;
    const hasDraftChanges = startDate !== appliedStartDate || endDate !== appliedEndDate;

    const handleApplyFilters = () => {
        setSearchParams((params) => {
            if (startDate && startDate !== defaultRange.startDate) params.set('start_date', startDate); else params.delete('start_date');
            if (endDate && endDate !== defaultRange.endDate) params.set('end_date', endDate); else params.delete('end_date');
            return params;
        }, { replace: true });
    };

    const handleClearFilters = () => {
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setSearchParams((params) => {
            params.delete('start_date');
            params.delete('end_date');
            return params;
        }, { replace: true });
    };

    const summary = data?.summary;
    const supervisors = data?.supervisors ?? [];

    return (
        <div className="p-4 py-8 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
            <ManagerHeader isFetching={isFetching} onRefresh={refetch} />

            <DateRangeFilterCard
                title="Filtro gerencial"
                description="O resumo e a lista de supervisores passam start_date e end_date para o backend."
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                onRefresh={() => refetch()}
                isFetching={isFetching}
                hasActiveFilters={hasActiveFilters}
                hasDraftChanges={hasDraftChanges}
                applyLabel="Filtrar periodo"
                startId="manager-performance-start-date"
                endId="manager-performance-end-date"
            />

            <ManagerStats
                isLoading={isLoading}
                supervisorsCount={supervisors.length}
                totalSales={summary?.total_sales ?? 0}
                totalReengagements={summary?.total_reengagements ?? 0}
                totalRevenue={summary?.total_revenue ?? 0}
                totalConversion={summary?.total_conversion ?? 0}
            />

            <SupervisorTeamList
                supervisors={supervisors}
                isLoading={isLoading}
                isFetching={isFetching}
            />
        </div>
    );
}
