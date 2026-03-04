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
    Package,
    Loader2,
    Tag,
    User,
    ShoppingBag,
    AlertCircle,
    Edit,
    Store,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate, formatDateTime, formatCurrency } from '@/lib/client-utils';
import {
    customerService,
    type PersonalOrder,
} from '@/services/customer.service';


import { orderStatusStyleMap, deliveryStatusMap } from '@/config/orderStatus';
import { EditClienteModal } from '@/components/Clientes/EditClienteModal';

const reengagementStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Em Atendimento', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
    2: { label: 'Reativado', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
};

export default function ClienteDetalhes() {
    const [editModalOpen, setEditModalOpen] = useState(false);
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
                window.open(`https://office.grupoozonteck.com/impersonation/${token}`, '_blank', 'noopener,noreferrer');
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
    const reengagement = data?.customerReengagement ?? null;
    const statusMap = data?.statusReengagements ?? {};
    const orderStatusCollection = data?.statusOrderCollection ?? {};

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm text-muted-foreground">Carregando detalhes do cliente...</p>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <p className="text-sm text-muted-foreground">Erro ao carregar os detalhes do cliente.</p>
                    <Button variant="outline" onClick={() => navigate('/clientes')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    const whatsapp = user.personal_data?.whatsapp || user.phone_number;
    const initials = getInitials(user.name);
    const avatarColor = getAvatarColor(user.name);
    const orders = user.personal_orders ?? [];
    const order = orders.reduce<PersonalOrder | null>((latest, current) => {
        if (!latest) return current;
        return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest;
    }, null);
    const address = user.personal_address;
    const reengStatus = reengagement ? reengagementStatusMap[reengagement.status] : null;


    return (
        <>
            <EditClienteModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                userId={user.id}
                initialEmail={user.email}
                initialBirthDate={user.personal_data?.birth_date?.slice(0, 10) ?? ''}
                initialStatus={reengagement?.status ?? 1}
                statusOptions={statusMap}
                onUpdated={() => refetch()}
            />
            <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 animate-fade-in">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-xl shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-extrabold tracking-tight">Detalhes do Cliente</h1>
                        <p className="text-xs text-muted-foreground">#{user.id} - {user.login}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAccessStore}
                            disabled={accessingStore}
                            className="gap-2"
                        >
                            {accessingStore ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Store className="w-4 h-4" />
                            )}
                            Acessar conta
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditModalOpen(true)}
                            className="gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                        {reengStatus && (
                            <Badge className={cn('text-xs border', reengStatus.color)}>
                                {reengStatus.label}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Card principal */}
                <div className="solid-card p-5 sm:p-6 animate-fade-in" style={{ animationDelay: '60ms', opacity: 0 }}>
                    <div className="flex items-start gap-4 sm:gap-5">
                        {/* Avatar */}
                        {user.personal_data?.avatar ? (
                            <img
                                src={user.personal_data.avatar}
                                alt={user.name}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0"
                            />
                        ) : (
                            <div
                                className={cn(
                                    'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0',
                                    avatarColor
                                )}
                            >
                                {initials}
                            </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-3">
                            <div>
                                <h2 className="text-lg font-bold">{user.name}</h2>
                                <p className="text-sm text-muted-foreground">{user.classification}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoItem icon={Mail} iconBg="bg-violet-500" label={user.email} />
                                <InfoItem
                                    icon={MessageCircle}
                                    iconBg="bg-emerald-500"
                                    label={
                                        <a
                                            href={getWhatsAppLink(whatsapp)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1.5"
                                        >
                                            {formatWhatsApp(whatsapp)}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    }
                                />
                                <InfoItem icon={Phone} iconBg="bg-blue-500" label={formatWhatsApp(user.phone_number)} />
                                <InfoItem icon={Calendar} iconBg="bg-amber-500" label={`Cadastro: ${formatDate(user.created_at)}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de 2 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Endereço */}
                    <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '120ms', opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold">Endereço</h3>
                        </div>
                        {address ? (
                            <div className="space-y-1.5 text-sm text-muted-foreground">
                                <p>{address.address_line}, {address.number}</p>
                                {address.complement && <p>{address.complement}</p>}
                                <p>{address.district}</p>
                                <p>{address.city?.name} - {address.state?.uf}</p>
                                <p>CEP: {address.zip_code}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground/60">Sem endereço cadastrado</p>
                        )}
                    </div>

                    {/* Info do Atendimento */}
                    <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '180ms', opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold">Atendimento</h3>
                        </div>
                        {reengagement ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <Badge className={cn('text-xs border', reengStatus?.color)}>
                                        {reengStatus?.label || statusMap[String(reengagement.status)] || 'Desconhecido'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Iniciado em</span>
                                    <span className="text-sm font-medium">{formatDateTime(reengagement.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">ID Atendimento</span>
                                    <span className="text-sm font-mono text-muted-foreground">#{reengagement.id}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground/60">Sem dados de atendimento</p>
                        )}
                    </div>
                </div>

                {/* Ultimo Pedido */}
                {order && <OrderCard order={order} orderStatusCollection={orderStatusCollection} />}

                {/* Ações rápidas */}
                <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <h3 className="text-sm font-semibold mb-4">Ações rápidas</h3>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={getWhatsAppLink(whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                <MessageCircle className="w-4 h-4" />
                                Enviar WhatsApp
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => navigate('/meus-atendimentos')}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Meus Atendimentos
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

function InfoItem({ icon: Icon, iconBg, label }: { icon: typeof Mail; iconBg: string; label: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="truncate text-muted-foreground">{label}</span>
        </div>
    );
}

function OrderCard({ order, orderStatusCollection }: { order: PersonalOrder; orderStatusCollection: Record<string, string> }) {
    const status = orderStatusStyleMap[order.status] || orderStatusStyleMap[1];
    const statusLabel = orderStatusCollection[String(order.status)] || 'Desconhecido';
    const deliveryStatus = typeof order.delivery_status === 'number'
        ? deliveryStatusMap[order.delivery_status]
        : undefined;
    const StatusIcon = status.icon;

    return (
        <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '240ms', opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold">Pedido #{order.code}</h3>
                </div>
                <Badge className={cn('text-xs border gap-1.5', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Valor</p>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">{formatCurrency(order.value)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Pontos</p>
                    <p className="text-lg font-black text-violet-600 dark:text-violet-400">{parseFloat(order.points || '0').toFixed(0)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Data</p>
                    <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Entrega</p>
                    <p className={cn('text-sm font-medium', deliveryStatus?.color || 'text-muted-foreground')}>
                        {deliveryStatus?.label || '--'}
                    </p>
                </div>
            </div>

            {/* Itens do pedido */}
            {order.personal_order_items && order.personal_order_items.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Itens do pedido
                    </p>
                    <div className="space-y-2">
                        {order.personal_order_items.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                    <Tag className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {item.internationalization?.product_name || `Produto #${item.product_id}`}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">Item #{item.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
