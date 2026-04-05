import { AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PodiumSection } from '@/components/ranking/PodiumSection';
import { LeaderboardList } from '@/components/ranking/LeaderboardList';
import { RankingStats } from '@/components/ranking/RankingStats';
import { RankingHeader } from '@/components/ranking/RankingHeader';
import { FieldActivity } from '@/components/ranking/FieldActivity';
import { GlobalGoal } from '@/components/ranking/GlobalGoal';
import { LeaderboardService } from '@/services/leaderboard.service';
import type { LeaderboardEntry } from '@/components/ranking/types';

function RankingSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-16 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
                <div className="space-y-5">
                    <Skeleton className="h-[320px] rounded-2xl" />
                    <Skeleton className="h-[280px] rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[200px] rounded-2xl" />
                    <Skeleton className="h-[180px] rounded-2xl" />
                    <Skeleton className="h-[80px] rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default function Ranking() {
    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => LeaderboardService.getLeaderboard(),
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 60 * 2,
    });

    const sellers = [...(data?.leaderboard ?? [])]
        .filter((item: LeaderboardEntry) => item.type === 3)
        .sort((a, b) => {
            const revenueDiff = Number(b.revenue ?? 0) - Number(a.revenue ?? 0);
            if (revenueDiff !== 0) return revenueDiff;
            return b.sales - a.sales;
        });


    const totalRevenue = data?.summary?.total_revenue ?? 0;


    if (isLoading) {
        return (
            <div className="p-6 max-w-screen-2xl mx-auto">
                <RankingSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-screen-2xl mx-auto">
                <div className="solid-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
                        <div>
                            <h2 className="text-base font-bold">Não foi possível carregar o ranking</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Verifique sua conexão e tente novamente.
                            </p>
                            <Button type="button" onClick={() => refetch()} className="mt-4">
                                Tentar novamente
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
            <RankingHeader
                participants={sellers.length}
                totalRevenue={totalRevenue}
                isFetching={isFetching}
                onRefresh={() => refetch()}
            />

            {sellers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] xl:grid-cols-[3fr_2fr] gap-5">
                    {/* Left column */}
                    <div className=" space-y-5">
                        <PodiumSection sellers={sellers} />
                        <LeaderboardList sellers={sellers} />
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        <RankingStats summary={data?.summary } />
                        <FieldActivity sellers={sellers} />
                        <GlobalGoal totalRevenue={totalRevenue} />
                    </div>
                </div>
            ) : (
                <div className="solid-card rounded-2xl border border-border/60 p-6 text-center">
                    <h2 className="text-base font-bold">Nenhum atendente no ranking</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Assim que houver movimentação de atendentes, o ranking aparece aqui.
                    </p>
                </div>
            )}
        </div>
    );
}
