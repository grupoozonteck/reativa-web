import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamService, type SupervisorAttendant } from '@/services/team.service';
import { Input } from '@/components/ui/input';

interface CreateAttendantModalProps {
    open: boolean;
    onClose: () => void;
    supervisors: SupervisorAttendant[];
    types: Record<string, string>;
    graduates: Record<string, string>;
    onCreated?: () => void;
}

export function CreateAttendantModal({
    open,
    onClose,
    supervisors,
    types,
    graduates,
    onCreated,
}: CreateAttendantModalProps) {
    const [userLogin, setUserLogin] = useState('');
    const [supervisorId, setSupervisorId] = useState('');
    const [type, setType] = useState('');
    const [graduation, setGraduation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function resetForm() {
        setUserLogin('');
        setSupervisorId('');
        setType('');
        setGraduation('');
        setError(null);
    }

    function handleClose() {
        if (!loading) {
            resetForm();
            onClose();
        }
    }

    async function handleSubmit() {
        if (!userLogin || !supervisorId || !type || !graduation) {
            setError('Preencha todos os campos.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await teamService.createAttendant({
                user_login: userLogin,
                supervisor_id: Number(supervisorId),
                type: Number(type),
                graduation: Number(graduation),
            });
            onCreated?.();
            resetForm();
            onClose();
        } catch (err: unknown) {
            const apiMessage =
                err instanceof Object &&
                'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;
            setError(apiMessage ?? 'Erro ao criar atendente. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo Atendente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Login do atendente */}
                    <div className="space-y-1.5">
                        <Label>Login do Atendente</Label>
                        <Input
                            value={userLogin}
                            onChange={(e) => setUserLogin(e.target.value)}
                            disabled={loading}
                            placeholder="Digite o login"
                        />
                    </div>

                    {/* Supervisor / Líder */}
                    <div className="space-y-1.5">
                        <Label>Líder</Label>
                        <Select value={supervisorId} onValueChange={setSupervisorId} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o líder" />
                            </SelectTrigger>
                            <SelectContent>
                                {supervisors.map((s) => (
                                    <SelectItem key={s.user_id} value={String(s.user_id)}>
                                        {s.name} <span className="text-muted-foreground">@{s.login}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tipo / Cargo */}
                    <div className="space-y-1.5">
                        <Label>Cargo</Label>
                        <Select value={type} onValueChange={setType} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(types).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Graduação */}
                    <div className="space-y-1.5">
                        <Label>Graduação</Label>
                        <Select value={graduation} onValueChange={setGraduation} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a graduação" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(graduates).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Atendente'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
