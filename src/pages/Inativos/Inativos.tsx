import { useState } from 'react';
import { UserX, Phone, Mail, MapPin, UserCheck, AlertCircle, Clock, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { inactiveClients, teamMembers, type InactiveClient } from '@/data/mock';
import { cn } from '@/lib/utils';

const attendants = teamMembers.filter(m => m.role === 'atendente');

const statusConfig = {
    nunca_comprou: { label: 'Nunca comprou', icon: AlertCircle, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    inativo_90: { label: '+90 dias', icon: Clock, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

function ClientCard({ client, onAssign }: { client: InactiveClient; onAssign: (c: InactiveClient) => void }) {
    const cfg = statusConfig[client.status];
    const assignedTo = teamMembers.find(m => m.id === client.assignedTo);

    return (
        <div className="glass-card rounded-xl p-4 hover:border-white/[0.12] transition-all duration-200 animate-fade-in">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="font-semibold text-sm">{client.name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" /> {client.city} — {client.state}
                    </div>
                </div>
                <Badge variant="outline" className={cn('text-[10px] shrink-0', cfg.color)}>
                    <cfg.icon className="w-2.5 h-2.5 mr-1" />
                    {cfg.label}
                </Badge>
            </div>

            <div className="space-y-1 mb-3">
                <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-3 h-3 shrink-0" /> {client.email}
                </a>
                <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-3 h-3 shrink-0" /> {client.phone}
                </a>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    {client.totalSpent > 0 && (
                        <span className="text-[11px] text-muted-foreground">
                            Histórico: <span className="text-foreground font-semibold">R$ {client.totalSpent.toLocaleString('pt-BR')}</span>
                        </span>
                    )}
                    {client.lastPurchase && (
                        <p className="text-[10px] text-muted-foreground/60">Última compra: {new Date(client.lastPurchase).toLocaleDateString('pt-BR')}</p>
                    )}
                </div>
                {assignedTo ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">{assignedTo.name.split(' ')[0]}</span>
                    </div>
                ) : (
                    <Button size="sm" variant="outline" onClick={() => onAssign(client)} className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        Atribuir
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function Inativos() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<InactiveClient | null>(null);
    const [clients, setClients] = useState(inactiveClients);

    const filter = (list: InactiveClient[]) =>
        list.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.city.toLowerCase().includes(search.toLowerCase())
        );

    const nunca = filter(clients.filter(c => c.status === 'nunca_comprou'));
    const inativo = filter(clients.filter(c => c.status === 'inativo_90'));
    const todos = filter(clients);

    const handleAssign = (attendantId: number) => {
        if (!selected) return;
        setClients(prev => prev.map(c => c.id === selected.id ? { ...c, assignedTo: attendantId } : c));
        setSelected(null);
    };

    return (
        <div className="p-6 space-y-5 max-w-6xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-1">
                    <UserX className="w-6 h-6 text-red-400" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Clientes Inativos</h1>
                </div>
                <p className="text-muted-foreground text-sm">Clientes para reativação pela equipe comercial</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou cidade..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 h-10"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="todos">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="todos" className="text-xs">Todos ({todos.length})</TabsTrigger>
                    <TabsTrigger value="nunca" className="text-xs">Nunca compraram ({nunca.length})</TabsTrigger>
                    <TabsTrigger value="inativo" className="text-xs">+90 dias ({inativo.length})</TabsTrigger>
                </TabsList>

                {[
                    { value: 'todos', data: todos },
                    { value: 'nunca', data: nunca },
                    { value: 'inativo', data: inativo },
                ].map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {tab.data.map(c => (
                                <ClientCard key={c.id} client={c} onAssign={setSelected} />
                            ))}
                            {tab.data.length === 0 && (
                                <p className="text-muted-foreground text-sm col-span-full text-center py-8">
                                    Nenhum cliente encontrado
                                </p>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Dialog: Atribuir */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Atribuir para atendente</DialogTitle>
                        <DialogDescription>
                            Selecione quem ficará responsável por <span className="text-foreground font-semibold">{selected?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 mt-2">
                        {attendants.map(a => (
                            <button
                                key={a.id}
                                onClick={() => handleAssign(a.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/[0.08] border-white/10 hover:border-blue-500/30 transition-all text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                    {a.avatar}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{a.name}</p>
                                    <p className="text-xs text-muted-foreground">{a.activeClients} clientes ativos · {a.conversionRate}% conv.</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">
                                    {a.salesCount} vendas
                                </Badge>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
