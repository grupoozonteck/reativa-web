import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageCircle,
    ExternalLink,
    Loader2,
    ShoppingBag,
    Edit,
    Store,
    ClipboardEdit,
    Package,
    CalendarClock,
    StickyNote,
    UserPlus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    getInitials,
    getAvatarColor,
    formatWhatsApp,
    getWhatsAppLink,
    formatDate,
    formatDateTime,
    formatCurrency,
} from '@/utils/client-utils';
import { customerService } from '@/services/customer.service';
import { EditClienteModal } from '@/components/Customers/EditClienteModal';
import { AddObservacaoModal } from '@/components/Customers/AddObservacaoModal';
import { InformSponsorModal } from '@/components/Customers/InformSponsorModal';
import { CustomerLatestOrderCard } from '@/components/Customers/CustomerLatestOrderCard';
import { reengagementStatusMap } from '@/utils/color-ultis';
import { orderStatusStyleMap } from '@/config/orderStatus';
import { PageErrorState, PageLoadingState } from '@/components/ui/page-state';


export default function ClienteDetalhes() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [observacaoModalOpen, setObservacaoModalOpen] = useState(false);
    const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
    const [accessingStore, setAccessingStore] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleAccessStore = async () => {
        if (!id) return;
        setAccessingStore(true);
        try {
            const res = await customerService.getAccessStoreLink(Number(id));
            const token = res?.data?.token;
            if (token) {
                window.open(`${import.meta.env.VITE_OFFICE_BASE_URL}/impersonation/${token}`, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {
            console.error('Erro ao obter link da loja:', err);
        } finally {
            setAccessingStore(false);
        }
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['customer-detail', id],
        queryFn: () => customerService.getUserDetail(Number(id)),
        enabled: !!id,
        select: (res) => res.data,
    });

    const user = data?.user ?? null;
    const reengagement = data?.customer_reengagement ?? null;
    const statusMap = data?.status_reengagements ?? {};
    const orderStatusCollection = data?.status_order_collection ?? {};
    const linkedLeader = reengagement?.leader ?? null;

    if (isLoading) {
        return (
            <PageLoadingState message="Carregando detalhes do cliente..." />
        );
    }

    if (isError || !user) {
        return (
            <PageErrorState
                message="Erro ao carregar os detalhes do cliente."
                actionLabel="Voltar"
                onAction={() => navigate('/customers')}
                actionVariant="ghost"
            />
        );
    }

    const personalData = user.personal_data ?? user.personalData ?? null;
    const personalAddress = user.personal_address ?? user.personalAddress ?? null;
    const whatsapp = personalData?.whatsapp || personalData?.phone_number || user.phone_number;
    const phoneNumber = personalData?.phone_number || user.phone_number;
    const initials = getInitials(user.name);
    const avatarColor = getAvatarColor(user.name);
    const orders = (user.personal_orders ?? user.personalOrders ?? []).slice().sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const address = personalAddress;
    const reengStatus = reengagement ? reengagementStatusMap[reengagement.status] : null;
    const hasWhatsapp = !!whatsapp;
    const observations = reengagement?.observations ?? [];

    const totalValue = orders.reduce((sum, o) => sum + parseFloat(o.value || '0'), 0);
    const paidOrders = orders.filter(o => o.payment_date).length;

    return (
        <>
            <EditClienteModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                userId={user.id}
                initialEmail={user.email}
                initialBirthDate={personalData?.birth_date?.slice(0, 10) ?? ''}
                initialStatus={reengagement?.status ?? 1}
                statusOptions={statusMap}
                onUpdated={() => refetch()}
            />
            {reengagement && (
                <AddObservacaoModal
                    open={observacaoModalOpen}
                    onClose={() => setObservacaoModalOpen(false)}
                    reengagementId={reengagement.id}
                    onUpdated={() => refetch()}
                />
            )}
            <InformSponsorModal
                open={sponsorModalOpen}
                onClose={() => setSponsorModalOpen(false)}
                userId={user.id}
                existingLeader={linkedLeader}
                onUpdated={() => refetch()}
            />

            <div className="p-4 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
                {/* Back */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="gap-2 text-on-surface-variant hover:text-primary -ml-1"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Button>

                {/* Hero header */}
                <Card className="animate-fade-in">
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Avatar */}
                            {personalData?.avatar ? (
                                <img
                                    src={personalData.avatar}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                                />
                            ) : (
                                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0', avatarColor)}>
                                    {initials}
                                </div>
                            )}

                            {/* Name + meta */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h1 className="font-display text-xl font-black text-on-surface">{user.name}</h1>
                                    {reengStatus && (
                                        <Badge className={cn('border text-xs', reengStatus.color)}>
                                            {reengStatus.label}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-on-surface-variant font-mono mb-3">
                                    ID: #{user.id} · {user.login} · Cliente desde {formatDate(user.created_at)}
                                </p>
                                {reengagement && (
                                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-on-surface">Atendimento </span>
                                            <span className="text-xs font-mono text-on-surface">#{reengagement.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-on-surface">Iniciado em </span>
                                            <span className="text-xs text-on-surface">{formatDateTime(reengagement.created_at)}</span>
                                        </div>
                                        {linkedLeader && (
                                            <div>
                                                <span className="text-xs uppercase tracking-wider">Lider </span>
                                                <span className="text-xs text-on-surface">{linkedLeader.name} (@{linkedLeader.login})</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 sm:shrink-0">
                                <Button
                                    size="sm"
                                    onClick={handleAccessStore}
                                    disabled={accessingStore}
                                    className="gap-2 bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold"
                                >
                                    {accessingStore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                                    Acessar conta
                                </Button>
                                {hasWhatsapp ? (
                                    <Button size="sm" asChild variant="outline" className="gap-2">
                                        <a href={getWhatsAppLink(whatsapp)} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="w-4 h-4" />
                                            WhatsApp
                                        </a>
                                    </Button>
                                ) : (
                                    <Button size="sm" disabled variant="outline" className="gap-2 opacity-40">
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </Button>
                                )}
                                {reengagement && (
                                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setObservacaoModalOpen(true)}>
                                        <ClipboardEdit className="w-4 h-4" />
                                        Observação
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => setSponsorModalOpen(true)}
                                    disabled={!!linkedLeader}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    {linkedLeader ? 'Leader vinculado' : 'Leader'}
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setEditModalOpen(true)}>
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="geral">
                    <TabsList className="mb-4">
                        <TabsTrigger value="geral">Geral</TabsTrigger>
                        <TabsTrigger value="pedidos">
                            Pedidos
                            {orders.length > 0 && (
                                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-4">{orders.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="observacoes">
                            Observações
                            {observations.length > 0 && (
                                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-4">{observations.length}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* ── GERAL ── */}
                    <TabsContent value="geral" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left column */}
                            <div className="space-y-4">
                                {/* Contato */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs uppercase tracking-wider text-on-surface-variant">Informações de Contato</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Mail className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">E-mail</p>
                                                <p className="text-sm text-on-surface break-all">{user.email || '--'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <MessageCircle className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">WhatsApp</p>
                                                {hasWhatsapp ? (
                                                    <a
                                                        href={getWhatsAppLink(whatsapp)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1"
                                                    >
                                                        {formatWhatsApp(whatsapp)}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-on-surface-variant">--</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Phone className="w-4 h-4 text-secondary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">Telefone</p>
                                                <p className="text-sm text-on-surface">{formatWhatsApp(phoneNumber) || '--'}</p>
                                            </div>
                                        </div>
                                        {address && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MapPin className="w-4 h-4 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">Endereço</p>
                                                    <p className="text-sm text-on-surface">{address.address_line}, {address.number}</p>
                                                    {address.complement && <p className="text-sm text-on-surface-variant">{address.complement}</p>}
                                                    <p className="text-sm text-on-surface-variant">{address.district}</p>
                                                    <p className="text-sm text-on-surface-variant">{address.city?.name}{address.state?.name ? ` - ${address.state.name}` : ''}</p>
                                                    <p className="text-sm text-on-surface-variant">CEP: {address.zip_code}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface-highest flex items-center justify-center shrink-0 mt-0.5">
                                                <Calendar className="w-4 h-4 text-on-surface-variant" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">Cadastro</p>
                                                <p className="text-sm text-on-surface">{formatDate(user.created_at)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Right column */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Stats mini-cards — 4 em linha */}
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Package className="w-4 h-4 text-accent" />
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Total Pedidos</p>
                                            </div>
                                            <p className="font-display text-2xl font-black text-on-surface">{orders.length}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShoppingBag className="w-4 h-4 text-secondary" />
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Pedidos Pagos</p>
                                            </div>
                                            <p className="font-display text-2xl font-black text-on-surface">{paidOrders}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ClipboardEdit className="w-4 h-4 text-primary" />
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Observações</p>
                                            </div>
                                            <p className="font-display text-2xl font-black text-on-surface">{observations.length}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-l-4 border-l-primary">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShoppingBag className="w-4 h-4 text-primary" />
                                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Valor Total</p>
                                            </div>
                                            <p className="font-display text-xl font-black text-primary">{formatCurrency(totalValue)}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent orders table */}
                                <Card>
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs uppercase tracking-wider text-on-surface-variant">Pedidos Recentes</CardTitle>
                                        <Badge variant="secondary" className="text-xs">Total {orders.length}</Badge>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {orders.length === 0 ? (
                                            <p className="text-sm text-on-surface-variant/50 px-5 pb-5">Sem pedidos registrados.</p>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>ID</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Valor</TableHead>
                                                        <TableHead className="hidden sm:table-cell">Data</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {orders.map(order => {
                                                        const status = orderStatusStyleMap[order.status] || orderStatusStyleMap[1];
                                                        const statusLabel = orderStatusCollection[String(order.status)] || 'Desconhecido';
                                                        const StatusIcon = status.icon;
                                                        return (
                                                            <TableRow key={order.id}>
                                                                <TableCell className="font-mono text-on-surface-variant text-xs">#{order.code}</TableCell>
                                                                <TableCell>
                                                                    <Badge className={cn('text-xs border gap-1', status.color)}>
                                                                        <StatusIcon className="w-3 h-3" />
                                                                        {statusLabel}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right font-semibold text-secondary text-sm">{formatCurrency(order.value)}</TableCell>
                                                                <TableCell className="hidden sm:table-cell text-xs text-on-surface-variant">{formatDate(order.created_at)}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>

                            </div>
                        </div>
                    </TabsContent>

                    {/* ── PEDIDOS ── */}
                    <TabsContent value="pedidos" className="space-y-4">
                        {orders.length === 0 ? (
                            <Card>
                                <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
                                    <Package className="w-8 h-8 text-on-surface-variant/30" />
                                    <p className="text-sm text-on-surface-variant/50">Nenhum pedido encontrado.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            orders.map(order => (
                                <CustomerLatestOrderCard key={order.id} order={order} orderStatusCollection={orderStatusCollection} />
                            ))
                        )}
                    </TabsContent>

                    {/* ── OBSERVAÇÕES ── */}
                    <TabsContent value="observacoes" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-on-surface-variant">{observations.length} {observations.length === 1 ? 'observação registrada' : 'observações registradas'}</p>
                            {reengagement && (
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setObservacaoModalOpen(true)}>
                                    <ClipboardEdit className="w-4 h-4" />
                                    Nova observação
                                </Button>
                            )}
                        </div>

                        {observations.length === 0 ? (
                            <Card>
                                <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
                                    <StickyNote className="w-8 h-8 text-on-surface-variant/30" />
                                    <p className="text-sm text-on-surface-variant/50">Nenhuma observação registrada ainda.</p>
                                    {reengagement && (
                                        <Button size="sm" variant="outline" className="gap-2 mt-1" onClick={() => setObservacaoModalOpen(true)}>
                                            <ClipboardEdit className="w-4 h-4" />
                                            Registrar primeira observação
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            observations.map(obs => (
                                <Card key={obs.id} className="animate-fade-in">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <StickyNote className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-on-surface leading-relaxed">{obs.observation}</p>
                                                <div className="flex flex-wrap gap-4 mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Registrado em {formatDateTime(obs.created_at)}
                                                    </div>
                                                    {obs.next_contact_date && (
                                                        <div className="flex items-center gap-1.5 text-xs text-primary">
                                                            <CalendarClock className="w-3.5 h-3.5" />
                                                            Próximo contato: {formatDateTime(obs.next_contact_date)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}


