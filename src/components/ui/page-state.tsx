import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLoadingStateProps {
    message?: string;
}

interface PageErrorStateProps {
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionVariant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
}

export function PageLoadingState({ message = 'Carregando...' }: PageLoadingStateProps) {
    return (
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-md text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

export function PageErrorState({
    message = 'Erro ao carregar os dados.',
    actionLabel,
    onAction,
    actionVariant = 'outline',
}: PageErrorStateProps) {
    return (
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <p className="text-md text-muted-foreground">{message}</p>
                {actionLabel && onAction && (
                    <Button variant={actionVariant} onClick={onAction}>
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}

