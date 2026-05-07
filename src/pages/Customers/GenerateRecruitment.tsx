import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Search, Sparkles, UserRound, UsersRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customerService, type SponsorLeader } from '@/services/customer.service';
import { useAuth } from '@/contexts/useAuth';
import { UserRole } from '@/config/permissions';
import { teamService } from '@/services/team.service';

function resolveGenerateRecruitmentError(error: unknown) {
    if (typeof error === 'object' && error !== null) {
        const maybeError = error as {
            response?: {
                data?: {
                    message?: string;
                };
            };
            message?: string;
        };

        const apiMessage = maybeError.response?.data?.message;

        if (apiMessage === 'order_must_be_adhesion_type') {
            return 'So e possivel gerar recrutamento com pedido de primeira compra.';
        }

        if (typeof apiMessage === 'string' && apiMessage.trim()) {
            return apiMessage;
        }

        if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
            return maybeError.message;
        }
    }

    return 'Erro ao gerar recrutamento.';
}

export default function GenerateRecruitment() {
    const { userType } = useAuth();
    const [leaderLogin, setLeaderLogin] = useState('');
    const [leader, setLeader] = useState<SponsorLeader | null>(null);
    const [orderId, setOrderId] = useState('');
    const [recruiterId, setRecruiterId] = useState('');
    const [searchingLeader, setSearchingLeader] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const showFinancialNotice = userType !== undefined && userType <= UserRole.SUPERVISOR;
    const attendantsQuery = useQuery({
        queryKey: ['generate-recruitment-attendants'],
        queryFn: () => teamService.getAttendants({ type: UserRole.ATENDENTE }),
        staleTime: 1000 * 60 * 5,
    });
    const attendants = attendantsQuery.data?.attendants?.data ?? [];
    const parsedOrderId = Number(orderId);
    const parsedRecruiterId = Number(recruiterId);
    const canSubmit = !!leader?.id
        && Number.isFinite(parsedOrderId)
        && parsedOrderId > 0
        && Number.isFinite(parsedRecruiterId)
        && parsedRecruiterId > 0;

    async function handleSearchLeader() {
        if (!leaderLogin.trim()) {
            toast.error('Informe o login do lider.');
            return;
        }

        setSearchingLeader(true);
        try {
            const result = await customerService.searchSponsorLeader(leaderLogin.trim());
            setLeader(result);
            toast.success('Lider encontrado.');
        } catch {
            setLeader(null);
            toast.error('Lider nao encontrado.');
        } finally {
            setSearchingLeader(false);
        }
    }

    async function handleSubmit() {
        if (!canSubmit) {
            return;
        }

        setSubmitting(true);
        try {
            await customerService.generateReengagement({
                leader_id: leader.id,
                recruiter_id: parsedRecruiterId,
                order_id: parsedOrderId,
            });

            toast.success('Recrutamento gerado com sucesso.');
            setOrderId('');
            setRecruiterId('');
        } catch (error) {
            toast.error(resolveGenerateRecruitmentError(error));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="p-4 py-8 sm:p-6 space-y-5 max-w-4xl mx-auto">
            <div className="animate-fade-in">
                <h1 className="font-display text-2xl font-bold tracking-tight">
                    Gerar recrutamento
                </h1>
            </div>

            {showFinancialNotice && (
                <Card className="border-amber-500/30 bg-amber-500/10 animate-fade-in">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                            <div>
                                <p className="text-sm font-semibold text-amber-100">
                                    Aviso operacional
                                </p>
                                <p className="text-sm text-amber-50/90">
                                    Depois de gerar o recrutamento, o responsavel precisa avisar o financeiro para reprocessar as comissoes.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-base">Dados para geracao</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <Field>
                        <FieldLabel htmlFor="leader-login">Login do lider</FieldLabel>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                id="leader-login"
                                value={leaderLogin}
                                onChange={(event) => {
                                    setLeaderLogin(event.target.value);
                                    setLeader(null);
                                }}
                                placeholder="Ex: joao123"
                                className="bg-surface-highest border-none focus-visible:ring-0"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSearchLeader}
                                disabled={searchingLeader}
                            >
                                <Search className="h-4 w-4" />
                                {searchingLeader ? 'Buscando...' : 'Buscar lider'}
                            </Button>
                        </div>
                        <FieldDescription>
                            Informe o login para localizar e confirmar o lider correto.
                        </FieldDescription>
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="order-id">Codigo do pedido</FieldLabel>
                            <Input
                                id="order-id"
                                type="number"
                                value={orderId}
                                onChange={(event) => setOrderId(event.target.value)}
                                placeholder="Ex: 12345"
                                className="bg-surface-highest border-none focus-visible:ring-0"
                            />
                            <FieldDescription>
                                Informe o codigo do pedido que sera usado na geracao.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Atendente</FieldLabel>
                            <Select value={recruiterId || undefined} onValueChange={setRecruiterId}>
                                <SelectTrigger className="bg-surface-highest border-none focus:ring-0">
                                    <SelectValue placeholder={attendantsQuery.isLoading ? 'Carregando atendentes...' : 'Selecione o atendente'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {attendants.map((attendant) => (
                                        <SelectItem key={attendant.id} value={String(attendant.user.id)}>
                                            {attendant.user.name} (@{attendant.user.login})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                Selecione o atendente responsavel pelo recrutamento.
                            </FieldDescription>
                        </Field>
                    </div>

                    {attendantsQuery.isError && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            Nao foi possivel carregar a lista de atendentes para vincular o recruiter.
                        </div>
                    )}

                    <div className="rounded-2xl border border-border bg-surface-highest/50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <UsersRound className="h-4 w-4 text-on-surface-variant" />
                            <p className="text-sm font-semibold text-on-surface">Lider selecionado</p>
                        </div>

                        {leader ? (
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-medium text-on-surface">{leader.name}</p>
                                    <p className="text-sm text-on-surface-variant">@{leader.login}</p>
                                    {leader.email && (
                                        <p className="text-sm text-on-surface-variant truncate">{leader.email}</p>
                                    )}
                                </div>
                                <Badge variant="secondary" className="shrink-0">
                                    ID {leader.id}
                                </Badge>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                <UserRound className="h-4 w-4" />
                                Nenhum lider validado ainda.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={submitting || !canSubmit}>
                            {submitting ? 'Gerando...' : 'Gerar recrutamento'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
