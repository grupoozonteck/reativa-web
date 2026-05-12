import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamService, type AttendantLeaderOption } from '@/services/team.service';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const createAttendantSchema = z.object({
    userLogin: z
        .string()
        .trim()
        .min(1, 'Informe o login do atendente.')
        .min(3, 'O login precisa ter pelo menos 3 caracteres.'),
    type: z.string().min(1, 'Selecione o cargo.'),
    status: z.string().min(1, 'Selecione o status.'),
    supervisorId: z.string().min(1, 'Selecione a lideranca responsavel.'),
    graduation: z.string().min(1, 'Selecione a graduacao.'),
});

type CreateAttendantFormValues = z.infer<typeof createAttendantSchema>;
type FormField = keyof CreateAttendantFormValues;
type FormErrors = Partial<Record<FormField, string>>;

function extractApiErrorMessage(err: unknown, fallback: string) {
    if (!(err instanceof Object) || !('response' in err)) {
        return fallback;
    }

    const response = (err as {
        response?: {
            data?: {
                message?: string;
                errors?: Record<string, string[]>;
            };
        };
    }).response;

    const message = response?.data?.message;
    const errors = response?.data?.errors;

    const detailedErrors = errors
        ? Object.values(errors)
              .flat()
              .filter(Boolean)
        : [];

    if (detailedErrors.length > 0) {
        return detailedErrors.join(' | ');
    }

    return message ?? fallback;
}

function getFieldError(field: FormField, values: CreateAttendantFormValues) {
    const result = createAttendantSchema.safeParse(values);
    if (result.success) {
        return undefined;
    }

    const issue = result.error.issues.find((currentIssue) => currentIssue.path[0] === field);
    return issue?.message;
}

interface CreateAttendantModalProps {
    open: boolean;
    onClose: () => void;
    supervisors: AttendantLeaderOption[];
    gestor?: AttendantLeaderOption | null;
    types: Record<string, string>;
    graduates: Record<string, string>;
    statusOptions: Record<string, string>;
    onCreated?: () => void;
}

export function CreateAttendantModal({
    open,
    onClose,
    supervisors,
    gestor,
    types,
    graduates,
    statusOptions,
    onCreated,
}: CreateAttendantModalProps) {
    const [userLogin, setUserLogin] = useState('');
    const [supervisorId, setSupervisorId] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [graduation, setGraduation] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const values = useMemo(
        () => ({
            userLogin,
            supervisorId,
            status,
            type,
            graduation,
        }),
        [graduation, status, supervisorId, type, userLogin],
    );

    const isCreatingSupervisor = type === '2';
    const availableTypes = useMemo(() => Object.entries(types).filter(([key]) => key !== '1'), [types]);

    const leaderOptions = useMemo(() => {
        if (isCreatingSupervisor) {
            return gestor ? [{ id: gestor.id, name: gestor.name, login: gestor.login }] : [];
        }

        return supervisors.map((supervisor) => ({
            id: supervisor.id,
            name: supervisor.name,
            login: supervisor.login,
        }));
    }, [gestor, isCreatingSupervisor, supervisors]);

    useEffect(() => {
        if (!supervisorId) {
            return;
        }

        const selectedLeaderIsAvailable = leaderOptions.some((leader) => String(leader.id) === supervisorId);
        if (!selectedLeaderIsAvailable) {
            setSupervisorId('');
        }
    }, [leaderOptions, supervisorId]);

    useEffect(() => {
        if (!fieldErrors.supervisorId) {
            return;
        }

        setFieldErrors((current) => ({
            ...current,
            supervisorId: getFieldError('supervisorId', values),
        }));
    }, [fieldErrors.supervisorId, values]);

    function resetForm() {
        setUserLogin('');
        setSupervisorId('');
        setStatus('');
        setType('');
        setGraduation('');
        setSubmitError(null);
        setFieldErrors({});
    }

    function handleClose() {
        if (!loading) {
            resetForm();
            onClose();
        }
    }

    function handleFieldValidation(field: FormField) {
        setFieldErrors((current) => ({
            ...current,
            [field]: getFieldError(field, values),
        }));
    }

    function handleFieldChange<T>(field: FormField, nextValue: T, setter: (value: T) => void) {
        setter(nextValue);
        setSubmitError(null);

        if (fieldErrors[field]) {
            const nextValues = {
                ...values,
                [field]: nextValue,
            } as CreateAttendantFormValues;

            setFieldErrors((current) => ({
                ...current,
                [field]: getFieldError(field, nextValues),
            }));
        }
    }

    async function handleSubmit() {
        const result = createAttendantSchema.safeParse(values);

        if (!result.success) {
            const nextErrors: FormErrors = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0] as FormField;
                if (!nextErrors[field]) {
                    nextErrors[field] = issue.message;
                }
            }

            setFieldErrors(nextErrors);
            setSubmitError('Revise os campos destacados.');
            return;
        }

        setLoading(true);
        setSubmitError(null);
        try {
            await teamService.createAttendant({
                user_login: result.data.userLogin,
                supervisor_id: Number(result.data.supervisorId),
                status: Number(result.data.status),
                type: Number(result.data.type),
                graduation: Number(result.data.graduation),
            });
            onCreated?.();
            resetForm();
            onClose();
        } catch (err: unknown) {
            setSubmitError(extractApiErrorMessage(err, 'Erro ao criar atendente. Tente novamente.'));
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

                <FieldGroup className="gap-4">
                    <Field className="gap-1.5" data-invalid={Boolean(fieldErrors.userLogin)}>
                        <FieldLabel>Login do Atendente</FieldLabel>
                        <FieldContent>
                            <Input
                                value={userLogin}
                                onChange={(e) => handleFieldChange('userLogin', e.target.value, setUserLogin)}
                                onBlur={() => handleFieldValidation('userLogin')}
                                disabled={loading}
                                placeholder="Ex.: joao.silva"
                                aria-invalid={Boolean(fieldErrors.userLogin)}
                            />
                        </FieldContent>
                        <FieldDescription>Use o login exato ja cadastrado na plataforma.</FieldDescription>
                        <FieldError>{fieldErrors.userLogin}</FieldError>
                    </Field>

                    <Field className="gap-1.5" data-invalid={Boolean(fieldErrors.type)}>
                        <FieldLabel>Cargo</FieldLabel>
                        <FieldContent>
                            <Select value={type} onValueChange={(value) => handleFieldChange('type', value, setType)} disabled={loading}>
                                <SelectTrigger
                                    aria-invalid={Boolean(fieldErrors.type)}
                                    onBlur={() => handleFieldValidation('type')}
                                >
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
                        </FieldContent>
                        <FieldError>{fieldErrors.type}</FieldError>
                    </Field>

                    <Field className="gap-1.5" data-invalid={Boolean(fieldErrors.status)}>
                        <FieldLabel>Status</FieldLabel>
                        <FieldContent>
                            <Select
                                value={status}
                                onValueChange={(value) => handleFieldChange('status', value, setStatus)}
                                disabled={loading}
                            >
                                <SelectTrigger
                                    aria-invalid={Boolean(fieldErrors.status)}
                                    onBlur={() => handleFieldValidation('status')}
                                >
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusOptions).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                        <FieldError>{fieldErrors.status}</FieldError>
                    </Field>

                    <Field className="gap-1.5" data-invalid={Boolean(fieldErrors.supervisorId)}>
                        <FieldLabel>{isCreatingSupervisor ? 'Gestor' : 'Lider'}</FieldLabel>
                        <FieldContent>
                            <Select
                                value={supervisorId}
                                onValueChange={(value) => handleFieldChange('supervisorId', value, setSupervisorId)}
                                disabled={loading || !type}
                            >
                                <SelectTrigger
                                    aria-invalid={Boolean(fieldErrors.supervisorId)}
                                    onBlur={() => handleFieldValidation('supervisorId')}
                                >
                                    <SelectValue
                                        placeholder={isCreatingSupervisor ? 'Selecione o gestor' : 'Selecione o lider'}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaderOptions.map((leader) => (
                                        <SelectItem key={leader.id} value={String(leader.id)}>
                                            {leader.name} (@{leader.login})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                        <FieldDescription>
                            {!type
                                ? 'Escolha o cargo primeiro para liberar a lideranca.'
                                : isCreatingSupervisor
                                  ? 'Supervisores devem ficar vinculados a um gestor.'
                                  : 'Atendentes devem ficar vinculados a um supervisor.'}
                        </FieldDescription>
                        <FieldError>{fieldErrors.supervisorId}</FieldError>
                    </Field>

                    <Field className="gap-1.5" data-invalid={Boolean(fieldErrors.graduation)}>
                        <FieldLabel>Graduacao</FieldLabel>
                        <FieldContent>
                            <Select
                                value={graduation}
                                onValueChange={(value) => handleFieldChange('graduation', value, setGraduation)}
                                disabled={loading}
                            >
                                <SelectTrigger
                                    aria-invalid={Boolean(fieldErrors.graduation)}
                                    onBlur={() => handleFieldValidation('graduation')}
                                >
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
                        </FieldContent>
                        <FieldError>{fieldErrors.graduation}</FieldError>
                    </Field>

                    <FieldError>{submitError}</FieldError>
                </FieldGroup>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
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
