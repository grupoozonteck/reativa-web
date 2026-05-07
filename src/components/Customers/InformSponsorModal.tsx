import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { customerService, type SponsorLeader } from '@/services/customer.service';
import { Loader2, Search, UserPlus, X, BadgeCheck, Mail, Hash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface InformSponsorModalProps {
    open: boolean;
    onClose: () => void;
    userId: number;
    existingLeader?: SponsorLeader | null;
    onUpdated?: () => void;
}

export function InformSponsorModal({ open, onClose, userId, existingLeader, onUpdated }: InformSponsorModalProps) {
    const [sponsorLogin, setSponsorLogin] = useState('');
    const [leader, setLeader] = useState<SponsorLeader | null>(null);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setSponsorLogin('');
            setLeader(null);
            setError(null);
            setSearching(false);
            setSaving(false);
        }
    }, [open]);

    useEffect(() => {
        if (open && existingLeader) {
            setLeader(existingLeader);
        }
    }, [open, existingLeader]);

    async function handleSearch() {
        if (!sponsorLogin.trim()) {
            setError('Informe o login do leader.');
            return;
        }

        setSearching(true);
        setError(null);
        try {
            const foundLeader = await customerService.searchSponsorLeader(sponsorLogin.trim());
            setLeader(foundLeader);
        } catch {
            setLeader(null);
            setError('Leader nao encontrado para esse login.');
        } finally {
            setSearching(false);
        }
    }

    async function handleSave() {
        if (!leader) {
            setError('Busque um leader valido antes de vincular.');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await customerService.updateSponsorLogin(userId, leader.id);
            if (onUpdated) onUpdated();
            onClose();
        } catch {
            setError('Erro ao vincular leader.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Informar lider</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Field className="flex w-full !justify-between">
                        <FieldLabel htmlFor="sponsor_login">Login do lider</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Input
                                id="sponsor_login"
                                value={sponsorLogin}
                                onChange={e => {
                                    setSponsorLogin(e.target.value);
                                    if (!existingLeader) setLeader(null);
                                }}
                                placeholder="Ex: joao123"
                                autoFocus
                                className="max-w-xs"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSearch}
                                disabled={searching || saving || !!existingLeader}
                            >
                                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                {searching ? 'Buscando...' : 'Buscar'}
                            </Button>
                        </div>
                        <FieldDescription className="text-slate-300">
                            Digite o login e clique em Buscar para validar antes de vincular o lider.
                        </FieldDescription>
                    </Field>

                    <div className="min-h-[148px] rounded-md border border-border bg-surface-container p-3 text-sm">
                        {leader ? (
                            <>
                                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Leader encontrado
                                </div>
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-[0_0_0_2px_rgba(0,0,0,0.15)]">
                                        <AvatarImage src={leader.personal_data?.avatar} />
                                        <AvatarFallback className="text-base font-bold">
                                            {leader.name
                                                .split(' ')
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map(part => part[0]?.toUpperCase())
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <p className="truncate font-semibold text-on-surface">{leader.name}</p>
                                        <p className="truncate text-slate-300">@{leader.login}</p>
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-slate-300">
                                                <Hash className="h-3 w-3" />
                                                {leader.id}
                                            </span>
                                            {leader.email && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-slate-300">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="max-w-[220px] truncate">{leader.email}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full min-h-[120px] items-center justify-center rounded-md border border-dashed border-border/80 bg-background/20 p-3">
                                <p className="text-center text-slate-300">
                                    Nenhum lider selecionado. Busque um login para validar antes de vincular.
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="min-h-5">
                            <div className="text-red-500 text-sm">{error}</div>
                        </div>
                    )}

                    {existingLeader && (
                        <div className="text-xs text-slate-300">
                            Este cliente ja possui leader vinculado. A vinculacao foi bloqueada.
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-3">
                    <Button variant="destructive" onClick={onClose} disabled={searching || saving}>
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={searching || saving || !leader || !!existingLeader}>
                        <UserPlus className="w-4 h-4" />
                        {saving ? 'Vinculando...' : 'Vincular leader'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
