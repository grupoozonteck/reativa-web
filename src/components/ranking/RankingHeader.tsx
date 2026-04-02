import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RankingHeaderProps {
    participants: number;
    totalRevenue: number;
    isFetching: boolean;
    onRefresh: () => void;
}

export function RankingHeader({ isFetching, onRefresh }: RankingHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em]">
                    Performance Center
                </p>
                <h1 className="text-3xl font-black tracking-tight text-white mt-1">
                    Ranking de Performance
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-white/15 bg-white/5 text-white gap-2 hover:bg-white/10"
                >
                    <Calendar className="w-3.5 h-3.5 text-lime-400" />
                    Este Mês
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-white"
                    onClick={onRefresh}
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </div>
    );
}
