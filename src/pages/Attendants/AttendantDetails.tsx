import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    TrendingUp,
    ShoppingCart,
    Users,
    RefreshCcw,
    Star,
    Calendar,
    Edit,
    Coins,
    Search,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/client-utils';
import { teamService } from '@/services/team.service';
import { PageErrorState, PageLoadingState } from '@/components/ui/page-state';
import { statusStyleMap, typeColors } from '@/utils/color-ultis';

function formatCurrency(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '--';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(num)) return '--';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    iconBg: string;
    iconClassName?: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconClassName }: StatCardProps) {
    return (
        <div className="solid-card p-4 sm:p-5 flex items-center gap-4 min-w-0">
            <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0', iconBg)}>
                <Icon className={cn('w-5 h-5 text-white', iconClassName)} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="text-xl font-black tracking-tight truncate">{value}</p>
            </div>
        </div>
    );
}

function InfoItem({ label, value, muted = false }: { label: string; value: React.ReactNode; muted?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={cn('text-right text-sm font-medium', muted && 'text-muted-foreground')}>{value}</span>
        </div>
    );
}

const REENGAGEMENT_STATUS_LABELS: Record<number, string> = {
    1: 'Em Servico',
    2: 'Reativado',
    3: 'Indeciso',
    4: 'Sem Resposta ou Contato Invalido',
};

export default function AtendenteDetalhes() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const currentMonthStart = `${currentYear}-${currentMonth}-01`;
    const today = `${currentYear}-${currentMonth}-${currentDay}`;

    const [startDate, setStartDate] = useState(currentMonthStart);
    const [endDate, setEndDate] = useState(today);
    const [appliedStartDate, setAppliedStartDate] = useState(currentMonthStart);
    const [appliedEndDate, setAppliedEndDate] = useState(today);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['attendant-detail', id, appliedStartDate, appliedEndDate],
        queryFn: () => teamService.getAttendantById(Number(id), {
            start_date: appliedStartDate || undefined,
            end_date: appliedEndDate || undefined,
        }),
        enabled: !!id,
        select: (res) => res.data,
    });

    if (isLoading) {
        return <PageLoadingState message="Carregando detalhes do atendente..." />;
    }

    if (isError || !data) {
        return (
            <PageErrorState
                message="Erro ao carregar os detalhes do atendente."
                actionLabel="Voltar"
                onAction={() => navigate('/attendants')}
            />
        );
    }

    const attendant = data.attendant;
    const commissionRows = attendant.commissions ?? [];
    const attendanceRows = attendant.reengagements ?? [];
    const hasDraftChanges = startDate !== appliedStartDate || endDate !== appliedEndDate;
    const periodLabel = `${formatDate(appliedStartDate)} - ${formatDate(appliedEndDate)}`;

    const handleApplyFilters = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    const clearFilters = () => {
        setStartDate(currentMonthStart);
        setEndDate(today);
        setAppliedStartDate(currentMonthStart);
        setAppliedEndDate(today);
    };

    return (
        <div className="min-h-screen max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 space-y-4 sm:space-y-5">
            <div className="animate-fade-in flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <Button variant="default" onClick={() => navigate(-1)} className="gap-2 w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Detalhes do Atendente</h1>
                        <p className="text-sm text-muted-foreground">
                            Visao individual de desempenho, estrutura e historico operacional.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full lg:w-auto">
                    <Button
                        onClick={() => navigate(`/attendants/${id}/edit`)}
                        size="lg"
                        variant="outline"
                        className="gap-2 w-full"
                    >
                        <Edit className="w-4 h-4" />
                        Editar
                    </Button>
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        size="lg"
                        className="gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <RefreshCcw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
                        {isFetching ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </div>
            </div>

            <section
                className="solid-card overflow-hidden animate-fade-in"
                style={{ animationDelay: '60ms', opacity: 0 }}
            >
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_320px]">
                    <div className="p-5 sm:p-6 md:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <Avatar className="w-20 h-20 rounded-3xl border border-white/10 shadow-lg">
                                <AvatarImage src={attendant.user?.personal_data?.avatar} className="object-cover" />
                                <AvatarFallback className="rounded-3xl text-xl font-bold">
                                    {getInitials(attendant.user?.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="h-6 px-2.5 text-[10px] uppercase tracking-[0.14em]">
                                            Perfil ativo
                                        </Badge>
                                        <Badge variant="outline" className="h-6 px-2.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                            Periodo {periodLabel}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{attendant.user?.name}</h2>
                                        <p className="text-sm text-muted-foreground sm:text-base">@{attendant.user?.login}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={cn('text-[10px] px-2.5 h-6', typeColors[attendant.type])}>
                                        {attendant.type_label}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] px-2.5 h-6">
                                        {attendant.graduation_label}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2.5 h-6 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                                    >
                                        <Star className="w-2.5 h-2.5 mr-1" />
                                        Nivel {attendant.level}
                                    </Badge>
                                </div>

                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                    Acompanhe os resultados do atendente, a relacao com a lideranca e o historico filtrado sem comprimir a leitura no mobile.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 bg-surface-highest/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
                        <div className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Destaque do periodo
                            </p>
                            <div className="space-y-1">
                                <div className="text-3xl font-black tracking-tight">
                                    {data.metrics.total_attendances || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    atendimentos registrados entre as datas aplicadas
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/5 bg-background/30 p-3">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Vendas</p>
                                <p className="mt-1 text-lg font-bold">{data.metrics.total_orders || 0}</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-background/30 p-3">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Conversao</p>
                                <p className="mt-1 text-lg font-bold">{data.metrics.conversion_rate || 0}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 animate-fade-in"
                style={{ animationDelay: '120ms', opacity: 0 }}
            >
                <StatCard label="Comissoes" value={formatCurrency(data.metrics.commissions_received)} icon={Coins} iconBg="bg-emerald-500" />
                <StatCard label="Vendas" value={data.metrics.total_orders || 0} icon={ShoppingCart} iconBg="bg-blue-500" />
                <StatCard label="Atendimentos" value={data.metrics.total_attendances || 0} icon={Users} iconBg="bg-violet-500" />
                <StatCard label="Conversao" value={`${data.metrics.conversion_rate || 0}%`} icon={TrendingUp} iconBg="bg-amber-500" />
            </div>

            <div
                className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] animate-fade-in"
                style={{ animationDelay: '180ms', opacity: 0 }}
            >
                <div className="solid-card p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Lideranca</h3>
                            <p className="text-sm text-muted-foreground">Estrutura acima do atendente.</p>
                        </div>
                    </div>
                    {attendant.parent ? (
                        <div className="divide-y divide-white/5">
                            <InfoItem label="Nome" value={attendant.parent.user?.name} />
                            <InfoItem label="Login" value={`@${attendant.parent.user?.login}`} muted />
                            <InfoItem
                                label="Cargo"
                                value={(
                                    <Badge variant="outline" className={cn('text-[10px] px-2.5 h-6', typeColors[attendant.parent.type])}>
                                        {attendant.parent.type_label}
                                    </Badge>
                                )}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground/60 pt-2">Sem lider vinculado</p>
                    )}
                </div>

                <div className="solid-card p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Registro</h3>
                            <p className="text-sm text-muted-foreground">Dados fixos de cadastro e identificacao.</p>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        <InfoItem label="Cadastrado em" value={formatDate(attendant.created_at)} />
                        <InfoItem label="ID interno" value={<span className="font-mono">#{attendant.user_id}</span>} muted />
                    </div>
                </div>
            </div>

            <div className="solid-card p-5 sm:p-6 animate-fade-in space-y-4" style={{ animationDelay: '240ms', opacity: 0 }}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-on-surface-variant" />
                        <span className="font-display text-sm font-semibold">Filtros do historico</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {hasDraftChanges ? 'Existem alteracoes pendentes para aplicar.' : `Periodo ativo: ${periodLabel}`}
                    </span>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleApplyFilters();
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[180px_180px_minmax(0,1fr)]">
                        <Field>
                            <FieldLabel htmlFor="attendant-start-date">Data inicial</FieldLabel>
                            <Input
                                id="attendant-start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-10"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="attendant-end-date">Data final</FieldLabel>
                            <Input
                                id="attendant-end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-10"
                            />
                        </Field>
                        <div className="flex flex-col justify-end">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[auto_auto] lg:justify-start">
                                <Button
                                    type="submit"
                                    disabled={isFetching || !hasDraftChanges}
                                    className="gap-2 w-full lg:w-auto"
                                >
                                    <Search className="w-4 h-4" />
                                    Filtrar
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearFilters}
                                    disabled={isFetching || (!hasDraftChanges && startDate === currentMonthStart && endDate === today)}
                                    className="gap-2 w-full lg:w-auto"
                                >
                                    <X className="w-4 h-4" />
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-surface-highest/30 px-4 py-3 text-xs text-muted-foreground">
                        Os campos de data sao enviados para o backend como <span className="font-mono">start_date</span> e <span className="font-mono">end_date</span>.
                    </div>
                </form>
            </div>

            <Tabs defaultValue="attendances" className="animate-fade-in" style={{ animationDelay: '300ms', opacity: 0 }}>
                <TabsList className="grid w-full grid-cols-2 h-11 p-1.5 rounded-2xl bg-surface-highest/70 md:w-[360px]">
                    <TabsTrigger value="attendances">Atendimentos</TabsTrigger>
                    <TabsTrigger value="commissions">Comissoes</TabsTrigger>
                </TabsList>

                <TabsContent value="attendances">
                    <div className="solid-card overflow-hidden">
                        <div className="px-5 py-4 bg-surface-highest/60 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold">Lista de atendimentos</h3>
                                <p className="text-xs text-muted-foreground">Historico de interacoes no periodo filtrado.</p>
                            </div>
                            <Badge variant="outline">{attendanceRows.length}</Badge>
                        </div>

                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent bg-surface-highest/80">
                                        <TableHead>ID</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Login</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                                Nenhum atendimento encontrado para o periodo.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceRows.map((reengagement) => {
                                            const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
                                            return (
                                                <TableRow key={reengagement.id}>
                                                    <TableCell className="font-mono text-xs">#{reengagement.id}</TableCell>
                                                    <TableCell>{reengagement.user?.name ?? '--'}</TableCell>
                                                    <TableCell className="text-muted-foreground">@{reengagement.user?.login ?? '--'}</TableCell>
                                                    <TableCell>
                                                        <Badge className={cn('border gap-1 whitespace-nowrap', statusStyle.color)}>
                                                            <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                                                            {REENGAGEMENT_STATUS_LABELS[reengagement.status] ?? `Status ${reengagement.status}`}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{formatDate(reengagement.created_at)}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                            {attendanceRows.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-muted-foreground">
                                    Nenhum atendimento encontrado para o periodo.
                                </div>
                            ) : (
                                attendanceRows.map((reengagement) => {
                                    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
                                    return (
                                        <div key={reengagement.id} className="rounded-2xl border border-white/5 bg-surface-highest/35 p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                        Atendimento #{reengagement.id}
                                                    </p>
                                                    <p className="mt-1 font-semibold">{reengagement.user?.name ?? '--'}</p>
                                                    <p className="text-sm text-muted-foreground">@{reengagement.user?.login ?? '--'}</p>
                                                </div>
                                                <Badge className={cn('border gap-1 whitespace-nowrap', statusStyle.color)}>
                                                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                                                    {REENGAGEMENT_STATUS_LABELS[reengagement.status] ?? `Status ${reengagement.status}`}
                                                </Badge>
                                            </div>
                                            <div className="rounded-xl bg-background/30 px-3 py-2 text-sm">
                                                <span className="text-muted-foreground">Data </span>
                                                <span className="font-medium">{formatDate(reengagement.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="commissions">
                    <div className="solid-card overflow-hidden">
                        <div className="px-5 py-4 bg-surface-highest/60 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold">Lista de comissoes</h3>
                                <p className="text-xs text-muted-foreground">Lancamentos financeiros vinculados ao atendente.</p>
                            </div>
                            <Badge variant="outline">{commissionRows.length}</Badge>
                        </div>

                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent bg-surface-highest/80">
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pedido</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Descricao</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commissionRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                                Nenhuma comissao encontrada para o periodo.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        commissionRows.map((commission) => (
                                            <TableRow key={commission.id}>
                                                <TableCell className="font-mono text-xs">#{commission.id}</TableCell>
                                                <TableCell>{commission.order_id ? `#${commission.order_id}` : '--'}</TableCell>
                                                <TableCell className={cn(Number(commission.value) < 0 ? 'text-rose-400' : 'text-emerald-400', 'font-medium')}>
                                                    {formatCurrency(commission.value)}
                                                </TableCell>
                                                <TableCell className="max-w-[520px] truncate">{commission.description_extra ?? '--'}</TableCell>
                                                <TableCell>{formatDate(commission.created_at)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                            {commissionRows.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-muted-foreground">
                                    Nenhuma comissao encontrada para o periodo.
                                </div>
                            ) : (
                                commissionRows.map((commission) => (
                                    <div key={commission.id} className="rounded-2xl border border-white/5 bg-surface-highest/35 p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                    Comissao #{commission.id}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Pedido {commission.order_id ? `#${commission.order_id}` : '--'}
                                                </p>
                                            </div>
                                            <p className={cn(Number(commission.value) < 0 ? 'text-rose-400' : 'text-emerald-400', 'font-semibold')}>
                                                {formatCurrency(commission.value)}
                                            </p>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {commission.description_extra ?? '--'}
                                        </p>
                                        <div className="rounded-xl bg-background/30 px-3 py-2 text-sm">
                                            <span className="text-muted-foreground">Data </span>
                                            <span className="font-medium">{formatDate(commission.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
