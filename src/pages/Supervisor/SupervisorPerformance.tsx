import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { teamService } from '@/services/team.service';
import { PerformanceHeader } from '@/components/Supervisor/PerformanceHeader';
import { PerformanceStats } from '@/components/Supervisor/PerformanceStats';
import { MembersList } from '@/components/Supervisor/MembersList';
import { useAuth } from '@/contexts/useAuth';
import { DateRangeFilterCard } from '@/components/filters/DateRangeFilterCard';
import { getCurrentMonthDateRange } from '@/utils/date-range';

export default function SupervisorPerformance() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedStartDate = searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['supervisor-performance', user?.id, appliedStartDate, appliedEndDate],
        queryFn: () => teamService.getSupervisorPerformance({
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

    const members = data?.members ?? [];
    const summary = data?.summary;

    const totalSales = summary?.total_sales ?? members.reduce((acc, m) => acc + m.sales, 0);
    const totalReengagements = summary?.total_reengagements ?? members.reduce((acc, m) => acc + m.total_reengagements, 0);
    const totalRevenue = summary?.total_revenue ?? members.reduce((acc, m) => acc + Number(m.revenue ?? 0), 0);
    const avgConversion = summary?.conversion ??
        (members.length > 0
            ? Math.round(members.reduce((acc, m) => acc + m.conversion, 0) / members.length)
            : 0);

    return (
        <div className="p-4 py-8 sm:p-6 space-y-5 max-w-7xl mx-auto">
            <PerformanceHeader isFetching={isFetching} onRefresh={refetch} />

            <DateRangeFilterCard
                title="Filtro da performance"
                description="Esse periodo segue para o backend como start_date e end_date na performance do supervisor."
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
                applyLabel="Filtrar performance"
                startId="supervisor-performance-start-date"
                endId="supervisor-performance-end-date"
            />

            <PerformanceStats
                isLoading={isLoading}
                membersCount={members.length}
                totalSales={totalSales}
                totalReengagements={totalReengagements}
                totalRevenue={totalRevenue}
                avgConversion={avgConversion}
            />

            <MembersList members={members} isLoading={isLoading} isFetching={isFetching} />
        </div>
    );
}
