import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency } from '@/utils/client-utils';
import { financialService } from '../../services/financial.service';
import { CommissionStatCard } from '@/components/Commissions/CommissionStatCard';
import { CommissionsTable } from '@/components/Commissions/CommissionsTable';
import { CommissionsFilters } from '@/components/Commissions/CommissionsFilters';
import { DollarSign, TrendingUp, FileText } from 'lucide-react';
import { getCurrentMonthDateRange } from '@/utils/date-range';
import { useAuth } from '@/contexts/useAuth';
import { UserRole } from '@/config/permissions';

export default function Comissoes() {
    const { userType } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultRange = getCurrentMonthDateRange();
    const appliedSearch = searchParams.get('login') ?? '';
    const appliedStartDate =
        searchParams.get('start_date') ?? defaultRange.startDate;
    const appliedEndDate = searchParams.get('end_date') ?? defaultRange.endDate;
    const appliedWithoutLeader = searchParams.get('without_leader') === 'true';
    const [search, setSearch] = useState(appliedSearch);
    const [startDate, setStartDate] = useState(appliedStartDate);
    const [endDate, setEndDate] = useState(appliedEndDate);
    const [withoutLeader, setWithoutLeader] = useState(appliedWithoutLeader);
    const [page, setPage] = useState(1);
    const isAttendant = userType === UserRole.ATENDENTE;

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: [
            'comissoes',
            appliedSearch,
            appliedStartDate,
            appliedEndDate,
            appliedWithoutLeader,
            page,
        ],
        queryFn: () =>
            financialService.getCommissions({
                login: appliedSearch || undefined,
                start_date: appliedStartDate || undefined,
                end_date: appliedEndDate || undefined,
                without_leader: isAttendant ? appliedWithoutLeader : undefined,
                page,
            }),
        placeholderData: keepPreviousData,
    });

    const handleApplyFilters = () => {
        setPage(1);
        setSearchParams(
            (params) => {
                if (search.trim()) params.set('login', search.trim());
                else params.delete('login');
                if (startDate && startDate !== defaultRange.startDate)
                    params.set('start_date', startDate);
                else params.delete('start_date');
                if (endDate && endDate !== defaultRange.endDate)
                    params.set('end_date', endDate);
                else params.delete('end_date');
                if (isAttendant && withoutLeader)
                    params.set('without_leader', 'true');
                else params.delete('without_leader');
                if (page !== 1) params.delete('page');
                return params;
            },
            { replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStartDate(defaultRange.startDate);
        setEndDate(defaultRange.endDate);
        setWithoutLeader(false);
        setPage(1);
        setSearchParams(
            (params) => {
                params.delete('login');
                params.delete('start_date');
                params.delete('end_date');
                params.delete('without_leader');
                params.delete('page');
                return params;
            },
            { replace: true },
        );
    };

    const hasActiveFilters =
        !!appliedSearch ||
        appliedStartDate !== defaultRange.startDate ||
        appliedEndDate !== defaultRange.endDate ||
        (isAttendant && appliedWithoutLeader);
    const hasDraftChanges =
        search !== appliedSearch ||
        startDate !== appliedStartDate ||
        endDate !== appliedEndDate ||
        (isAttendant && withoutLeader !== appliedWithoutLeader);

    const items = data?.data?.commissions?.data ?? [];
    const totalCommissions = Number(data?.data?.total_commissions_value ?? 0);
    const totalRecords = data?.data?.commissions?.total ?? items.length;
    const currentPage = data?.data?.commissions?.current_page ?? page;
    const hasNextPage = !!data?.data?.commissions?.next_page_url;
    const hasPrevPage = !!data?.data?.commissions?.prev_page_url;
    const showingFrom = data?.data?.commissions?.from ?? 0;
    const showingTo = data?.data?.commissions?.to ?? 0;
    const totalOrdersValue = data?.data?.total_orders_value ?? 0;

    const handleNextPage = () => {
        if (hasNextPage) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setPage((prev) => Math.max(1, prev - 1));
        }
    };

    return (
        <div className="p-2 py-6 sm:p-6 sm:py-8 space-y-4 sm:space-y-5 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="bg-primary/10 rounded-lg p-1.5">
                        <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">
                        Comissões
                    </h1>
                </div>
            </div>

            {/* Filters */}
            <CommissionsFilters
                search={search}
                startDate={startDate}
                endDate={endDate}
                withoutLeader={withoutLeader}
                showWithoutLeaderFilter={isAttendant}
                onSearchChange={setSearch}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onWithoutLeaderChange={setWithoutLeader}
                onApplyFilters={handleApplyFilters}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                hasDraftChanges={hasDraftChanges}
                isFetching={isFetching}
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
                <CommissionStatCard
                    label="Total de Comissões"
                    value={formatCurrency(totalCommissions)}
                    icon={DollarSign}
                    iconColor="text-primary"
                    valueColor="text-primary [text-shadow:0_0_12px_hsl(83_98%_64%_/_0.35)]"
                />
                <CommissionStatCard
                    label="Total em Pedidos"
                    value={formatCurrency(totalOrdersValue)}
                    icon={TrendingUp}
                    iconColor="text-secondary"
                    valueColor="text-secondary"
                />
                <CommissionStatCard
                    label="Registros"
                    value={String(totalRecords)}
                    icon={FileText}
                    iconColor="text-on-surface-variant"
                    valueColor="text-on-surface"
                />
            </div>

            {/* Table */}
            <CommissionsTable
                items={items}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                showingFrom={showingFrom}
                showingTo={showingTo}
                currentPage={currentPage}
                hasPrevPage={hasPrevPage}
                hasNextPage={hasNextPage}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
            />
        </div>
    );
}
