import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/team.service';
import { PerformanceHeader } from '@/components/Supervisor/PerformanceHeader';
import { PerformanceStats } from '@/components/Supervisor/PerformanceStats';
import { MembersList } from '@/components/Supervisor/MembersList';

export default function SupervisorPerformance() {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['supervisor-performance'],
        queryFn: () => teamService.getSupervisorPerformance(),
        refetchInterval: 5 * 60 * 1000,
    });

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


