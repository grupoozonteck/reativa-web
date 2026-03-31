import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/client-utils';
import { financialService } from '../../services/financial.service';
import { CommissionStatCard } from '@/components/Comisoes/CommissionStatCard';
import { CommissionsTable } from '@/components/Comisoes/CommissionsTable';
import { CommissionsFilters } from '@/components/Comisoes/CommissionsFilters';
import { DollarSign, TrendingUp, FileText } from 'lucide-react';


export default function Comissoes() {
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ['comissoes', search, startDate, endDate, page],
        queryFn: () => financialService.getCommissions({
            login: search || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            page,
        }),
        placeholderData: keepPreviousData,
    });

    const clearFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const hasActiveFilters = !!search || !!startDate || !!endDate;

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
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setPage(prev => Math.max(1, prev - 1));
        }
    };

    return (
        <div className="p-3 py-6 sm:p-6 sm:py-8 space-y-4 sm:space-y-5 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="bg-primary/10 rounded-lg p-1.5">
                        <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">Comissões</h1>
                </div>
                <p className="text-on-surface-variant text-xs sm:text-sm mt-1 ml-0.5">
                    Visualize comissões por período e acompanhe os totais da equipe
                </p>
            </div>

            {/* Filters */}
            <CommissionsFilters
                search={search}
                startDate={startDate}
                endDate={endDate}
                onSearchChange={setSearch}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
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