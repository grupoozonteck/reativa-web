import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
    AlertCircle,
    ArrowLeft,
    Coins,
    Loader2,
    Plus,
    Save,
    ShieldCheck,
    UserCog,
    Users,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { teamService } from '@/services/team.service';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getInitials } from '@/utils/client-utils';
import { cn } from '@/lib/utils';
import { typeColors } from '@/utils/color-ultis';

export default function AtendenteEditar() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [graduation, setGraduation] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('none');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [commissionModalOpen, setCommissionModalOpen] = useState(false);
    const [commissionPercent, setCommissionPercent] = useState('');
    const [minSales, setMinSales] = useState('');
    const [maxSales, setMaxSales] = useState('');
    const [commissionError, setCommissionError] = useState<string | null>(null);
    const [isSavingCommission, setIsSavingCommission] = useState(false);

    const detailQuery = useQuery({
        queryKey: ['attendant-detail', id],
        queryFn: () => teamService.getAttendantById(Number(id)),
        enabled: !!id,
        select: (res) => res.data,
    });

    const supportQuery = useQuery({
        queryKey: ['attendants-edit-support'],
        queryFn: () => teamService.getAttendants(),
        select: (res) => ({
            supervisors: res.supervisors,
            gestor:res.gestors ?? null,
            types: res.types,
            graduates: res.graduates,
        }),
    });




    const attendant = detailQuery.data?.attendant;
    const types = detailQuery.data?.types ?? supportQuery.data?.types ?? {};
    const graduates = detailQuery.data?.graduates ?? supportQuery.data?.graduates ?? {};
    const supervisors = supportQuery.data?.supervisors ?? [];
    const gestor = supportQuery.data?.gestor ?? null;
    const isEditingGestor = attendant?.type === 1;
    const isSupervisorType = type === '2';

    const availableTypes = useMemo(
        () => Object.entries(types).filter(([key]) => key !== '1' || isEditingGestor),
        [isEditingGestor, types],
    );

    const leaderOptions = useMemo(() => {
        if (isSupervisorType) {
            return gestor
                ? [{ id: gestor.id, name: gestor.user.name, login: gestor.user.login }]
                : [];
        }

        return supervisors.map((supervisor) => ({
            id: supervisor.id,
            name: supervisor.name,
            login: supervisor.login,
        }));
    }, [gestor, isSupervisorType, supervisors]);

    useEffect(() => {
        if (!attendant) return;
        setType(String(attendant.type ?? ''));
        setGraduation(String(attendant.graduation ?? ''));
        setSelectedSupervisorId(attendant.parent?.id ? String(attendant.parent.id) : 'none');
        setError(null);
    }, [attendant]);

    useEffect(() => {
        if (selectedSupervisorId === 'none') return;

        const selectedLeaderIsAvailable = leaderOptions.some((leader) => String(leader.id) === selectedSupervisorId);
        if (!selectedLeaderIsAvailable) {
            setSelectedSupervisorId('none');
        }
    }, [leaderOptions, selectedSupervisorId]);


    const commissionRanges = attendant?.commissions_attendant ?? attendant?.commissions ?? [];
    const isLoading = detailQuery.isLoading || supportQuery.isLoading;
    const isError = detailQuery.isError || supportQuery.isError || !attendant;

    function formatMoney(value: number | string | undefined) {
        if (value === undefined || value === null || value === '') return '--';
        const numericValue = typeof value === 'string' ? Number(value) : value;
        if (Number.isNaN(numericValue)) return '--';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numericValue);
    }

    function formatPercent(value: number | string | undefined) {
        if (value === undefined || value === null || value === '') return '--';
        const numericValue = typeof value === 'string' ? Number(value) : value;
        if (Number.isNaN(numericValue)) return '--';
        return `${numericValue.toFixed(2)}%`;
    }

    function resetCommissionForm() {
        setCommissionPercent('');
        setMinSales('');
        setMaxSales('');
        setCommissionError(null);
    }

    async function handleSubmit() {
        if (!id || !type || !graduation) {
            setError('Selecione cargo e graduacao para salvar.');
            return;
        }

        const selectedSupervisor =
            selectedSupervisorId === 'none'
                ? null
                : leaderOptions.find((leader) => String(leader.id) === selectedSupervisorId);

        setIsSaving(true);
        setError(null);

        try {
            await teamService.updateAttendant(Number(id), {
                type: Number(type),
                graduation: Number(graduation),
                parent_id: selectedSupervisor?.id ?? null,
            });

            toast.success('Atendente atualizado com sucesso.');
            await detailQuery.refetch();
        } catch (err: unknown) {
            const apiMessage =
                err instanceof Object &&
                'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;

            const message = apiMessage ?? 'Nao foi possivel salvar as alteracoes.';
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleCreateCommission() {
        if (!id) return;

        const parsedPercent = Number(commissionPercent);
        const parsedMinSales = Number(minSales);
        const parsedMaxSales = Number(maxSales);

        if (!commissionPercent || !minSales || !maxSales) {
            setCommissionError('Preencha percentual, venda minima e venda maxima.');
            return;
        }

        if ([parsedPercent, parsedMinSales, parsedMaxSales].some((value) => Number.isNaN(value))) {
            setCommissionError('Informe apenas numeros validos para a faixa de comissao.');
            return;
        }

        if (parsedMinSales > parsedMaxSales) {
            setCommissionError('A venda minima nao pode ser maior que a venda maxima.');
            return;
        }

        setIsSavingCommission(true);
        setCommissionError(null);

        try {
            await teamService.createAttendantCommission(Number(id), {
                commission_percent: parsedPercent,
                min_sales: parsedMinSales,
                max_sales: parsedMaxSales,
            });

            resetCommissionForm();
            setCommissionModalOpen(false);
            toast.success('Faixa de comissao criada com sucesso.');
            await detailQuery.refetch();
        } catch (err: unknown) {
            const apiMessage =
                err instanceof Object &&
                'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;

            const message = apiMessage ?? 'Nao foi possivel criar a faixa de comissao.';
            setCommissionError(message);
            toast.error(message);
        } finally {
            setIsSavingCommission(false);
        }
    }

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-md text-muted-foreground">Carregando dados de edicao do atendente...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <p className="text-md text-muted-foreground">Erro ao carregar a tela de edicao do atendente.</p>
                    <Button variant="outline" onClick={() => navigate('/atendentes')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 py-12 md:p-12 max-w-screen-2xl mx-auto space-y-5">
            <Dialog
                open={commissionModalOpen}
                onOpenChange={(open) => {
                    if (isSavingCommission) return;
                    setCommissionModalOpen(open);
                    if (!open) resetCommissionForm();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova faixa de comissao</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="commission-min-sales">Venda minima</FieldLabel>
                            <Input
                                id="commission-min-sales"
                                type="number"
                                min="0"
                                step="0.01"
                                value={minSales}
                                onChange={(e) => setMinSales(e.target.value)}
                                disabled={isSavingCommission}
                                placeholder="0"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="commission-max-sales">Venda maxima</FieldLabel>
                            <Input
                                id="commission-max-sales"
                                type="number"
                                min="0"
                                step="0.01"
                                value={maxSales}
                                onChange={(e) => setMaxSales(e.target.value)}
                                disabled={isSavingCommission}
                                placeholder="1000"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="commission-percent">Percentual</FieldLabel>
                            <Input
                                id="commission-percent"
                                type="number"
                                min="0"
                                step="0.01"
                                value={commissionPercent}
                                onChange={(e) => setCommissionPercent(e.target.value)}
                                disabled={isSavingCommission}
                                placeholder="5"
                            />
                            <FieldDescription>Ex.: `5` para 5% nessa faixa.</FieldDescription>
                        </Field>

                        {commissionError && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                                {commissionError}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCommissionModalOpen(false)} disabled={isSavingCommission}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateCommission}
                            disabled={isSavingCommission}
                            className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            {isSavingCommission ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {isSavingCommission ? 'Criando faixa...' : 'Criar faixa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="animate-fade-in flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-xl shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                            <UserCog className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Editar Atendente</h1>
                            <p className="text-sm text-muted-foreground">Atualize cargo, graduacao e lider do atendente.</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/atendentes/${id}`)} className="gap-2">
                        Ver detalhes
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        size="lg"
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-5">
                <div className="solid-card p-5 space-y-4 animate-fade-in" style={{ animationDelay: '60ms', opacity: 0 }}>
                    <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 rounded-2xl">
                            <AvatarImage src={attendant.user?.personal_data?.avatar} className="object-cover" />
                            <AvatarFallback className="rounded-2xl text-lg font-bold">
                                {getInitials(attendant.user?.name ?? 'Atendente')}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 space-y-2">
                            <div>
                                <h2 className="text-xl font-bold truncate">{attendant.user?.name}</h2>
                                <p className="text-sm text-muted-foreground truncate">@{attendant.user?.login}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={cn('px-2 h-5', typeColors[attendant.type])}>
                                    {attendant.type_label}
                                </Badge>
                                <Badge variant="default" className="px-2 h-5">
                                    {attendant.graduation_label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-border/60 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Resumo atual</p>
                                <p className="text-xs text-muted-foreground">Confira os dados antes de salvar.</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-muted-foreground">Cargo atual</span>
                                <span className="font-medium text-right">{attendant.type_label}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-muted-foreground">Graduacao atual</span>
                                <span className="font-medium text-right">{attendant.graduation_label}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-muted-foreground">Lider atual</span>
                                <span className="font-medium text-right">{attendant.parent?.user?.name ?? 'Sem lider vinculado'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="solid-card p-5 md:p-6 animate-fade-in space-y-6" style={{ animationDelay: '120ms', opacity: 0 }}>
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold">Dados do atendente</h2>
                            <p className="text-sm text-muted-foreground">A tela ja vem preenchida com os dados atuais para voce editar com seguranca.</p>
                        </div>

                        <FieldGroup className="gap-5">
                            <Field>
                                <FieldLabel htmlFor="attendant-type">Cargo</FieldLabel>
                                <Select value={type} onValueChange={setType} disabled={isSaving || isEditingGestor}>
                                    <SelectTrigger id="attendant-type">
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTypes.map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="attendant-graduation">Graduacao</FieldLabel>
                                <Select value={graduation} onValueChange={setGraduation} disabled={isSaving}>
                                    <SelectTrigger id="attendant-graduation">
                                        <SelectValue placeholder="Selecione a graduacao" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(graduates).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="attendant-parent">{isSupervisorType ? 'Gestor' : 'Lider'}</FieldLabel>
                                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId} disabled={isSaving}>
                                    <SelectTrigger id="attendant-parent">
                                        <SelectValue placeholder={isSupervisorType ? 'Selecione o gestor' : 'Selecione o lider'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sem lider</SelectItem>
                                        {leaderOptions.map((leader) => (
                                            <SelectItem key={leader.id} value={String(leader.id)}>
                                                {leader.name} @{leader.login}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                        {error && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                ID interno #{attendant.user_id}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="destructive" onClick={() => navigate(`/atendentes/${id}`)} disabled={isSaving}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSubmit} disabled={isSaving} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="solid-card p-5 md:p-6 animate-fade-in space-y-6" style={{ animationDelay: '180ms', opacity: 0 }}>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                                    <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Faixas de comissao</h2>
                                    <p className="text-sm text-muted-foreground">Visualize as regras ja cadastradas e adicione novas faixas quando precisar.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    resetCommissionForm();
                                    setCommissionModalOpen(true);
                                }}
                                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                <Plus className="w-4 h-4" />
                                Nova faixa
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold">Regras ja cadastradas</h3>
                                <Badge variant="outline">{commissionRanges.length}</Badge>
                            </div>

                            {!commissionRanges.length ? (
                                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                                    Nenhuma faixa de comissao cadastrada para este atendente.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {commissionRanges.map((commission) => (
                                        <div key={commission.id} className="rounded-xl border border-border/60 px-4 py-4">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold">
                                                        {formatMoney(commission.min_sales)} ate {formatMoney(commission.max_sales)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPercent(commission.commission_percent ?? commission.value)} de comissao
                                                    </p>
                                                </div>
                                                <Badge variant="outline">#{commission.id}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
