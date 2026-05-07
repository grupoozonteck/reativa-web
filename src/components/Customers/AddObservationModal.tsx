import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '../ui/field';
import { customerService } from '@/services/customer.service';
import { X, StickyNote } from 'lucide-react';

interface AddObservationModalProps {
    open: boolean;
    onClose: () => void;
    reengagementId: number;
    onUpdated?: () => void;
}

export function AddObservationModal({ open, onClose, reengagementId, onUpdated }: AddObservationModalProps) {
    const [observation, setObservation] = useState('');
    const [nextContactDate, setNextContactDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave() {
        if (!observation.trim() || !nextContactDate) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await customerService.addObservation(reengagementId, {
                observation: observation.trim(),
                next_contact_date: nextContactDate,
            });
            setObservation('');
            setNextContactDate('');
            if (onUpdated) onUpdated();
            onClose();
        } catch {
            setError('Erro ao registrar observação.');
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setObservation('');
        setNextContactDate('');
        setError(null);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar observação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="observation">Observação</FieldLabel>
                        <textarea
                            id="observation"
                            value={observation}
                            onChange={e => setObservation(e.target.value)}
                            placeholder="Descreva o contato realizado..."
                            rows={4}
                            className="field-focus flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="next_contact_date">Próximo contato</FieldLabel>
                        <Input
                            id="next_contact_date"
                            type="datetime-local"
                            value={nextContactDate}
                            onChange={e => setNextContactDate(e.target.value)}
                        />
                    </Field>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleClose} disabled={loading}>
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        <StickyNote className="w-4 h-4" />
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
