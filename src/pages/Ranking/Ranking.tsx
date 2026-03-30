import { AlertCircle, Gem, Star, Target, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PodiumSection } from '@/components/ranking/PodiumSection';
import { LeaderboardList } from '@/components/ranking/LeaderboardList';
import { RankingStats } from '@/components/ranking/RankingStats';
import { RankingHeader } from '@/components/ranking/RankingHeader';
import { ComingSoonCard } from '@/components/ranking/ComingSoonCard';
import { LeaderboardService } from '@/services/leaderboard.service';
import type { LeaderboardEntry } from '@/components/ranking/types';

function RankingSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-36 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[420px] lg:col-span-2 rounded-2xl" />
                <Skeleton className="h-[420px] rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-36 rounded-2xl" />
                <Skeleton className="h-36 rounded-2xl" />
            </div>
        </div>
    );
}

export default function Ranking() {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery({
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
            <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
                <RankingSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-screen-2xl mx-auto">
                <div className="glass-card rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
                        <div>
                            <h2 className="text-base font-bold">Nao foi possivel carregar o ranking</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Verifique sua conexao e tente novamente.
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
        <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
            <RankingHeader
                participants={sellers.length}
                totalRevenue={totalRevenue}
                isFetching={isFetching}
                onRefresh={() => refetch()}
            />

            {sellers.length > 0 ? (
                <>
                    <PodiumSection sellers={sellers} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <LeaderboardList sellers={sellers} />
                        <div className="flex flex-col gap-4">
                            <RankingStats sellers={sellers} />
                            <ComingSoonCard
                                title="Metas e Missoes"
                                description="Ainda nao temos endpoint para metas mensais e missoes. Essa area sera integrada assim que a API estiver disponivel."
                                icon={Target}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="glass-card rounded-2xl p-6 text-center border border-white/10">
                    <h2 className="text-base font-bold">Nenhum atendente no ranking</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Assim que houver movimentacao de atendentes, o ranking aparece aqui.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ComingSoonCard
                    title="Conquistas"
                    description="Conquistas individuais e historico de desbloqueios serao exibidos nesta area quando o endpoint for criado."
                    icon={Star}
                />
                <ComingSoonCard
                    title="Badges"
                    description="Badges e progresso de colecao ainda nao estao disponiveis na API. Integracao prevista para os proximos ciclos."
                    icon={Gem}
                />
            </div>

            <ComingSoonCard
                title="Gamificacao Avancada"
                description="Recursos de streak, niveis por missao e bonus de equipe dependem de novos endpoints. Por enquanto, a classificacao usa os dados reais de receita, vendas e conversao."
                icon={Zap}
            />
        </div>
    );
}
