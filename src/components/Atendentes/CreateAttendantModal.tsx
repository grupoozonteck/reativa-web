import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamService, type ManagerAttendant, type SupervisorAttendant } from '@/services/team.service';
import { Input } from '@/components/ui/input';

interface CreateAttendantModalProps {
    open: boolean;
    onClose: () => void;
    supervisors: SupervisorAttendant[];
    gestor?: ManagerAttendant | null;
    types: Record<string, string>;
    graduates: Record<string, string>;
    onCreated?: () => void;
}

export function CreateAttendantModal({
    open,
    onClose,
    supervisors,
    gestor,
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

    const isCreatingSupervisor = type === '2';
    const availableTypes = useMemo(
        () => Object.entries(types).filter(([key]) => key !== '1'),
        [types],
    );

    const leaderOptions = useMemo(() => {
        if (isCreatingSupervisor) {
            return gestor
                ? [{ id: gestor.user_id, name: gestor.user.name, login: gestor.user.login }]
                : [];
        }

        return supervisors.map((supervisor) => ({
            id: supervisor.user_id,
            name: supervisor.name,
            login: supervisor.login,
        }));
    }, [gestor, isCreatingSupervisor, supervisors]);

    useEffect(() => {
        if (!supervisorId) return;

        const selectedLeaderIsAvailable = leaderOptions.some((leader) => String(leader.id) === supervisorId);
        if (!selectedLeaderIsAvailable) {
            setSupervisorId('');
        }
    }, [leaderOptions, supervisorId]);

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
                    <div className="space-y-1.5">
                        <Label>Login do Atendente</Label>
                        <Input
                            value={userLogin}
                            onChange={(e) => setUserLogin(e.target.value)}
                            disabled={loading}
                            placeholder="Digite o login"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Cargo</Label>
                        <Select value={type} onValueChange={setType} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTypes.map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>{isCreatingSupervisor ? 'Gestor' : 'Lider'}</Label>
                        <Select value={supervisorId} onValueChange={setSupervisorId} disabled={loading || !type}>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={isCreatingSupervisor ? 'Selecione o gestor' : 'Selecione o lider'}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {leaderOptions.map((leader) => (
                                    <SelectItem key={leader.id} value={String(leader.id)}>
                                        {leader.name} <span className="text-muted-foreground">@{leader.login}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Graduacao</Label>
                        <Select value={graduation} onValueChange={setGraduation} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a graduacao" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(graduates).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
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
