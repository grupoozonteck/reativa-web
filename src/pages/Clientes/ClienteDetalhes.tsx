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
    User,
    ShoppingBag,
    AlertCircle,
    Edit,
    Store,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate, formatDateTime } from '@/utils/client-utils';
import {
    customerService,
} from '@/services/customer.service';
import { EditClienteModal } from '@/components/Clientes/EditClienteModal';
import { CustomerDetailInfoItem } from '@/components/Clientes/CustomerDetailInfoItem';
import { CustomerLatestOrderCard } from '@/components/Clientes/CustomerLatestOrderCard';
import { reengagementStatusMap } from '@/utils/color-ultis';


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
    const reengagement = data?.customerReengagement ?? null;
    const statusMap = data?.statusReengagements ?? {};
    const orderStatusCollection = data?.statusOrderCollection ?? {};

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-on-surface-variant">Carregando detalhes do cliente...</p>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                    <p className="text-sm text-on-surface-variant">Erro ao carregar os detalhes do cliente.</p>
                    <Button variant="ghost" onClick={() => navigate('/clientes')} className="gap-2 text-on-surface-variant hover:text-primary">
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
    const orders = (user.personal_orders ?? []).slice().sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const address = user.personal_address;
    const reengStatus = reengagement ? reengagementStatusMap[reengagement.status] : null;
    const hasWhatsapp = !!whatsapp;




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
            <div className="p-4 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="animate-fade-in space-y-3">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="w-9 h-9 rounded-xl shrink-0 text-on-surface-variant hover:text-primary hover:bg-primary/10"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-display text-xl font-black tracking-tight truncate text-on-surface">Detalhes do Cliente</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 flex-row">
                        <Button
                            size="sm"
                            onClick={handleAccessStore}
                            disabled={accessingStore}
                            className="gap-2 sm:w-auto bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold"
                        >
                            {accessingStore ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Store className="w-4 h-4" />
                            )}
                            Acessar conta
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditModalOpen(true)}
                            className="gap-2 sm:w-auto bg-surface-highest text-on-surface-variant hover:text-on-surface"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
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
                                <h2 className="font-display text-lg font-bold text-on-surface">{user.name}</h2>
                                <p className="text-sm text-on-surface-variant font-mono truncate">#{user.id} · {user.login}</p>
                                {reengStatus && (
                                    <Badge className={cn('text- border w-fit', reengStatus.color)}>
                                        {reengStatus.label}
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <CustomerDetailInfoItem icon={Mail} iconBg="bg-accent/20 text-accent" label={<span className="truncate block">{user.email || '--'}</span>} />
                                <CustomerDetailInfoItem
                                    icon={MessageCircle}
                                    iconBg="bg-primary/10 text-primary"
                                    label={
                                        hasWhatsapp ? (
                                            <a
                                                href={getWhatsAppLink(whatsapp)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 min-w-0"
                                            >
                                                <span className="truncate">{formatWhatsApp(whatsapp)}</span>
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span>--</span>
                                        )
                                    }
                                />
                                <CustomerDetailInfoItem icon={Phone} iconBg="bg-secondary/10 text-secondary" label={<span className="truncate block">{formatWhatsApp(user.phone_number)}</span>} />
                                <CustomerDetailInfoItem icon={Calendar} iconBg="bg-surface-highest text-on-surface-variant" label={<span className="truncate block">Cadastro: {formatDate(user.created_at)}</span>} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de 2 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Endereço */}
                    <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '120ms', opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-accent" />
                            </div>
                            <h3 className="font-display text-sm font-semibold text-on-surface">Endereço</h3>
                        </div>
                        {address ? (
                            <div className="space-y-1.5 text-sm text-on-surface-variant">
                                <p>{address.address_line}, {address.number}</p>
                                {address.complement && <p>{address.complement}</p>}
                                <p>{address.district}</p>
                                <p>{address.city?.name}{address.state?.name ? ` - ${address.state.name}` : ''}</p>
                                <p>CEP: {address.zip_code}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-variant/50">Sem endereço cadastrado</p>
                        )}
                    </div>

                    {/* Info do Atendimento */}
                    <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '180ms', opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-secondary" />
                            </div>
                            <h3 className="font-display text-sm font-semibold text-on-surface">Atendimento</h3>
                        </div>
                        {reengagement ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-on-surface-variant">Status</span>
                                    <Badge className={cn('text-xs border', reengStatus?.color)}>
                                        {reengStatus?.label || statusMap[String(reengagement.status)] || 'Desconhecido'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-on-surface-variant">Iniciado em</span>
                                    <span className="text-sm font-medium text-on-surface">{formatDateTime(reengagement.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-on-surface-variant">ID Atendimento</span>
                                    <span className="text-sm font-mono text-on-surface-variant">#{reengagement.id}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-variant/50">Sem dados de atendimento</p>
                        )}
                    </div>
                </div>

                {/* Pedidos */}
                {orders.map((order) => (
                    <CustomerLatestOrderCard key={order.id} order={order} orderStatusCollection={orderStatusCollection} />
                ))}

                {/* Ações rápidas */}
                <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Ações rápidas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hasWhatsapp ? (
                            <a
                                href={getWhatsAppLink(whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <Button className="gap-2 w-full bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:shadow-glow-primary-sm transition-shadow font-semibold">
                                    <MessageCircle className="w-4 h-4" />
                                    Enviar WhatsApp
                                </Button>
                            </a>
                        ) : (
                            <Button disabled variant="ghost" className="gap-2 w-full text-on-surface-variant opacity-40">
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp indisponível
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            className="gap-2 w-full bg-surface-highest text-on-surface-variant hover:text-on-surface"
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
