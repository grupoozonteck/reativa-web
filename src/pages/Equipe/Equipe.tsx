import { Users, Crown, ShieldCheck, Headphones, Phone, Mail, TrendingUp, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { teamMembers, type TeamMember } from '@/data/mock';
import { cn } from '@/lib/utils';

const roleConfig = {
    gerente: { label: 'Gerente', icon: Crown, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
    supervisor: { label: 'Supervisor', icon: ShieldCheck, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
    atendente: { label: 'Atendente', icon: Headphones, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
};

function MemberCard({ member, compact = false }: { member: TeamMember; compact?: boolean }) {
    const cfg = roleConfig[member.role];
    return (
        <div className={cn('glass-card rounded-xl transition-all duration-200 hover:border-white/[0.12] hover:-translate-y-0.5', compact ? 'p-3' : 'p-4')}>
            <div className="flex items-start gap-3">
                <div className={cn(
                    'rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shrink-0',
                    compact ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm'
                )}>
                    {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn('font-semibold truncate', compact ? 'text-sm' : 'text-[15px]')}>{member.name}</p>
                        <Badge variant="outline" className={cn('text-[9px] px-1.5 h-4 gap-1', cfg.color)}>
                            <cfg.icon className="w-2.5 h-2.5" />
                            {cfg.label}
                        </Badge>
                    </div>
                    <div className="flex gap-3 mt-0.5">
                        <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                            <Mail className="w-2.5 h-2.5" /> {member.email}
                        </a>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{member.phone}</span>
                    </div>
                </div>
            </div>

            {member.role !== 'gerente' && (
                <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="text-sm font-bold">{member.salesCount}</p>
                        <p className="text-[9px] text-muted-foreground">Vendas</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold">R${(member.salesValue / 1000).toFixed(1)}k</p>
                        <p className="text-[9px] text-muted-foreground">Receita</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold">{member.conversionRate}%</p>
                        <p className="text-[9px] text-muted-foreground">Conv.</p>
                    </div>
                    {!compact && (
                        <div className="col-span-3 mt-1">
                            <Progress value={member.conversionRate} className="h-1 bg-white/5" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Equipe() {
    const manager = teamMembers.find(m => m.role === 'gerente')!;
    const supervisors = teamMembers.filter(m => m.role === 'supervisor');
    const attendants = teamMembers.filter(m => m.role === 'atendente');

    const getAttendants = (supervisorId: number) =>
        attendants.filter(a => a.supervisorId === supervisorId);

    const totalSales = attendants.reduce((sum, a) => sum + a.salesValue, 0);
    const totalCount = attendants.reduce((sum, a) => sum + a.salesCount, 0);

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-1">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Equipe Comercial</h1>
                </div>
                <p className="text-muted-foreground text-sm">Hierarquia: Gerente → Supervisores → Atendentes</p>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Atendentes', value: attendants.length, icon: Headphones, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Supervisores', value: supervisors.length, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Vendas (mês)', value: totalCount, icon: ShoppingCart, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Receita (mês)', value: `R$ ${(totalSales / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((s, i) => (
                    <div key={s.label} className="glass-card rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', s.bg)}>
                            <s.icon className={cn('w-4 h-4', s.color)} />
                        </div>
                        <p className="text-xl font-bold">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Organograma */}
            {/* Gerente */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Gerente
                </p>
                <div className="max-w-sm">
                    <MemberCard member={manager} />
                </div>
            </div>

            {/* Supervisores e seus atendentes */}
            {supervisors.map((sup, si) => {
                const myAttendants = getAttendants(sup.id);
                return (
                    <div key={sup.id} className="space-y-3 animate-fade-in" style={{ animationDelay: `${300 + si * 100}ms` }}>
                        {/* Linha do supervisor com conexor visual */}
                        <div className="flex items-center gap-3">
                            <div className="ml-4 w-px h-6 bg-border/50" />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Supervisor
                            </p>
                        </div>
                        <div className="ml-4 pl-4 border-l border-border/40 space-y-4">
                            <div className="max-w-sm">
                                <MemberCard member={sup} />
                            </div>

                            {/* Atendentes deste supervisor */}
                            <div>
                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                    <div className="w-px h-3 bg-border/50" />
                                    <Headphones className="w-3 h-3 text-blue-400" /> Atendentes ({myAttendants.length})
                                </p>
                                <div className="ml-4 pl-4 border-l border-border/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {myAttendants.map((a, ai) => (
                                            <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${400 + si * 100 + ai * 60}ms` }}>
                                                <MemberCard member={a} compact />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
