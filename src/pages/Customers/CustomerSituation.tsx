import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Search,
    ShieldCheck,
    UserX,
    Link2,
    Clock,
    Globe,
    AlertTriangle,
    Loader2,
    User,
    CalendarClock,
    Hash,
    Mail,
    AtSign,
    ScanSearch,
    ShieldBan,
    Headset,
    ShoppingBag,
    UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    customerService,
    type SituationIdentifier,
    type SituationResult,
    type SituationCode,
} from '@/services/customer.service';

// ─── types ────────────────────────────────────────────────────────────────────

type SearchField = 'cpf' | 'email' | 'login';

type ReEngagement = {
    id?: number;
    status?: number;
    status_label?: string;
    created_at?: string;
    personal_order_id?: number | null;
    recruiter?: {
        id?: number;
        login?: string;
        name?: string;
        email?: string;
    } | null;
    leader?: { id?: number; login?: string; name?: string } | null;
};

// ─── meta map ─────────────────────────────────────────────────────────────────

interface SituationMeta {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    codeLabel: string; // Portuguese translation of the API code
    color: string;
    glow: string;
    ring: string;
    pill: string;
}

const SITUATION_MAP: Record<string, SituationMeta> = {
    eligible: {
        icon: ShieldCheck,
        label: 'Elegível',
        codeLabel: 'Elegível',
        color: 'text-emerald-400',
        glow: 'shadow-[0_0_32px_0_rgba(52,211,153,0.18)]',
        ring: 'border-emerald-500/35',
        pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    blocked_registration: {
        icon: ShieldBan,
        label: 'Cadastro bloqueado',
        codeLabel: 'Cadastro bloqueado',
        color: 'text-red-400',
        glow: 'shadow-[0_0_32px_0_rgba(239,68,68,0.18)]',
        ring: 'border-red-500/35',
        pill: 'bg-red-500/15 text-red-300 border-red-500/30',
    },
    already_linked: {
        icon: Link2,
        label: 'Já vinculado',
        codeLabel: 'Já vinculado',
        color: 'text-amber-400',
        glow: 'shadow-[0_0_32px_0_rgba(251,191,36,0.18)]',
        ring: 'border-amber-500/35',
        pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    out_of_rule: {
        icon: Clock,
        label: 'Fora da regra',
        codeLabel: 'Fora da regra de inatividade',
        color: 'text-orange-400',
        glow: 'shadow-[0_0_32px_0_rgba(251,146,60,0.18)]',
        ring: 'border-orange-500/35',
        pill: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    },
    not_customer: {
        icon: UserX,
        label: 'Não é cliente',
        codeLabel: 'Usuário não é cliente',
        color: 'text-slate-400',
        glow: 'shadow-[0_0_32px_0_rgba(148,163,184,0.12)]',
        ring: 'border-slate-500/35',
        pill: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    },
    different_country: {
        icon: Globe,
        label: 'País diferente',
        codeLabel: 'Cliente de outro país',
        color: 'text-purple-400',
        glow: 'shadow-[0_0_32px_0_rgba(167,139,250,0.18)]',
        ring: 'border-purple-500/35',
        pill: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
};

function getMeta(code: SituationCode): SituationMeta {
    return (
        SITUATION_MAP[code] ?? {
            icon: AlertTriangle,
            label: code,
            codeLabel: code,
            color: 'text-on-surface-variant',
            glow: '',
            ring: 'border-border',
            pill: 'bg-surface-container text-on-surface-variant border-border',
        }
    );
}

// ─── utils ────────────────────────────────────────────────────────────────────

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Tradução dos códigos de erro retornados pela API
const API_ERROR_MESSAGES: Record<string, string> = {
    user_not_found: 'Usuário não encontrado.',
    not_found: 'Registro não encontrado.',
    unauthenticated: 'Sessão expirada. Faça login novamente.',
    unauthorized: 'Você não tem permissão para realizar esta ação.',
    validation_error: 'Dados inválidos. Verifique os campos e tente novamente.',
    invalid_identifier:
        'Identificador inválido. Informe um CPF, e-mail ou login válido.',
    too_many_requests:
        'Muitas tentativas. Aguarde alguns instantes e tente novamente.',
    server_error: 'Erro interno do servidor. Tente novamente mais tarde.',
};

function extractError(err: unknown) {
    const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
    };
    const apiMsg = e?.response?.data?.message ?? e?.message ?? '';
    // Se o código existir no mapa, usa a tradução; senão usa a mensagem original ou fallback
    return (
        API_ERROR_MESSAGES[apiMsg] ??
        (apiMsg.trim() || 'Ocorreu um erro inesperado. Tente novamente.')
    );
}

// ─── sub-components ───────────────────────────────────────────────────────────

interface DataChipProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
}

function DataChip({ icon: Icon, label, value }: DataChipProps) {
    return (
        <div className="flex items-start gap-2.5 min-w-0">
            <div className="mt-0.5 shrink-0 rounded-lg bg-surface-container p-1.5">
                <Icon className="h-3.5 w-3.5 text-on-surface-variant" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wide leading-none mb-0.5">
                    {label}
                </p>
                <p className="text-sm font-semibold text-on-surface truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}

interface StatusTileProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active: boolean;
    activeCls: string; // bg + text + border when active
}

function StatusTile({ icon: Icon, label, active, activeCls }: StatusTileProps) {
    return (
        <div
            className={`
            flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center
            transition-colors duration-200
            ${
                active
                    ? `${activeCls} border-current`
                    : 'bg-surface-container/50 border-border/40 text-on-surface-variant/50'
            }
        `}
        >
            <Icon className={`h-4 w-4 ${active ? '' : 'opacity-40'}`} />
            <span className="text-[11px] font-semibold leading-tight">
                {label}
            </span>
        </div>
    );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerSituation() {
    const [searchField, setSearchField] = useState<SearchField>('login');
    const [identifier, setIdentifier] = useState('');
    const [inactiveDays, setInactiveDays] = useState('');

    const mutation = useMutation({
        mutationFn: (p: SituationIdentifier) =>
            customerService.checkSituation(p),
    });

    const result: SituationResult | null = mutation.data ?? null;
    const meta = result ? getMeta(result.situation.code) : null;
    const SitIcon = meta?.icon;

    const re = result?.reengagement as ReEngagement | null;

    function buildPayload(): SituationIdentifier {
        const p: SituationIdentifier = { [searchField]: identifier.trim() };
        const d = parseInt(inactiveDays, 10);
        if (!isNaN(d) && d > 0) p.inactive_days = d;
        return p;
    }

    function handleSearch() {
        if (!identifier.trim()) return;
        mutation.mutate(buildPayload());
    }

    const placeholders: Record<SearchField, string> = {
        cpf: '12345678900',
        email: 'joao@exemplo.com',
        login: 'joaosilva',
    };

    return (
        <div className="flex flex-col h-full">
            {/* ── Top bar: header + form ── */}
            <div className="shrink-0 border-b border-border/50 bg-card px-4 py-4 sm:px-6">
                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Title */}
                    <div>
                        <h1 className="font-display text-xl font-bold tracking-tight leading-none">
                            Consulta de Situação
                        </h1>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Verifique a elegibilidade do cliente antes de
                            iniciar o atendimento.
                        </p>
                    </div>

                    {/* Inline search form */}
                    <div className="flex flex-wrap items-end gap-3">
                        {/* Tipo */}
                        <div className="flex flex-col gap-1 w-32">
                            <label className="text-xs font-medium text-on-surface-variant">
                                Buscar por
                            </label>
                            <Select
                                value={searchField}
                                onValueChange={(v) => {
                                    setSearchField(v as SearchField);
                                    setIdentifier('');
                                    mutation.reset();
                                }}
                            >
                                <SelectTrigger className="h-9 border-none bg-surface-highest focus:ring-0 md:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cpf">CPF</SelectItem>
                                    <SelectItem value="email">
                                        E-mail
                                    </SelectItem>
                                    <SelectItem value="login">Login</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Identificador */}
                        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                            <label
                                htmlFor="identifier"
                                className="text-xs font-medium text-on-surface-variant"
                            >
                                {searchField === 'cpf'
                                    ? 'CPF'
                                    : searchField === 'email'
                                      ? 'E-mail'
                                      : 'Login'}
                            </label>
                            <Input
                                id="identifier"
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value);
                                    mutation.reset();
                                }}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSearch()
                                }
                                placeholder={placeholders[searchField]}
                                className="h-9 border-none bg-surface-highest text-base focus-visible:ring-0 md:text-sm"
                            />
                        </div>

                        {/* Dias */}
                        <div className="flex flex-col gap-1 w-32">
                            <label
                                htmlFor="inactive-days"
                                className="text-xs font-medium text-on-surface-variant"
                            >
                                Inatividade{' '}
                                <span className="opacity-50">(dias)</span>
                            </label>
                            <Input
                                id="inactive-days"
                                type="number"
                                min={1}
                                value={inactiveDays}
                                onChange={(e) =>
                                    setInactiveDays(e.target.value)
                                }
                                placeholder="Padrão: 90"
                                className="h-9 border-none bg-surface-highest text-base focus-visible:ring-0 md:text-sm"
                            />
                        </div>

                        {/* Button */}
                        <Button
                            onClick={handleSearch}
                            disabled={!identifier.trim() || mutation.isPending}
                            className="h-9 px-5 shrink-0"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                    Consultando...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4" /> Consultar
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Error inline */}
                    {mutation.isError && (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive animate-scale-in">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            {extractError(mutation.error)}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Content area ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    {/* Empty state */}
                    {!result && !mutation.isPending && (
                        <div className="flex flex-col items-center justify-center py-28 text-center text-on-surface-variant animate-fade-in">
                            <div className="mb-5 rounded-2xl border border-border/40 bg-surface-container/60 p-8">
                                <ScanSearch className="h-12 w-12 opacity-30" />
                            </div>
                            <p className="text-base font-semibold opacity-60">
                                Nenhuma consulta realizada
                            </p>
                            <p className="text-sm mt-1 opacity-40">
                                Use o formulário acima para verificar um
                                cliente.
                            </p>
                        </div>
                    )}

                    {/* Loading */}
                    {mutation.isPending && (
                        <div className="flex items-center justify-center py-28 animate-fade-in">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Result */}
                    {result && meta && SitIcon && (
                        <div className="space-y-4 animate-fade-in">
                            {/* ── Hero: situation banner ── */}
                            <div
                                className={`
                                relative overflow-hidden rounded-2xl border p-5
                                ${meta.ring} ${meta.glow}
                                bg-card
                            `}
                            >
                                {/* subtle tinted bg gradient */}
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                                    style={{
                                        background: `radial-gradient(ellipse at 10% 50%, currentColor 0%, transparent 70%)`,
                                    }}
                                />

                                <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Icon circle */}
                                    <div
                                        className={`
                                        shrink-0 flex items-center justify-center
                                        w-14 h-14 rounded-2xl border
                                        ${meta.pill}
                                    `}
                                    >
                                        <SitIcon
                                            className={`h-7 w-7 ${meta.color}`}
                                        />
                                    </div>

                                    {/* Text block */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span
                                                className={`text-lg font-bold leading-none ${meta.color}`}
                                            >
                                                {meta.label}
                                            </span>
                                            <span
                                                className={`
                                                text-xs font-semibold rounded-full px-2.5 py-0.5 border
                                                ${meta.pill}
                                            `}
                                            >
                                                {meta.codeLabel}
                                            </span>
                                            {result.eligible && (
                                                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                                                    ✓ Elegível para atendimento
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                                            {result.situation.message}
                                        </p>
                                    </div>

                                    {/* Eligible / Blocked pill (right) */}
                                    <div className="shrink-0">
                                        {result.eligible ? (
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-300">
                                                <ShieldCheck className="h-4 w-4" />{' '}
                                                Pode atender
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300">
                                                <ShieldBan className="h-4 w-4" />{' '}
                                                Bloqueado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Main content grid ── */}
                            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                                {/* Left: client + reengagement */}
                                <div className="space-y-4">
                                    {/* Client card */}
                                    {result.user && (
                                        <div className="rounded-2xl border border-border/50 bg-card p-4">
                                            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                                                <User className="h-3.5 w-3.5" />{' '}
                                                Dados do cliente
                                            </p>
                                            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {result.user.name && (
                                                    <DataChip
                                                        icon={User}
                                                        label="Nome"
                                                        value={result.user.name}
                                                    />
                                                )}
                                                {result.user.login && (
                                                    <DataChip
                                                        icon={AtSign}
                                                        label="Login"
                                                        value={`@${result.user.login}`}
                                                    />
                                                )}
                                                {result.user.email && (
                                                    <DataChip
                                                        icon={Mail}
                                                        label="E-mail"
                                                        value={
                                                            result.user.email
                                                        }
                                                    />
                                                )}
                                                {result.user.country_code && (
                                                    <DataChip
                                                        icon={Globe}
                                                        label="País"
                                                        value={result.user.country_code.toUpperCase()}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reengagement card */}
                                    {re && (
                                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                                                <Link2 className="h-3.5 w-3.5" />{' '}
                                                Vínculo de Atendimento
                                            </p>
                                            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {re.id != null && (
                                                    <DataChip
                                                        icon={Hash}
                                                        label="ID"
                                                        value={`#${re.id}`}
                                                    />
                                                )}
                                                {re.status_label && (
                                                    <DataChip
                                                        icon={ShieldCheck}
                                                        label="Status"
                                                        value={
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                                                                {
                                                                    re.status_label
                                                                }
                                                            </span>
                                                        }
                                                    />
                                                )}
                                                {re.personal_order_id !=
                                                    null && (
                                                    <DataChip
                                                        icon={ShoppingBag}
                                                        label="Pedido"
                                                        value={`#${re.personal_order_id}`}
                                                    />
                                                )}
                                                {re.created_at && (
                                                    <DataChip
                                                        icon={CalendarClock}
                                                        label="Criado em"
                                                        value={fmt(
                                                            re.created_at,
                                                        )}
                                                    />
                                                )}
                                                {re.recruiter?.name && (
                                                    <DataChip
                                                        icon={Headset}
                                                        label="Atendente"
                                                        value={`${re.recruiter.name}`}
                                                    />
                                                )}
                                                <DataChip
                                                    icon={User}
                                                    label="Líder"
                                                    value={
                                                        re.leader?.name ? (
                                                            `${re.leader.name} (@${re.leader.login})`
                                                        ) : (
                                                            <span className="text-on-surface-variant font-normal">
                                                                Sem líder
                                                            </span>
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: status 2×2 grid */}
                                <div className="rounded-2xl border border-border/50 bg-card p-4 h-fit">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
                                        Indicadores
                                    </p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <StatusTile
                                            icon={ShieldBan}
                                            label="Bloqueado"
                                            active={result.status.is_blocked}
                                            activeCls="bg-red-500/15 text-red-400"
                                        />
                                        <StatusTile
                                            icon={Link2}
                                            label="Atendimento ativo"
                                            active={
                                                result.status
                                                    .has_open_reengagement
                                            }
                                            activeCls="bg-amber-500/15 text-amber-400"
                                        />
                                        <StatusTile
                                            icon={ShoppingBag}
                                            label="Pedido recente"
                                            active={
                                                result.status
                                                    .has_recent_paid_order
                                            }
                                            activeCls="bg-blue-500/15 text-blue-400"
                                        />
                                        <StatusTile
                                            icon={UserPlus}
                                            label="Conta nova"
                                            active={
                                                result.status.is_new_account
                                            }
                                            activeCls="bg-purple-500/15 text-purple-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
