import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { customerService } from '@/services/customer.service';

interface EditClienteModalProps {
    open: boolean;
    onClose: () => void;
    userId: number;
    initialEmail: string;
    initialBirthDate: string;
    initialStatus: number;
    statusOptions: Record<string, string>;
    onUpdated?: () => void;
}

export function EditClienteModal({
    open,
    onClose,
    userId,
    initialEmail,
    initialBirthDate,
    initialStatus,
    statusOptions,
    onUpdated,
}: EditClienteModalProps) {
    const [email, setEmail] = useState(initialEmail);
    const [birthDate, setBirthDate] = useState(initialBirthDate);
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave() {
        setLoading(true);
        setError(null);
        try {
            await customerService.updateUserData(userId, { email, birth_date: birthDate });
            await customerService.updateUserStatus(userId, status);
            if (onUpdated) onUpdated();
            onClose();
        } catch {
            setError('Erro ao atualizar dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar dados do cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                    </div>
                    <div>
                        <Label htmlFor="birth">Data de nascimento</Label>
                        <Input id="birth" value={birthDate} onChange={e => setBirthDate(e.target.value)} type="date" />
                    </div>
                    <div>
                        <Label htmlFor="status">Status do atendimento</Label>
                        <select
                            id="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={status}
                            onChange={e => setStatus(Number(e.target.value))}
                        >
                            {Object.entries(statusOptions).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
