import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type ManagerAttendant } from '@/services/team.service';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getInitials } from '@/utils/client-utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { TableEmptyState } from '@/components/ui/table-empty-state';

const typeColors: Record<number, string> = {
    1: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    2: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    3: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
};

interface AttendantsListProps {
    attendants: ManagerAttendant[];
    total?: number;
    isLoading: boolean;
    isFetching: boolean;
}

export function AttendantsList({ attendants, total, isLoading, isFetching }: AttendantsListProps) {
    return (
        <div className="solid-card overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">Atendentes</h2>
                        <p className="text-xs text-muted-foreground">Lista completa de todos os atendentes</p>
                    </div>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="ml-2 text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        >
                            {total ?? attendants.length}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Tabela */}
            <div className={cn('overflow-x-auto transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Atendente</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Graduação</TableHead>
                            <TableHead className="text-right">Líder</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton
                                rows={8}
                                columns={[
                                    { type: 'avatar', width: 'w-32' },
                                    { type: 'badge', width: 'w-20' },
                                    { type: 'badge', width: 'w-20' },
                                    { type: 'text', width: 'w-14' },
                                    { type: 'text', width: 'w-24', align: 'right' },
                                    { type: 'text', width: 'w-8', align: 'right' },
                                ]}
                            />
                        ) : attendants.length === 0 ? (
                            <TableEmptyState
                                colSpan={6}
                                icon={Users}
                                message="Nenhum atendente encontrado"
                            />
                        ) : (
                            attendants.map(attendant => (
                                <TableRow
                                    key={attendant.id}
                                    className="hover:bg-muted/40 "
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={attendant.user.personal_data?.avatar} />
                                                <AvatarFallback>{getInitials(attendant.user?.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium  truncate">{attendant.user?.name}</p>
                                                <p className="text truncate">@{attendant.user?.login}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(' px-2 h-5', typeColors[attendant.type])}>
                                            {attendant.type_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={attendant.status ?? null} />
                                    </TableCell>
                                    <TableCell>
                                        {attendant.graduation_label}
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        {attendant.parent?.user?.name ? (
                                            attendant.parent.user.name
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        <Link to={`/attendants/${attendant.id}`} className="bg-primary text-slate-950 px-2 py-1 rounded">
                                            vizualizar
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
