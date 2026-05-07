export interface DefaultDateRange {
    startDate: string;
    endDate: string;
}

export function getCurrentMonthDateRange(referenceDate = new Date()): DefaultDateRange {
    const currentYear = referenceDate.getFullYear();
    const currentMonth = String(referenceDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(referenceDate.getDate()).padStart(2, '0');

    return {
        startDate: `${currentYear}-${currentMonth}-01`,
        endDate: `${currentYear}-${currentMonth}-${currentDay}`,
    };
}
