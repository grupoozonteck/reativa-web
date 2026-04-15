import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    UserCog,
    TrendingUp,
    ShoppingCart,
    Users,
    RefreshCcw,
    Star,
    Calendar,
    Edit,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/client-utils';
import { teamService } from '@/services/team.service';
import { PageErrorState, PageLoadingState } from '@/components/ui/page-state';

const typeColors: Record<number, string> = {
    1: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    2: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    3: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
};

function formatCurrency(value: string | number | null) {
    if (value === null || value === undefined) return '--';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

interface StatCardProps {
    label: string;
    value: string | number;
    helperText?: string;
    icon: React.ElementType;
    iconBg: string;
}

function StatCard({ label, value, helperText, icon: Icon, iconBg }: StatCardProps) {
    return (
        <div className="solid-card p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-bold truncate">{value}</p>
                {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
            </div>
        </div>
    );
}

export default function AtendenteDetalhes() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['attendant-detail', id],
        queryFn: () => teamService.getAttendantById(Number(id)),
        enabled: !!id,
        select: (res) => res.data,
    });


    if (isLoading) {
        return (
            <PageLoadingState message="Carregando detalhes do atendente..." />
        );
    }

    if (isError || !data) {
        return (
            <PageErrorState
                message="Erro ao carregar os detalhes do atendente."
                actionLabel="Voltar"
                onAction={() => navigate('/atendentes')}
            />
        );
    }

    // const initials = getInitials(data.user?.name);

    return (
        <div className="min-h-screen p-4 py-12 md:p-12 max-w-screen-2xl mx-auto space-y-5">
            {/* Header */}
            <div className="animate-fade-in flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button
                        variant="default"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold tracking-tight">Detalhes do Atendente</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        onClick={() => navigate(`/atendentes/${id}/editar`)}
                        size="lg"
                        variant="outline"
                        className="gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Editar
                    </Button>
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        size="lg"
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <RefreshCcw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
                        {isFetching ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </div>
            </div>

            {/* Card principal */}
            <div className="solid-card p-5 md:p-6 animate-fade-in" style={{ animationDelay: '60ms', opacity: 0 }}>
                <div className="flex items-start gap-4 md:gap-5">
                    <Avatar className="w-16 h-16 rounded-2xl">
                        <AvatarImage src={data.attendant.user?.personal_data?.avatar} className="object-cover" />
                        <AvatarFallback className="rounded-2xl text-lg font-bold">{getInitials(data.attendant.user?.name)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <h2 className="text-xl font-bold">{data.attendant.user?.name}</h2>
                            <p className="text text-muted-foreground">@{data.attendant.user?.login}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={cn('text-xs px-2 h-5', typeColors[data.attendant.type])}>
                                {data.attendant.type_label}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 h-5">
                                {data.attendant.graduation_label}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 h-5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                                <Star className="w-2.5 h-2.5 mr-1" />
                                Nível {data.attendant.level}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: '120ms', opacity: 0 }}>
                <StatCard label="Comissão recebida" value={formatCurrency(data.metrics.commissions_received)} icon={TrendingUp} iconBg="bg-emerald-500" />
                <StatCard
                    label="Total em vendas"
                    value={formatCurrency(data.metrics.total_order_value)}
                    helperText={`${data.metrics.total_orders ? data.metrics.total_orders : '0'} pedido(s)`}
                    icon={ShoppingCart}
                    iconBg="bg-blue-500"
                />
                <StatCard label="Atendimentos" value={data.metrics.total_attendances ? data.metrics.total_attendances : '0'} icon={Users} iconBg="bg-violet-500" />
                <StatCard label="Conversão" value={`${data.metrics.conversion_rate ? data.metrics.conversion_rate : '0'}%`} icon={RefreshCcw} iconBg="bg-amber-500" />
            </div>

            {/* Tabs: Atendimentos / Líder / Registro */}
            <div className="animate-fade-in" style={{ animationDelay: '180ms', opacity: 0 }}>
                <Tabs defaultValue="atendimentos">
                    <TabsList className="mb-3">
                        <TabsTrigger value="atendimentos" className="gap-1.5">
                            <RefreshCcw className="w-3.5 h-3.5" />
                            Atendimentos
                            {data.attendant.reengagements?.length > 0 && (
                                <span className="ml-1 text-xs bg-muted rounded-full px-1.5">{data.attendant.reengagements.length}</span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="lider" className="gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Líder
                        </TabsTrigger>
                        <TabsTrigger value="registro" className="gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Registro
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="atendimentos">
                        <div className="solid-card p-4">
                            {data.attendant.reengagements && data.attendant.reengagements.length > 0 ? (
                                <div className="space-y-2">
                                    {data.attendant.reengagements.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar className="w-8 h-8 rounded-xl shrink-0">
                                                    <AvatarFallback className="rounded-xl text-xs font-bold">{getInitials(r.user?.name ?? '?')}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{r.user?.name ?? `Usuário #${r.user_id}`}</p>
                                                    <p className="text-xs text-muted-foreground">@{r.user?.login ?? '--'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {r.personal_order_id && (
                                                    <span className="text-xs text-muted-foreground hidden sm:inline">Pedido #{r.personal_order_id}</span>
                                                )}
                                                <span className="text-xs text-muted-foreground hidden sm:inline">{formatDate(r.created_at)}</span>
                                                {r.status === 2 ? (
                                                    <Badge variant="outline" className="text-xs px-2 h-5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Concluído
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs px-2 h-5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Pendente
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground/60 py-2">Nenhum atendimento registrado.</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="lider">
                        <div className="solid-card p-5">
                            {data.attendant.parent ? (
                                <div className="space-y-2 text-md">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Nome</span>
                                        <span className="font-medium">{data.attendant.parent.user?.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Login</span>
                                        <span className="text-muted-foreground">@{data.attendant.parent.user?.login}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Cargo</span>
                                        <Badge variant="outline" className={cn('text-xs px-2 h-5', typeColors[data.attendant.parent.type])}>
                                            {data.attendant.parent.type_label}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-md text-muted-foreground/60">Sem líder vinculado</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="registro">
                        <div className="solid-card p-5">
                            <div className="space-y-2 text-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Cadastrado em</span>
                                    <span className="font-medium">{formatDate(data.attendant.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">ID interno</span>
                                    <span className="text-muted-foreground font-mono">#{data.attendant.user_id}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
