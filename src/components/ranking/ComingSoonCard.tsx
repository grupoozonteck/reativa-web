import { Clock3, type LucideIcon } from 'lucide-react';

interface ComingSoonCardProps {
    title: string;
    description: string;
    icon?: LucideIcon;
}

export function ComingSoonCard({ title, description, icon: Icon = Clock3 }: ComingSoonCardProps) {
    return (
        <div className="glass-card rounded-2xl p-5 border border-dashed border-white/10">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-amber-400" />
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {title}
                </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            <span className="inline-flex mt-3 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
                Em breve
            </span>
        </div>
    );
}
