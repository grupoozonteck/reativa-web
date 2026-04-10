import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Coins,
    Loader2,
    Pencil,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
    UserCog,
    Users,
    X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { teamService } from '@/services/team.service';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageErrorState, PageLoadingState } from '@/components/ui/page-state';
import { formatCurrency, formatCurrencyInput, formatPercent, getInitials, parseCurrencyInput, toCurrencyInputValue } from '@/utils/client-utils';
import { cn } from '@/lib/utils';
import { typeColors } from '@/utils/color-ultis';
import type { AttendantLeaderOption } from '@/services/team.service';

function extractApiErrorMessage(err: unknown, fallback: string) {
    if (!(err instanceof Object) || !('response' in err)) {
        return fallback;
    }

    const response = (err as {
        response?: {
            data?: {
                message?: string;
                errors?: Record<string, string[]>;
            };
        };
    }).response;

    const message = response?.data?.message;
    const errors = response?.data?.errors;

    const detailedErrors = errors
        ? Object.values(errors)
            .flat()
            .filter(Boolean)
        : [];

    if (detailedErrors.length > 0) {
        return detailedErrors.join(' | ');
    }

    return message ?? fallback;
}

const initialCommissionFormState = {
    commissionPercent: '',
    minSales: '',
    maxSales: '',
    error: null as string | null,
    editingCommissionId: null as number | null,
};

const EMPTY_TYPES: Record<string, string> = {};
const EMPTY_SUPERVISORS: AttendantLeaderOption[] = [];

export default function AtendenteEditar() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [graduation, setGraduation] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('none');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [commissionModalOpen, setCommissionModalOpen] = useState(false);
    const [commissionForm, setCommissionForm] = useState(initialCommissionFormState);
    const [isSavingCommission, setIsSavingCommission] = useState(false);
    const [deletingCommissionId, setDeletingCommissionId] = useState<number | null>(null);
    const [pendingDeleteCommissionId, setPendingDeleteCommissionId] = useState<number | null>(null);
    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const detailQuery = useQuery({
        queryKey: ['attendant-detail', id],
        queryFn: () => teamService.getAttendantById(Number(id)),
        enabled: !!id,
        select: (res) => res.data,
    });

    const supportQuery = useQuery({
        queryKey: ['attendants-edit-support'],
        queryFn: () => teamService.getAttendantFormSupport(),
    });

    const attendant = detailQuery.data?.attendant;
    const types = detailQuery.data?.types ?? EMPTY_TYPES;
    const graduates = detailQuery.data?.graduates ?? {};
    const supervisors = supportQuery.data?.supervisors ?? EMPTY_SUPERVISORS;
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
                ? [{ id: gestor.id, name: gestor.name, login: gestor.login, status: gestor.status ?? null }]
                : [];
        }

        return supervisors.map((supervisor) => ({
            id: supervisor.id,
            name: supervisor.name,
            login: supervisor.login,
            status: supervisor.status ?? null,
        }));
    }, [gestor, isSupervisorType, supervisors]);

    const selectedLeader =
        selectedSupervisorId === 'none'
            ? null
            : leaderOptions.find((leader) => String(leader.id) === selectedSupervisorId) ?? null;

    useEffect(() => {
        if (!attendant) return;
        setType(String(attendant.type ?? ''));
        setStatus(attendant.status === 0 ? '0' : '1');
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
    const isEditingCommission = commissionForm.editingCommissionId !== null;
    const isLoading = detailQuery.isLoading || supportQuery.isLoading;
    const isError = detailQuery.isError || supportQuery.isError || !attendant;

    function resetCommissionForm() {
        setCommissionForm(initialCommissionFormState);
    }

    function openCreateCommissionModal() {
        resetCommissionForm();
        setCommissionModalOpen(true);
    }

    function openEditCommissionModal(commission: { id: number; commission_percent?: number | string; value?: number | string; min_sales?: number | string; max_sales?: number | string }) {
        setCommissionForm({
            editingCommissionId: commission.id,
            commissionPercent: String(commission.commission_percent ?? commission.value ?? ''),
            minSales: toCurrencyInputValue(commission.min_sales),
            maxSales: toCurrencyInputValue(commission.max_sales),
            error: null,
        });
        setCommissionModalOpen(true);
    }

    async function handleSubmit() {
        if (!id || !type || !graduation || status === '') {
            setError('Selecione cargo, status e graduacao para salvar.');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await teamService.updateAttendant(Number(id), {
                status: Number(status),
                type: Number(type),
                graduation: Number(graduation),
                parent_id: selectedLeader?.id ?? null,
            });

            toast.success('Atendente atualizado com sucesso.');
            await detailQuery.refetch();
        } catch (err: unknown) {
            const message = extractApiErrorMessage(err, 'Nao foi possivel salvar as alteracoes.');
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSaveCommission() {
        if (!id) return;

        const { commissionPercent, minSales, maxSales, editingCommissionId } = commissionForm;
        const parsedPercent = Number(commissionPercent);
        const parsedMinSales = parseCurrencyInput(minSales);
        const parsedMaxSales = parseCurrencyInput(maxSales);

        if (!commissionPercent || !minSales || !maxSales) {
            setCommissionForm((prev) => ({ ...prev, error: 'Preencha percentual, venda minima e venda maxima.' }));
            return;
        }

        if ([parsedPercent, parsedMinSales, parsedMaxSales].some((value) => Number.isNaN(value))) {
            setCommissionForm((prev) => ({ ...prev, error: 'Informe apenas numeros validos para a faixa de comissao.' }));
            return;
        }

        if (parsedMinSales > parsedMaxSales) {
            setCommissionForm((prev) => ({ ...prev, error: 'A venda minima nao pode ser maior que a venda maxima.' }));
            return;
        }

        const hasOverlappingRange = commissionRanges.some((commission) => {
            if (editingCommissionId && commission.id === editingCommissionId) {
                return false;
            }

            const existingMin = Number(commission.min_sales);
            const existingMax = Number(commission.max_sales);

            if (Number.isNaN(existingMin) || Number.isNaN(existingMax)) {
                return false;
            }

            return parsedMinSales <= existingMax && parsedMaxSales >= existingMin;
        });

        if (hasOverlappingRange) {
            setCommissionForm((prev) => ({
                ...prev,
                error: 'Essa faixa cruza com outra ja cadastrada. Ajuste os valores para nao sobrepor.',
            }));
            return;
        }

        setIsSavingCommission(true);
        setCommissionForm((prev) => ({ ...prev, error: null }));

        try {
            if (editingCommissionId) {
                await teamService.updateAttendantCommission(editingCommissionId, {
                    commission_percent: parsedPercent,
                    min_sales: parsedMinSales,
                    max_sales: parsedMaxSales,
                });
                toast.success('Faixa de comissao atualizada com sucesso.');
            } else {
                await teamService.createAttendantCommission(Number(id), {
                    commission_percent: parsedPercent,
                    min_sales: parsedMinSales,
                    max_sales: parsedMaxSales,
                });
                toast.success('Faixa de comissao criada com sucesso.');
            }

            resetCommissionForm();
            setCommissionModalOpen(false);
            await detailQuery.refetch();
        } catch (err: unknown) {
            const message = extractApiErrorMessage(
                err,
                editingCommissionId
                    ? 'Nao foi possivel atualizar a faixa de comissao.'
                    : 'Nao foi possivel criar a faixa de comissao.',
            );
            setCommissionForm((prev) => ({ ...prev, error: message }));
            toast.error(message);
        } finally {
            setIsSavingCommission(false);
        }
    }

    async function handleDeleteCommission(commissionId: number) {
        setDeletingCommissionId(commissionId);
        try {
            await teamService.deleteAttendantCommission(commissionId);
            toast.success('Faixa de comissao excluida com sucesso.');
            await detailQuery.refetch();
        } catch (err: unknown) {
            const message = extractApiErrorMessage(err, 'Nao foi possivel excluir a faixa de comissao.');
            toast.error(message);
        } finally {
            setDeletingCommissionId(null);
        }
    }

    function requestDeleteCommission(commissionId: number) {
        setPendingDeleteCommissionId(commissionId);
    }

    async function confirmDeleteCommission() {
        if (!pendingDeleteCommissionId) return;
        await handleDeleteCommission(pendingDeleteCommissionId);
        setPendingDeleteCommissionId(null);
    }

    function requestSaveChanges() {
        setSaveConfirmOpen(true);
    }

    async function confirmSaveChanges() {
        setSaveConfirmOpen(false);
        await handleSubmit();
    }

    if (isLoading) {
        return (
            <PageLoadingState message="Carregando dados de edicao do atendente..." />
        );
    }

    if (isError) {
        return (
            <PageErrorState
                message="Erro ao carregar a tela de edicao do atendente."
                actionLabel="Voltar"
                onAction={() => navigate('/atendentes')}
            />
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
                        <DialogTitle>{isEditingCommission ? 'Editar faixa de comissao' : 'Nova faixa de comissao'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="commission-min-sales">Venda minima</FieldLabel>
                            <Input
                                id="commission-min-sales"
                                type="text"
                                inputMode="decimal"
                                value={commissionForm.minSales}
                                onChange={(e) => setCommissionForm((prev) => ({ ...prev, minSales: formatCurrencyInput(e.target.value) }))}
                                disabled={isSavingCommission}
                                placeholder="R$ 0,00"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="commission-max-sales">Venda maxima</FieldLabel>
                            <Input
                                id="commission-max-sales"
                                type="text"
                                inputMode="decimal"
                                value={commissionForm.maxSales}
                                onChange={(e) => setCommissionForm((prev) => ({ ...prev, maxSales: formatCurrencyInput(e.target.value) }))}
                                disabled={isSavingCommission}
                                placeholder="R$ 0,00"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="commission-percent">Percentual</FieldLabel>
                            <Input
                                id="commission-percent"
                                type="number"
                                min="0"
                                step="0.01"
                                value={commissionForm.commissionPercent}
                                onChange={(e) => setCommissionForm((prev) => ({ ...prev, commissionPercent: e.target.value }))}
                                disabled={isSavingCommission}
                                placeholder="5"
                            />
                            <FieldDescription>Ex.: `5` para 5% nessa faixa.</FieldDescription>
                        </Field>

                        {commissionForm.error && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                                {commissionForm.error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="destructive" onClick={() => setCommissionModalOpen(false)} disabled={isSavingCommission}>
                            <X className="w-4 h-4" />
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveCommission}
                            disabled={isSavingCommission}
                        >
                            {isSavingCommission ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditingCommission ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                            {isSavingCommission
                                ? (isEditingCommission ? 'Salvando faixa...' : 'Criando faixa...')
                                : (isEditingCommission ? 'Salvar faixa' : 'Criar faixa')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={pendingDeleteCommissionId !== null}
                onOpenChange={(open) => {
                    if (deletingCommissionId !== null) return;
                    if (!open) {
                        setPendingDeleteCommissionId(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Excluir faixa de comissao</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Deseja realmente excluir esta faixa de comissao? Esta acao nao pode ser desfeita.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setPendingDeleteCommissionId(null);
                            }}
                            disabled={deletingCommissionId !== null}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteCommission}
                            disabled={deletingCommissionId !== null}
                            className="gap-2"
                        >
                            {deletingCommissionId !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            {deletingCommissionId !== null ? 'Excluindo...' : 'Excluir faixa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={saveConfirmOpen}
                onOpenChange={(open) => {
                    if (isSaving) return;
                    setSaveConfirmOpen(open);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar alterações</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Deseja salvar as alterações deste atendente?
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSaveConfirmOpen(false)}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmSaveChanges}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Salvando...' : 'Confirmar e salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="animate-fade-in flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button
                        variant="default"
                        onClick={() => navigate(-1)}
                        className="rounded-xl shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
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
                                <StatusBadge status={attendant.status ?? null} />
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
                                <div className="flex flex-col items-end gap-1 text-right">
                                    <span className="font-medium">{attendant.parent?.user?.name ?? 'Sem lider vinculado'}</span>
                                </div>
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

                        <FieldGroup className="gap-5 md:grid md:grid-cols-2">
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
                                <FieldLabel htmlFor="attendant-status">Status</FieldLabel>
                                <Select value={status} onValueChange={setStatus} disabled={isSaving}>
                                    <SelectTrigger id="attendant-status">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Ativo</SelectItem>
                                        <SelectItem value="0">Inativo</SelectItem>
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
                                <Button onClick={requestSaveChanges} disabled={isSaving} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
                                onClick={openCreateCommissionModal}
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
                                        <div key={commission.id} className="rounded-xl border border-border/60 px-4 py-4 bg-slate-950/20">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="inline-flex items-center rounded-full border border-amber-300/60 bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-300">
                                                        ID #{commission.id}
                                                    </div>
                                                    <p className="font-semibold text-base">
                                                        {formatCurrency(commission.min_sales)} ate {formatCurrency(commission.max_sales)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPercent(commission.commission_percent ?? commission.value)} de comissao
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="gap-1.5 bg-sky-600 text-white hover:bg-sky-500"
                                                        onClick={() => openEditCommissionModal(commission)}
                                                        disabled={isSavingCommission || deletingCommissionId === commission.id}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="gap-1.5 bg-rose-600 text-white hover:bg-rose-500"
                                                        onClick={() => requestDeleteCommission(commission.id)}
                                                        disabled={isSavingCommission || deletingCommissionId === commission.id}
                                                    >
                                                        {deletingCommissionId === commission.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                        Excluir
                                                    </Button>
                                                </div>
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
