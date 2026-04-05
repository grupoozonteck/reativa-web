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
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Performance Center
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">
                    Ranking de Performance
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border bg-background text-foreground hover:bg-muted"
                >
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Este Mes
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={onRefresh}
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </div>
    );
}
