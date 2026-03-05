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
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate, formatDateTime } from '@/lib/client-utils';
import {
    customerService,
    type PersonalOrder,
} from '@/services/customer.service';
import { EditClienteModal } from '@/components/Clientes/EditClienteModal';
import { CustomerDetailInfoItem } from '@/components/Clientes/CustomerDetailInfoItem';
import { CustomerLatestOrderCard } from '@/components/Clientes/CustomerLatestOrderCard';

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
            <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
                {/* Header */}
                <div className="animate-fade-in space-y-3">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="w-9 h-9 rounded-xl shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-extrabold tracking-tight truncate">Detalhes do Cliente</h1>
                        
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 flex-row">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleAccessStore}
                            disabled={accessingStore}
                            className="gap-2 sm:w-auto bg-green-500 hover:bg-green-600 text-white"
                        >
                            {accessingStore ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Store className="w-4 h-4" />
                            )}
                            Acessar conta
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setEditModalOpen(true)}
                            className="gap-2 sm:w-auto "
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
                                <h2 className="text-lg font-bold">{user.name}</h2>
                                <p className="text-sm text-muted-foreground truncate">#{user.id} - {user.login}</p>
                                {reengStatus && (
                                    <Badge className={cn('text- border w-fit', reengStatus.color)}>
                                        {reengStatus.label}
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <CustomerDetailInfoItem icon={Mail} iconBg="bg-violet-500" label={<span className="truncate block">{user.email || '--'}</span>} />
                                <CustomerDetailInfoItem
                                    icon={MessageCircle}
                                    iconBg="bg-emerald-500"
                                    label={
                                        hasWhatsapp ? (
                                            <a
                                                href={getWhatsAppLink(whatsapp)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1.5 min-w-0"
                                            >
                                                <span className="truncate">{formatWhatsApp(whatsapp)}</span>
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span>--</span>
                                        )
                                    }
                                />
                                <CustomerDetailInfoItem icon={Phone} iconBg="bg-blue-500" label={<span className="truncate block">{formatWhatsApp(user.phone_number)}</span>} />
                                <CustomerDetailInfoItem icon={Calendar} iconBg="bg-amber-500" label={<span className="truncate block">Cadastro: {formatDate(user.created_at)}</span>} />
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
                {order && <CustomerLatestOrderCard order={order} orderStatusCollection={orderStatusCollection} />}

                {/* Ações rápidas */}
                <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <h3 className="text-sm font-semibold mb-4">Ações rápidas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hasWhatsapp ? (
                            <a
                                href={getWhatsAppLink(whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                    <MessageCircle className="w-4 h-4" />
                                    Enviar WhatsApp
                                </Button>
                            </a>
                        ) : (
                            <Button disabled className="gap-2 w-full">
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp indisponível
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="gap-2 w-full"
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
