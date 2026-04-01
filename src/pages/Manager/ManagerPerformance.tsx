import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/team.service';
import { ManagerHeader } from '@/components/Manager/ManagerHeader';
import { ManagerStats } from '@/components/Manager/ManagerStats';
import { SupervisorTeamList } from '@/components/Manager/SupervisorTeamList';

export default function ManagerPerformance() {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['manager-performance'],
        queryFn: () => teamService.getManagerPerformance(),
        refetchInterval: 5 * 60 * 1000,
    });


    const summary = data?.summary;
    const supervisors = data?.supervisors ?? [];


    return (
        <div className="p-4 py-8 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
            <ManagerHeader isFetching={isFetching} onRefresh={refetch} />

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
